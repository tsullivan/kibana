/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo } from 'react';
import { EuiFlyout } from '@elastic/eui';
import type { ParsedItem, ParsedPart } from '@kbn/content-list-assembly';
import { flyoutAssembly } from './assembly';
import { FlyoutScrollProvider, FlyoutTemplateConfigProvider } from './context';
import { Body, BodyZone, BODY_PART_NAME } from './body/body';
import { Header, HeaderZone, HEADER_PART_NAME } from './header/header';
import { Footer, FooterZone, FOOTER_PART_NAME } from './footer/footer';
import type {
  FlyoutBodyProps,
  FlyoutFooterProps,
  FlyoutHeaderProps,
  FlyoutTemplateProps,
} from './types';

/**
 * Selects a single zone part by name. Validation policy: warn in development and
 * render the first match; never throw.
 */
const pickZone = (items: ParsedItem[], partName: string): ParsedPart | undefined => {
  const matches = items.filter(
    (item): item is ParsedPart => item.type === 'part' && item.part === partName
  );
  if (process.env.NODE_ENV !== 'production' && matches.length > 1) {
    // eslint-disable-next-line no-console
    console.warn(
      `[FlyoutTemplate] Multiple <FlyoutTemplate.${partName}> zones provided; rendering only the first.`
    );
  }
  return matches[0];
};

/**
 * Root of the declarative flyout template. Parses the declarative zone children
 * (`Header`, `Body`, `Footer`) and renders them inside `EuiFlyout` in PRD order
 * (header, body, footer) regardless of JSX order.
 *
 * Defaults to a managed flyout (`session="start"`) so EUI auto-provides the menu
 * bar. `session`, `historyKey`, `onActive`, `flyoutMenuProps`, and
 * `flyoutMenuDisplayMode` are passthrough overrides, as are the sizing/behavior
 * props `minWidth`, `ownFocus`, `resizable`, and `onResize`.
 */
const FlyoutTemplateRoot = ({
  children,
  onClose,
  size = 'm',
  minWidth,
  type,
  maxWidth,
  paddingSize,
  ownFocus,
  resizable,
  onResize,
  session = 'start',
  historyKey,
  onActive,
  flyoutMenuProps,
  flyoutMenuDisplayMode = 'auto',
  'aria-label': ariaLabel,
  'data-test-subj': dataTestSubj,
}: FlyoutTemplateProps) => {
  const items = useMemo(() => flyoutAssembly.parseChildren(children), [children]);

  const headerItem = pickZone(items, HEADER_PART_NAME);
  const bodyItem = pickZone(items, BODY_PART_NAME);
  const footerItem = pickZone(items, FOOTER_PART_NAME);

  if (process.env.NODE_ENV !== 'production' && !bodyItem) {
    // eslint-disable-next-line no-console
    console.warn('[FlyoutTemplate] A <FlyoutTemplate.Body> is required.');
  }

  const headerAttrs = headerItem?.attributes as FlyoutHeaderProps | undefined;
  const menuTitle = headerAttrs?.title;
  // EUI's menu title is a plain string (a11y/history); only forward string titles.
  const menuTitleString = typeof menuTitle === 'string' ? menuTitle : undefined;

  // Feed the header title to EUI's menu bar for a11y/history. The visible title
  // is still rendered by EuiFlyoutHeader; the menu title stays hidden by default.
  const mergedMenuProps = {
    ...(menuTitleString !== undefined ? { title: menuTitleString } : {}),
    ...flyoutMenuProps,
  };
  const hasMenuProps = Object.keys(mergedMenuProps).length > 0;

  return (
    <EuiFlyout
      onClose={onClose}
      size={size}
      minWidth={minWidth}
      type={type}
      maxWidth={maxWidth}
      paddingSize={paddingSize}
      ownFocus={ownFocus}
      resizable={resizable}
      onResize={onResize}
      session={session}
      historyKey={historyKey}
      onActive={onActive}
      flyoutMenuDisplayMode={flyoutMenuDisplayMode}
      flyoutMenuProps={hasMenuProps ? mergedMenuProps : undefined}
      aria-label={ariaLabel ?? menuTitleString}
      data-test-subj={dataTestSubj}
    >
      <FlyoutTemplateConfigProvider value={{ dataTestSubj }}>
        <FlyoutScrollProvider value={{ scrollIndex: 0, isCollapsed: false }}>
          {headerItem && <HeaderZone {...(headerAttrs as FlyoutHeaderProps)} />}
          {bodyItem && <BodyZone {...(bodyItem.attributes as FlyoutBodyProps)} />}
          {footerItem && <FooterZone {...(footerItem.attributes as FlyoutFooterProps)} />}
        </FlyoutScrollProvider>
      </FlyoutTemplateConfigProvider>
    </EuiFlyout>
  );
};

/**
 * `FlyoutTemplate` with its declarative zones attached as compound namespaces.
 */
export const FlyoutTemplate = Object.assign(FlyoutTemplateRoot, {
  Header,
  Body,
  Footer,
});

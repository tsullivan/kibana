/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useEffect, useId, useMemo, useState } from 'react';
import { EuiFlyout, useGeneratedHtmlId } from '@elastic/eui';
import type { ParsedPart } from '@kbn/content-list-assembly';
import type { ParsedItem } from '@kbn/content-list-assembly';
import { flyoutAssembly } from './assembly';
import { FlyoutTabsProvider, FlyoutTemplateConfigProvider } from './context';
import type { FlyoutTabsState } from './context';
import { Body, BodyZone, BODY_PART_NAME } from './body/body';
import { Header, HeaderZone, HEADER_PART_NAME } from './header/header';
import { Footer, FooterZone, FOOTER_PART_NAME } from './footer/footer';
import { tabPart } from './header/tab';
import type { TabDescriptor } from './types';
import type {
  FlyoutBodyProps,
  FlyoutFooterProps,
  FlyoutHeaderProps,
  FlyoutTemplateProps,
} from './types';

/** Selects a singleton zone; duplicate zones warn in dev and the first wins. */
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

const resolveDefaultSelectedTabId = (tabs: TabDescriptor[], defaultId: string | undefined) => {
  if (defaultId !== undefined && tabs.some((tab) => tab.id === defaultId)) {
    return defaultId;
  }
  return tabs[0]?.id;
};

/** Root component that renders Header, Body, Footer zones in template order. */
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
  'aria-labelledby': ariaLabelledBy,
  'data-test-subj': dataTestSubj,
}: FlyoutTemplateProps) => {
  const htmlIdSuffix = useId().replace(/[^A-Za-z0-9_-]/g, '');
  const flyoutTitleId = useGeneratedHtmlId({ prefix: `flyoutTemplateTitle${htmlIdSuffix}` });
  const tabIdPrefix = useGeneratedHtmlId({ prefix: `flyoutTemplateTab${htmlIdSuffix}` });
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
  const menuTitleString = typeof menuTitle === 'string' ? menuTitle : undefined;
  const flyoutAriaLabelledBy = headerItem ? flyoutTitleId : ariaLabelledBy;
  const flyoutAriaLabel = flyoutAriaLabelledBy ? undefined : ariaLabel ?? menuTitleString;

  // Feed string titles to EUI's flyout menu for history/navigation.
  const mergedMenuProps = {
    ...(menuTitleString !== undefined ? { title: menuTitleString } : {}),
    ...flyoutMenuProps,
  };
  const hasMenuProps = Object.keys(mergedMenuProps).length > 0;

  const tabs = useMemo<TabDescriptor[]>(() => {
    if (!headerAttrs?.children) return [];
    const tabParts = tabPart.parseChildren(headerAttrs.children);

    const seen = new Set<string>();
    const descriptors: TabDescriptor[] = [];
    for (const [index, part] of tabParts.entries()) {
      const descriptor = tabPart.resolve(part, undefined);
      if (!descriptor) continue;
      if (process.env.NODE_ENV !== 'production' && seen.has(descriptor.id)) {
        // eslint-disable-next-line no-console
        console.warn(
          `[FlyoutTemplate] Duplicate Header.Tab id "${descriptor.id}"; first tab wins.`
        );
        continue;
      }
      seen.add(descriptor.id);
      descriptors.push({
        ...descriptor,
        tabDomId: `${tabIdPrefix}-${index}`,
        panelDomId: `${tabIdPrefix}-${index}-panel`,
      });
    }
    return descriptors;
  }, [headerAttrs?.children, tabIdPrefix]);

  const isControlled = headerAttrs?.selectedTabId !== undefined;
  const defaultId = headerAttrs?.defaultSelectedTabId;

  const [uncontrolledTabId, setUncontrolledTabId] = useState<string | undefined>(() => {
    return resolveDefaultSelectedTabId(tabs, defaultId);
  });

  useEffect(() => {
    if (isControlled) return;
    const hasSelectedTab = tabs.some((tab) => tab.id === uncontrolledTabId);
    const nextTabId = hasSelectedTab
      ? uncontrolledTabId
      : resolveDefaultSelectedTabId(tabs, defaultId);

    if (nextTabId !== uncontrolledTabId) {
      setUncontrolledTabId(nextTabId);
    }
  }, [defaultId, isControlled, tabs, uncontrolledTabId]);

  const requestedSelectedTabId = isControlled ? headerAttrs?.selectedTabId : uncontrolledTabId;
  const selectedTabId = tabs.some((tab) => tab.id === requestedSelectedTabId)
    ? requestedSelectedTabId
    : resolveDefaultSelectedTabId(tabs, defaultId);

  if (process.env.NODE_ENV !== 'production') {
    if (
      !isControlled &&
      defaultId !== undefined &&
      tabs.length > 0 &&
      !tabs.some((tab) => tab.id === defaultId)
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `[FlyoutTemplate] defaultSelectedTabId "${defaultId}" does not match any Header.Tab id; first tab wins.`
      );
    }
    const controlledId = headerAttrs?.selectedTabId;
    if (
      controlledId !== undefined &&
      tabs.length > 0 &&
      !tabs.some((tab) => tab.id === controlledId)
    ) {
      // eslint-disable-next-line no-console
      console.warn(
        `[FlyoutTemplate] selectedTabId "${controlledId}" does not match any Header.Tab id; first tab wins.`
      );
    }
  }

  const selectTab = useCallback(
    (id: string) => {
      if (!isControlled) {
        setUncontrolledTabId(id);
      }
      headerAttrs?.onTabChange?.(id);
    },
    [isControlled, headerAttrs]
  );

  const tabsContextValue = useMemo<FlyoutTabsState>(
    () => ({ tabs, selectedTabId, selectTab }),
    [tabs, selectedTabId, selectTab]
  );

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
      aria-label={flyoutAriaLabel}
      aria-labelledby={flyoutAriaLabelledBy}
      data-test-subj={dataTestSubj}
    >
      <FlyoutTemplateConfigProvider value={{ dataTestSubj, paddingSize }}>
        <FlyoutTabsProvider value={tabsContextValue}>
          {headerItem && (
            <HeaderZone {...(headerAttrs as FlyoutHeaderProps)} flyoutTitleId={flyoutTitleId} />
          )}
          {bodyItem && <BodyZone {...(bodyItem.attributes as FlyoutBodyProps)} />}
          {footerItem && <FooterZone {...(footerItem.attributes as FlyoutFooterProps)} />}
        </FlyoutTabsProvider>
      </FlyoutTemplateConfigProvider>
    </EuiFlyout>
  );
};

/** `FlyoutTemplate` with its declarative zones attached as compound namespaces. */
export const FlyoutTemplate = Object.assign(FlyoutTemplateRoot, {
  Header,
  Body,
  Footer,
});

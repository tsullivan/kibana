/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiIconTip,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import type { FlyoutSectionProps } from '../../types';
import { sectionPart } from './part';

/**
 * Declarative `FlyoutTemplate.Body.Section`.
 *
 * Returns `null`; the Body zone parses it and renders the resolved output.
 * The section title renders as an H4 with an optional icon/tooltip immediately
 * to its right and an optional action link aligned to the right of the row.
 * When `hasBorder`, the whole section (title and content) is wrapped in an
 * outlined box.
 */
export const Section = sectionPart.createComponent<FlyoutSectionProps>({
  resolve: ({
    title,
    children,
    icon,
    tooltip,
    action,
    hasBorder,
    'data-test-subj': dataTestSubj,
  }) => {
    // Tooltip anchors on an icon (defaults to `info`); a bare icon is decorative
    // (meaningful icons should carry a tooltip, which is the accessible path).
    const iconNode = tooltip ? (
      <EuiIconTip type={icon ?? 'info'} content={tooltip} />
    ) : icon ? (
      <EuiIcon type={icon} aria-hidden />
    ) : null;

    const titleRow = (
      <EuiFlexGroup gutterSize="xs" alignItems="center" responsive={false}>
        <EuiFlexItem grow={false}>
          <EuiTitle size="xs">
            <h4>{title}</h4>
          </EuiTitle>
        </EuiFlexItem>
        {iconNode && <EuiFlexItem grow={false}>{iconNode}</EuiFlexItem>}
      </EuiFlexGroup>
    );

    const header = action ? (
      <EuiFlexGroup
        gutterSize="s"
        alignItems="center"
        justifyContent="spaceBetween"
        responsive={false}
      >
        <EuiFlexItem grow={false}>{titleRow}</EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink
            href={action.href}
            onClick={action.onClick}
            data-test-subj={action['data-test-subj']}
          >
            {action.label}
          </EuiLink>
        </EuiFlexItem>
      </EuiFlexGroup>
    ) : (
      titleRow
    );

    const body = (
      <>
        {header}
        <EuiSpacer size="s" />
        {children}
      </>
    );

    return (
      <section data-test-subj={dataTestSubj}>
        {hasBorder ? (
          <EuiPanel hasShadow={false} hasBorder paddingSize="m">
            {body}
          </EuiPanel>
        ) : (
          body
        )}
      </section>
    );
  },
});

Section.displayName = 'FlyoutTemplate.Body.Section';

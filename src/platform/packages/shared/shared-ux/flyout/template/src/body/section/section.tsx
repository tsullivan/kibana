/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import type { FlyoutSectionProps } from '../../types';
import { renderTitleAction, renderTitleIcon } from '../adornments';
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
    const iconNode = renderTitleIcon(icon, tooltip);

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
        <EuiFlexItem grow={false}>{renderTitleAction(action)}</EuiFlexItem>
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

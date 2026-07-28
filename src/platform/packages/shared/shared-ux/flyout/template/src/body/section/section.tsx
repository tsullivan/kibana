/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiTitle } from '@elastic/eui';
import type { FlyoutSectionProps } from '../../types';
import { renderTitleAction, renderTitleIcon, renderTitleWithIcon } from '../adornments';
import { SectionContent } from '../section_content';
import { sectionPart } from './part';

/**
 * Declarative `FlyoutTemplate.Body.Section`.
 *
 * Returns `null`; the Body zone parses it and renders the resolved output. The
 * title renders as an H4 with an optional icon/tooltip beside it and an optional
 * right-aligned action. When `hasBorder`, the content (not the title) is wrapped
 * in an outlined box — identical treatment to `Body.Accordion`.
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
    const titleWithIcon = renderTitleWithIcon(
      <EuiTitle size="xs">
        <h4>{title}</h4>
      </EuiTitle>,
      renderTitleIcon(icon, tooltip)
    );

    const header = action ? (
      <EuiFlexGroup
        gutterSize="s"
        alignItems="center"
        justifyContent="spaceBetween"
        responsive={false}
      >
        <EuiFlexItem grow={false}>{titleWithIcon}</EuiFlexItem>
        <EuiFlexItem grow={false}>{renderTitleAction(action)}</EuiFlexItem>
      </EuiFlexGroup>
    ) : (
      titleWithIcon
    );

    return (
      <section data-test-subj={dataTestSubj}>
        {header}
        <SectionContent hasBorder={hasBorder}>{children}</SectionContent>
      </section>
    );
  },
});

Section.displayName = 'FlyoutTemplate.Body.Section';

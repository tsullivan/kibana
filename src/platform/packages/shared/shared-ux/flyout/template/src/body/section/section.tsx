/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiHorizontalRule, EuiSpacer, EuiTitle } from '@elastic/eui';
import type { FlyoutBodySectionProps } from '@kbn/shared-ux-flyout-common';
import { renderTitleAction, renderTitleIcon, renderTitleWithIcon } from '../../title_adornments';
import { SectionContent } from '../section_content';
import { sectionPart } from './part';

/** Declarative `FlyoutTemplate.Body.Section`. */
export const Section = sectionPart.createComponent<FlyoutBodySectionProps>({
  resolve: (
    { title, children, icon, tooltip, action, hasBorder, 'data-test-subj': dataTestSubj },
    { showBottomDivider }
  ) => {
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
      <>
        <section data-test-subj={dataTestSubj}>
          {header}
          <SectionContent hasBorder={hasBorder}>{children}</SectionContent>
        </section>
        {/* Outlined content already reads as separated, so only space it. */}
        {showBottomDivider &&
          (hasBorder ? <EuiSpacer size="m" /> : <EuiHorizontalRule margin="m" />)}
      </>
    );
  },
});

Section.displayName = 'FlyoutTemplate.Body.Section';

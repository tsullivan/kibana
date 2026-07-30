/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiHorizontalRule, EuiPanel, EuiSpacer, EuiTitle } from '@elastic/eui';
import type { FlyoutSubsectionProps } from '../../types';
import { subsectionPart } from './part';

/**
 * Declarative `FlyoutTemplate.Body.Section.Subsection` (also available as
 * `Body.Accordion.Subsection` and `Body.Subsection`).
 *
 * Returns `null`; `SectionContent` parses it and renders the resolved output.
 * The title renders as an H5. Rendering adapts to the parent context:
 * - Inside `Body.Section`: plain H5 + content, horizontal-rule dividers between.
 * - Inside `Body.Accordion`: each subsection in its own outlined box, spacer dividers.
 */
export const Subsection = subsectionPart.createComponent<FlyoutSubsectionProps>({
  resolve: (
    { title, children, 'data-test-subj': dataTestSubj },
    { hasBorder, showBottomDivider }
  ) => {
    if (hasBorder) {
      return (
        <>
          <EuiPanel hasShadow={false} hasBorder paddingSize="m" data-test-subj={dataTestSubj}>
            <EuiTitle size="xxs">
              <h5>{title}</h5>
            </EuiTitle>
            <EuiSpacer size="s" />
            {children}
          </EuiPanel>
          {showBottomDivider && <EuiSpacer size="m" />}
        </>
      );
    }

    return (
      <div data-test-subj={dataTestSubj}>
        <EuiTitle size="xxs">
          <h5>{title}</h5>
        </EuiTitle>
        <EuiSpacer size="s" />
        {children}
        {showBottomDivider && <EuiHorizontalRule margin="m" />}
      </div>
    );
  },
});

Subsection.displayName = 'FlyoutTemplate.Body.Subsection';

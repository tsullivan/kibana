/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiSpacer, EuiTitle } from '@elastic/eui';
import type { FlyoutSectionProps } from '../../types';
import { sectionPart } from './part';

/**
 * Declarative `FlyoutTemplate.Body.Section`.
 *
 * Returns `null`; the Body zone parses it and renders the resolved output.
 * The section title renders as an H4.
 */
export const Section = sectionPart.createComponent<FlyoutSectionProps>({
  resolve: ({ title, children, 'data-test-subj': dataTestSubj }) => (
    <section data-test-subj={dataTestSubj}>
      <EuiTitle size="xs">
        <h4>{title}</h4>
      </EuiTitle>
      <EuiSpacer size="s" />
      {children}
    </section>
  ),
});

Section.displayName = 'FlyoutTemplate.Body.Section';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import type { ReactNode } from 'react';
import { EuiPanel, EuiSpacer } from '@elastic/eui';

/**
 * The content region shared by `Section` and `Accordion`: a gap below the title
 * and, when `hasBorder`, an outlined box around the content. The box wraps the
 * content only, never the title. Subsection support will be added here so both
 * section types get it identically.
 */
export const SectionContent = ({
  hasBorder = false,
  children,
}: {
  hasBorder?: boolean;
  children?: ReactNode;
}) => (
  <>
    <EuiSpacer size="s" />
    {hasBorder ? (
      <EuiPanel hasShadow={false} hasBorder paddingSize="m">
        {children}
      </EuiPanel>
    ) : (
      children
    )}
  </>
);

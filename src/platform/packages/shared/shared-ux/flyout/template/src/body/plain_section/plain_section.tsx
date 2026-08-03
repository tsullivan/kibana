/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiSpacer } from '@elastic/eui';
import type { FlyoutBodyPlainSectionProps } from '../../types';
import { plainSectionPart } from './part';

/** Declarative `FlyoutTemplate.Body.PlainSection`; content only, no title or chrome. */
export const PlainSection = plainSectionPart.createComponent<FlyoutBodyPlainSectionProps>({
  resolve: ({ children, 'data-test-subj': dataTestSubj }, { showBottomSpacer }) => (
    <>
      <div data-test-subj={dataTestSubj}>{children}</div>
      {showBottomSpacer && <EuiSpacer size="m" />}
    </>
  ),
});

PlainSection.displayName = 'FlyoutTemplate.Body.PlainSection';

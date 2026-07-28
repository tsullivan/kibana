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
import { EuiIcon, EuiIconTip, EuiLink } from '@elastic/eui';
import type { EuiIconProps } from '@elastic/eui';
import type { FlyoutSectionAction } from '../types';

/**
 * Icon shown immediately right of a section/accordion title. A tooltip anchors
 * on an icon (defaults to `info`); a bare icon is decorative (meaningful icons
 * should carry a tooltip, which is the accessible path). Returns `null` when
 * neither is provided.
 */
export const renderTitleIcon = (
  icon: EuiIconProps['type'] | undefined,
  tooltip: ReactNode
): ReactNode =>
  tooltip ? (
    <EuiIconTip type={icon ?? 'info'} content={tooltip} />
  ) : icon ? (
    <EuiIcon type={icon} aria-hidden />
  ) : null;

/** Right-aligned action link shown on a section/accordion title row. */
export const renderTitleAction = (action: FlyoutSectionAction): ReactNode => (
  <EuiLink href={action.href} onClick={action.onClick} data-test-subj={action['data-test-subj']}>
    {action.label}
  </EuiLink>
);

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { FlyoutHeaderTabProps } from '../../types';
import { tabPart } from './part';

/**
 * Declarative `FlyoutTemplate.Header.Tab`.
 *
 * Returns `null`; the root parses it into a `TabDescriptor` and passes the
 * ordered list to `FlyoutTabsProvider`. The header zone renders `EuiTab` for
 * each descriptor.
 *
 * ```tsx
 * <FlyoutTemplate.Header title="Alert">
 *   <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
 *   <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
 * </FlyoutTemplate.Header>
 * ```
 */
export const Tab = tabPart.createComponent<FlyoutHeaderTabProps>({
  resolve: ({ id, label, disabled, prepend, append, 'data-test-subj': dataTestSubj }) => ({
    id,
    label,
    disabled,
    prepend,
    append,
    'data-test-subj': dataTestSubj,
  }),
});

Tab.displayName = 'FlyoutTemplate.Header.Tab';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { TabPartDescriptor } from '../../types';
import { headerAssembly } from '../../assembly';

/** Part name used for identifying `Header.Tab` children. */
export const TAB_PART_NAME = 'tab';

/** Part factory for `FlyoutTemplate.Header.Tab`. Resolves to a `TabPartDescriptor`. */
export const tabPart = headerAssembly.definePart<Record<string, never>, TabPartDescriptor, void>({
  name: TAB_PART_NAME,
});

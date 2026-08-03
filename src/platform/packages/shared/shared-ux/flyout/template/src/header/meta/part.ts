/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { MetaPartDescriptor } from '../../types';
import { headerAssembly } from '../../assembly';

/** Part name used for identifying `Header.Meta` children. */
export const META_PART_NAME = 'meta';

/** Part factory for `FlyoutTemplate.Header.Meta`. Resolves to a `MetaPartDescriptor`. */
export const metaPart = headerAssembly.definePart<Record<string, never>, MetaPartDescriptor, void>({
  name: META_PART_NAME,
});

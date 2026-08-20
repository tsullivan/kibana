/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { MetaBlock } from '@kbn/flyout-meta-blocks';
import { headerAssembly } from '../../assembly';

/** Part name used for identifying `Header.MetaBlocks` children. */
export const METABLOCKS_PART_NAME = 'metablocks';

/** Part factory for `FlyoutTemplate.Header.MetaBlocks`. Resolves to a `MetaBlock`. */
export const metablocksPart = headerAssembly.definePart<Record<string, never>, MetaBlock, void>({
  name: METABLOCKS_PART_NAME,
});

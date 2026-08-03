/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { headerAssembly } from '../../assembly';
import type { HeaderMetadataDescriptor } from './types';

/** Part name used for identifying `Header.Metadata` children. */
export const METADATA_PART_NAME = 'metadata';

/** Part factory for `FlyoutTemplate.Header.Metadata`. Resolves to a `HeaderMetadataDescriptor`. */
export const metadataPart = headerAssembly.definePart<
  Record<string, never>,
  HeaderMetadataDescriptor,
  void
>({
  name: METADATA_PART_NAME,
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ReactNode } from 'react';
import { bodyAssembly } from '../../assembly';

/** Part name used for identifying `Body.PlainSection` children. */
export const PLAIN_SECTION_PART_NAME = 'plainSection';

/** Runtime context passed to the plain section resolver by the body zone. */
export interface PlainSectionResolveContext {
  /** Add spacing below this plain section; `false` when nothing follows it. */
  showBottomSpacer: boolean;
}

/** Part factory for `FlyoutTemplate.Body.PlainSection`. */
export const plainSectionPart = bodyAssembly.definePart<
  Record<string, never>,
  ReactNode,
  PlainSectionResolveContext
>({ name: PLAIN_SECTION_PART_NAME });

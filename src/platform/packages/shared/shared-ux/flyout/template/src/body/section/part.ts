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

/** Part name used for identifying `Body.Section` children. */
export const SECTION_PART_NAME = 'section';

/** Runtime context passed to the section resolver by the body zone. */
export interface SectionResolveContext {
  /** Render a divider below this section; `false` for the last one. */
  showBottomDivider: boolean;
}

/** Part factory for `FlyoutTemplate.Body.Section`. */
export const sectionPart = bodyAssembly.definePart<
  Record<string, never>,
  ReactNode,
  SectionResolveContext
>({ name: SECTION_PART_NAME });

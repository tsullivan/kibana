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

/** Part name used for identifying `Body.Accordion` children. */
export const ACCORDION_PART_NAME = 'accordion';

/** Runtime context passed to the accordion resolver by the body zone. */
export interface AccordionResolveContext {
  /** Render a divider below this accordion (false for the last one). It is hidden while open. */
  showBottomDivider: boolean;
}

/** Part factory for `FlyoutTemplate.Body.Accordion`. */
export const accordionPart = bodyAssembly.definePart<
  Record<string, never>,
  ReactNode,
  AccordionResolveContext
>({ name: ACCORDION_PART_NAME });

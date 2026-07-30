/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ReactNode } from 'react';
import { sectionAssembly } from '../../assembly';

/** Part name used for identifying `Body.Section.Subsection` children. */
export const SUBSECTION_PART_NAME = 'subsection';

/** Runtime context passed to the subsection resolver by `SectionContent`. */
export interface SubsectionResolveContext {
  /**
   * Whether the parent section uses bordered boxes (accordion context). When
   * `true`, each subsection renders in its own outlined `EuiPanel`; when
   * `false`, subsections are separated by horizontal rules.
   */
  hasBorder: boolean;
  /** Render a separator below this subsection; `false` for the last one. */
  showBottomDivider: boolean;
}

/** Part factory for `FlyoutTemplate.Body.Section.Subsection`. */
export const subsectionPart = sectionAssembly.definePart<
  Record<string, never>,
  ReactNode,
  SubsectionResolveContext
>({ name: SUBSECTION_PART_NAME });

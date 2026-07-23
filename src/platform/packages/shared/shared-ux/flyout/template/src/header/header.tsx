/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { EuiFlyoutHeader, EuiTitle } from '@elastic/eui';
import { flyoutAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutScroll, useFlyoutTemplateConfig } from '../context';
import type { FlyoutHeaderProps } from '../types';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Header`. Returns `null`; the root renders the
 * `HeaderZone` with these attributes.
 */
export const Header = headerPart.createComponent<FlyoutHeaderProps>();
Header.displayName = 'FlyoutTemplate.Header';

/**
 * Internal renderer for the header zone. Composes `EuiFlyoutHeader` and owns the
 * heading level: H3 at rest (scroll index 0), H4 once collapsed. Consumers
 * cannot choose the heading level.
 */
export const HeaderZone = ({ title, 'data-test-subj': dataTestSubj }: FlyoutHeaderProps) => {
  const { scrollIndex } = useFlyoutScroll();
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const isCollapsed = scrollIndex > 0;

  return (
    <EuiFlyoutHeader
      hasBorder
      data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Header')}
    >
      <EuiTitle size={isCollapsed ? 'xs' : 'm'}>
        {isCollapsed ? <h4>{title}</h4> : <h3>{title}</h3>}
      </EuiTitle>
    </EuiFlyoutHeader>
  );
};

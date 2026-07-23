/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo } from 'react';
import type { ParsedPart } from '@kbn/content-list-assembly';
import { EuiFlyoutHeader, EuiSpacer, EuiTitle } from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';
import { InfoBlocks } from '@kbn/shared-ux-info-blocks';
import { flyoutAssembly, headerAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutScroll, useFlyoutTemplateConfig } from '../context';
import type { FlyoutHeaderProps } from '../types';
import { InfoBlock, infoBlockPart, INFO_BLOCK_PART_NAME } from './info_block';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Header`. Returns `null`; the root renders the
 * `HeaderZone` with these attributes. Namespaces the `InfoBlock` part.
 */
const BaseHeader = headerPart.createComponent<FlyoutHeaderProps>();
BaseHeader.displayName = 'FlyoutTemplate.Header';

export const Header = Object.assign(BaseHeader, { InfoBlock });

/**
 * Internal renderer for the header zone. Composes `EuiFlyoutHeader` and owns the
 * heading level: H3 at rest (scroll index 0), H4 once collapsed. Consumers
 * cannot choose the heading level. `Header.InfoBlock` parts resolve into
 * `@kbn/shared-ux-info-blocks`, compressed to match the collapsed state.
 */
export const HeaderZone = ({
  title,
  children,
  'data-test-subj': dataTestSubj,
}: FlyoutHeaderProps) => {
  const { scrollIndex, isCollapsed } = useFlyoutScroll();
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const isTitleCollapsed = scrollIndex > 0;

  const infoBlockItems = useMemo(() => {
    const items = headerAssembly.parseChildren(children);
    return items
      .filter(
        (item): item is ParsedPart => item.type === 'part' && item.part === INFO_BLOCK_PART_NAME
      )
      .map((item) => infoBlockPart.resolve(item, undefined))
      .filter((item): item is InfoBlockItem => item !== undefined);
  }, [children]);

  return (
    <EuiFlyoutHeader
      hasBorder
      data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Header')}
    >
      <EuiTitle size={isTitleCollapsed ? 'xs' : 'm'}>
        {isTitleCollapsed ? <h4>{title}</h4> : <h3>{title}</h3>}
      </EuiTitle>
      {infoBlockItems.length > 0 && (
        <>
          <EuiSpacer size="m" />
          <InfoBlocks items={infoBlockItems} compressed={isCollapsed} />
        </>
      )}
    </EuiFlyoutHeader>
  );
};

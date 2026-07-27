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
import {
  EuiFlyoutHeader,
  EuiHorizontalRule,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiTitle,
} from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';
import { InfoBlocks } from '@kbn/shared-ux-info-blocks';
import { flyoutAssembly, headerAssembly } from '../assembly';
import {
  resolveZoneTestSubj,
  useFlyoutScroll,
  useFlyoutTabs,
  useFlyoutTemplateConfig,
} from '../context';
import type { FlyoutHeaderProps } from '../types';
import { InfoBlock, infoBlockPart, INFO_BLOCK_PART_NAME } from './info_block';
import { Tab } from './tab';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Header`. Returns `null`; the root renders the
 * `HeaderZone` with these attributes. Namespaces the `InfoBlock` and `Tab` parts.
 */
const BaseHeader = headerPart.createComponent<FlyoutHeaderProps>();
BaseHeader.displayName = 'FlyoutTemplate.Header';

export const Header = Object.assign(BaseHeader, { InfoBlock, Tab });

/**
 * Internal renderer for the header zone. Composes `EuiFlyoutHeader` and owns the
 * heading level: H3 at rest (scroll index 0), H4 once collapsed. `Header.InfoBlock`
 * parts resolve into `@kbn/shared-ux-info-blocks`, compressed to match the collapsed
 * state. `Header.Tab` parts render as an `EuiTabs` bar; selection state is read from
 * `FlyoutTabsProvider`.
 */
export const HeaderZone = ({
  title,
  children,
  'data-test-subj': dataTestSubj,
}: FlyoutHeaderProps) => {
  const { scrollIndex, isCollapsed } = useFlyoutScroll();
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const { tabs, selectedTabId, selectTab } = useFlyoutTabs();
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

  const hasTabs = tabs.length > 0;

  return (
    <EuiFlyoutHeader
      hasBorder={false}
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
      {hasTabs && (
        <>
          <EuiSpacer size="s" />
          <EuiTabs bottomBorder={false} size={isCollapsed ? 's' : 'm'}>
            {tabs.map((tab) => (
              <EuiTab
                key={tab.id}
                id={tab.id}
                isSelected={tab.id === selectedTabId}
                onClick={() => selectTab(tab.id)}
                disabled={tab.disabled}
                prepend={tab.prepend}
                append={tab.append}
                data-test-subj={tab['data-test-subj']}
              >
                {tab.label}
              </EuiTab>
            ))}
          </EuiTabs>
        </>
      )}
      <EuiHorizontalRule margin="none" />
    </EuiFlyoutHeader>
  );
};

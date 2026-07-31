/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo } from 'react';
import { css } from '@emotion/react';
import {
  EuiFlyoutHeader,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiTitle,
  useEuiMemoizedStyles,
  useEuiTheme,
} from '@elastic/eui';
import type { EuiFlyoutProps, UseEuiTheme } from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';
import { InfoBlocks } from '@kbn/shared-ux-info-blocks';
import { flyoutAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTabs, useFlyoutTemplateConfig } from '../context';
import type { FlyoutHeaderProps } from '../types';
import { InfoBlock, infoBlockPart } from './info_block';
import { Tab } from './tab';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/** Declarative `FlyoutTemplate.Header`; the root renders the collected attributes. */
const BaseHeader = headerPart.createComponent<FlyoutHeaderProps>();
BaseHeader.displayName = 'FlyoutTemplate.Header';

export const Header = Object.assign(BaseHeader, { InfoBlock, Tab });

/** Maps `paddingSize` to the header's horizontal padding; `undefined` follows EuiFlyout's `'l'` default. */
const resolveHorizontalPadding = (
  euiTheme: UseEuiTheme['euiTheme'],
  paddingSize: EuiFlyoutProps['paddingSize']
): string => {
  switch (paddingSize) {
    case 'none':
      return '0';
    case 's':
      return euiTheme.size.s;
    case 'm':
      return euiTheme.size.base;
    case 'l':
    default:
      return euiTheme.size.l;
  }
};

const dividerStyles = ({ euiTheme }: UseEuiTheme) => ({
  divider: css`
    border-block-end: ${euiTheme.border.thin};
  `,
});

/** Full-width divider: negative horizontal margins bleed it past the header padding to the flyout edges. */
const FullBleedDivider = ({ horizontalPadding }: { horizontalPadding: string }) => {
  const styles = useEuiMemoizedStyles(dividerStyles);
  return (
    <div
      aria-hidden
      css={styles.divider}
      style={{
        marginInlineStart: `-${horizontalPadding}`,
        marginInlineEnd: `-${horizontalPadding}`,
      }}
    />
  );
};

type HeaderZoneProps = FlyoutHeaderProps & {
  flyoutTitleId?: string;
};

/** Internal renderer for the header zone; dividers are template-owned for full bleed. */
export const HeaderZone = ({
  title,
  children,
  flyoutTitleId,
  'data-test-subj': dataTestSubj,
}: HeaderZoneProps) => {
  const { euiTheme } = useEuiTheme();
  const { dataTestSubj: rootTestSubj, paddingSize } = useFlyoutTemplateConfig();
  const { tabs, selectedTabId, selectTab } = useFlyoutTabs();

  const infoBlockItems = useMemo(() => {
    return infoBlockPart
      .parseChildren(children)
      .map((item) => infoBlockPart.resolve(item, undefined))
      .filter((item): item is InfoBlockItem => item !== undefined);
  }, [children]);

  const hasInfoBlocks = infoBlockItems.length > 0;
  const hasTabs = tabs.length > 0;
  const horizontalPadding = resolveHorizontalPadding(euiTheme, paddingSize);

  return (
    <EuiFlyoutHeader
      hasBorder={false}
      data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Header')}
    >
      <EuiTitle size="m">
        <h3 id={flyoutTitleId}>{title}</h3>
      </EuiTitle>
      {hasInfoBlocks && (
        <>
          <EuiSpacer size="m" />
          <FullBleedDivider horizontalPadding={horizontalPadding} />
          <EuiSpacer size="m" />
          <InfoBlocks items={infoBlockItems} />
        </>
      )}
      {hasTabs && (
        <>
          <EuiSpacer size="s" />
          <EuiTabs bottomBorder={false} size="m">
            {tabs.map((tab) => (
              <EuiTab
                key={tab.id}
                id={tab.tabDomId}
                aria-controls={tab.panelDomId}
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
      {/* Bottom divider hugs the tab bar; without tabs it gets its own spacing. */}
      {!hasTabs && <EuiSpacer size="m" />}
      <FullBleedDivider horizontalPadding={horizontalPadding} />
    </EuiFlyoutHeader>
  );
};

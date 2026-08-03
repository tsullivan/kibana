/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import {
  EuiBadge,
  EuiBadgeGroup,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutHeader,
  EuiPopover,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  EuiTitle,
  useEuiMemoizedStyles,
  useEuiTheme,
} from '@elastic/eui';
import type { EuiFlyoutProps, UseEuiTheme } from '@elastic/eui';
import { i18n } from '@kbn/i18n';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';
import { InfoBlocks } from '@kbn/shared-ux-info-blocks';
import { flyoutAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTabs, useFlyoutTemplateConfig } from '../context';
import type { FlyoutHeaderProps, MetaPartDescriptor } from '../types';
import { renderTitleIcon, renderTitleWithIcon } from '../adornments';
import { InfoBlock, infoBlockPart } from './info_block';
import { Meta, metaPart } from './meta';
import { Tab } from './tab';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/** Declarative `FlyoutTemplate.Header`; the root renders the collected attributes. */
const BaseHeader = headerPart.createComponent<FlyoutHeaderProps>();
BaseHeader.displayName = 'FlyoutTemplate.Header';

export const Header = Object.assign(BaseHeader, { InfoBlock, Meta, Tab });

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

/** PRD caps the metadata line at three key-value pairs. */
const MAX_META_ITEMS = 3;

const metaStyles = ({ euiTheme }: UseEuiTheme) => ({
  // The row stays on one line, so each pair ellipsizes rather than wrapping.
  item: css`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  `,
  key: css`
    font-weight: ${euiTheme.font.weight.bold};
  `,
  // Keep link values from inheriting the key's weight.
  value: css`
    a {
      font-weight: ${euiTheme.font.weight.regular};
    }
  `,
});

/** Single line of key-value pairs rendered between the title and the badges. */
const MetaRow = ({ items }: { items: MetaPartDescriptor[] }) => {
  const styles = useEuiMemoizedStyles(metaStyles);

  return (
    <EuiFlexGroup gutterSize="m" responsive={false} wrap={false} alignItems="center">
      {items.map((item, index) => (
        <EuiFlexItem key={index} grow={false} css={{ minInlineSize: 0 }}>
          <EuiText size="s" css={styles.item} data-test-subj={item['data-test-subj']}>
            <span css={styles.key}>{item.title}</span> <span css={styles.value}>{item.value}</span>
          </EuiText>
        </EuiFlexItem>
      ))}
    </EuiFlexGroup>
  );
};

/** Badge counts above `MAX_VISIBLE_BADGES` collapse to `MAX_BADGES_BEFORE_OVERFLOW` plus an overflow badge. */
const MAX_VISIBLE_BADGES = 5;
const MAX_BADGES_BEFORE_OVERFLOW = 4;
const MAX_BADGE_WIDTH = 200;

/** Caps badge width so long labels ellipsize; `euiBadge__text` supplies the truncation. */
const badgeGroupStyles = () => ({
  group: css`
    .euiBadge {
      max-inline-size: ${MAX_BADGE_WIDTH}px;
    }
  `,
});

/** Overflow badge that reveals the collapsed badges in a popover. */
const BadgeOverflow = ({ badges }: { badges: ReactNode[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const label = i18n.translate('sharedUXPackages.flyoutTemplate.header.badgeOverflowLabel', {
    defaultMessage: '+{count} more',
    values: { count: badges.length },
  });

  return (
    <EuiPopover
      isOpen={isOpen}
      closePopover={() => setIsOpen(false)}
      anchorPosition="downCenter"
      panelPaddingSize="s"
      button={
        <EuiBadge
          color="hollow"
          onClick={() => setIsOpen((open) => !open)}
          onClickAriaLabel={i18n.translate(
            'sharedUXPackages.flyoutTemplate.header.badgeOverflowAriaLabel',
            {
              defaultMessage: 'Show {count} more badges',
              values: { count: badges.length },
            }
          )}
        >
          {label}
        </EuiBadge>
      }
    >
      <EuiBadgeGroup gutterSize="s" css={{ maxInlineSize: 240 }}>
        {badges}
      </EuiBadgeGroup>
    </EuiPopover>
  );
};

type HeaderZoneProps = FlyoutHeaderProps & {
  flyoutTitleId?: string;
};

/** Internal renderer for the header zone; dividers are template-owned for full bleed. */
export const HeaderZone = ({
  title,
  titleIcon,
  titleTooltip,
  description,
  badges,
  children,
  flyoutTitleId,
  'data-test-subj': dataTestSubj,
}: HeaderZoneProps) => {
  const { euiTheme } = useEuiTheme();
  const badgeStyles = useEuiMemoizedStyles(badgeGroupStyles);
  const { dataTestSubj: rootTestSubj, paddingSize } = useFlyoutTemplateConfig();
  const { tabs, selectedTabId, selectTab } = useFlyoutTabs();

  const infoBlockItems = useMemo(() => {
    return infoBlockPart
      .parseChildren(children)
      .map((item) => infoBlockPart.resolve(item, undefined))
      .filter((item): item is InfoBlockItem => item !== undefined);
  }, [children]);

  const metaItems = useMemo(() => {
    const resolved = metaPart
      .parseChildren(children)
      .map((item) => metaPart.resolve(item, undefined))
      .filter((item): item is MetaPartDescriptor => item !== undefined);

    if (process.env.NODE_ENV !== 'production' && resolved.length > MAX_META_ITEMS) {
      // eslint-disable-next-line no-console
      console.warn(
        `[FlyoutTemplate] Header.Meta is limited to ${MAX_META_ITEMS} pairs; extra pairs are not rendered.`
      );
    }
    return resolved.slice(0, MAX_META_ITEMS);
  }, [children]);

  // Conditional badges (`cond && <EuiBadge />`) arrive as `false`; drop them before counting.
  const badgeList = useMemo(() => React.Children.toArray(badges).filter(Boolean), [badges]);

  const hasDescription = Boolean(description);
  const hasMeta = metaItems.length > 0;
  const hasBadges = badgeList.length > 0;
  const hasInfoBlocks = infoBlockItems.length > 0;
  const hasTabs = tabs.length > 0;
  const horizontalPadding = resolveHorizontalPadding(euiTheme, paddingSize);

  const isOverflowing = badgeList.length > MAX_VISIBLE_BADGES;
  const visibleBadges = isOverflowing ? badgeList.slice(0, MAX_BADGES_BEFORE_OVERFLOW) : badgeList;
  const overflowBadges = isOverflowing ? badgeList.slice(MAX_BADGES_BEFORE_OVERFLOW) : [];

  return (
    <EuiFlyoutHeader
      hasBorder={false}
      data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Header')}
    >
      {renderTitleWithIcon(
        <EuiTitle size="m">
          <h3 id={flyoutTitleId}>{title}</h3>
        </EuiTitle>,
        renderTitleIcon(titleIcon, titleTooltip)
      )}
      {hasDescription && (
        <>
          <EuiSpacer size="xs" />
          {/* No `<p>` wrapper: `description` accepts block content, which cannot nest in a paragraph. */}
          <EuiText size="s" color="subdued">
            {description}
          </EuiText>
        </>
      )}
      {hasMeta && (
        <>
          <EuiSpacer size="xs" />
          <MetaRow items={metaItems} />
        </>
      )}
      {hasBadges && (
        <>
          <EuiSpacer size="s" />
          <EuiBadgeGroup gutterSize="s" css={badgeStyles.group}>
            {visibleBadges}
            {overflowBadges.length > 0 && <BadgeOverflow badges={overflowBadges} />}
          </EuiBadgeGroup>
        </>
      )}
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

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { isValidElement, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { css } from '@emotion/react';
import {
  EuiBadge,
  EuiBadgeGroup,
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
import type { ParsedItem } from '@kbn/content-list-assembly';
import { i18n } from '@kbn/i18n';
import { InfoBlocks, type InfoBlockItem } from '@kbn/shared-ux-flyout-info-blocks';
import { MetadataPairs, type MetadataItem } from '@kbn/shared-ux-flyout-metadata';
import type { FlyoutHeaderProps } from '../types';
import { flyoutAssembly, partsOf } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTabs, useFlyoutTemplateConfig } from '../context';
import { renderTitleIcon, renderTitleWithIcon } from '../title_adornments';
import { Badge, badgePart, BADGE_PART_NAME, type HeaderBadgeDescriptor } from './badge';
import { InfoBlock, infoBlockPart, INFO_BLOCK_PART_NAME } from './info_block';
import { Metadata, metadataPart, METADATA_PART_NAME } from './metadata';
import { Tab } from './tab';

/** Part name used for identifying the `Header` zone. */
export const HEADER_PART_NAME = 'header';

const headerPart = flyoutAssembly.definePart({ name: HEADER_PART_NAME });

/** Declarative `FlyoutTemplate.Header`; the root renders the collected attributes. */
const BaseHeader = headerPart.createComponent<FlyoutHeaderProps>();
BaseHeader.displayName = 'FlyoutTemplate.Header';

export const Header = Object.assign(BaseHeader, { Badge, InfoBlock, Metadata, Tab });

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

/** Best-effort label for a dropped child, for warning messages. */
const describeChild = (node: ReactNode): string => {
  if (!isValidElement(node)) {
    return JSON.stringify(node);
  }
  const { type } = node;
  if (typeof type === 'string') {
    return `<${type}>`;
  }
  const { displayName, name } = type as { displayName?: string; name?: string };
  return `<${displayName ?? name ?? 'Unknown'}>`;
};

/**
 * Dev-mode helper: reports header children that are not header parts.
 *
 * Unlike the body, the header renders only its declared parts, so anything else is
 * dropped. Without this the content simply vanishes, which is the hardest kind of
 * mistake to spot.
 */
const warnOnUnstructuredChildren = (items: ParsedItem[]): void => {
  if (process.env.NODE_ENV === 'production') {
    return;
  }

  for (const item of items) {
    if (item.type !== 'child') {
      continue;
    }

    // eslint-disable-next-line no-console
    console.warn(
      `[FlyoutTemplate] ${describeChild(item.node)} is not a Header part and is not ` +
        'rendered. The header renders Header.Metadata, Header.Badge, Header.InfoBlock, ' +
        'and Header.Tab; put free-form content in the Body.'
    );
  }
};

/** Renders a resolved `Header.Badge` descriptor. */
const renderBadge = (badge: HeaderBadgeDescriptor, key: number): ReactNode => (
  <EuiBadge
    key={key}
    color={badge.color}
    iconType={badge.iconType}
    iconSide={badge.iconSide}
    data-test-subj={badge['data-test-subj']}
  >
    {badge.label}
  </EuiBadge>
);

type HeaderZoneProps = FlyoutHeaderProps & {
  /**
   * `children` already parsed by the root, which needs the tab parts for its own state.
   * Reusing that parse keeps an unexpected child reported once, rather than once per
   * part kind that would otherwise go looking for its own children.
   */
  items: ParsedItem[];
  flyoutTitleId?: string;
};

/** Internal renderer for the header zone; dividers are template-owned for full bleed. */
export const HeaderZone = ({
  title,
  titleIcon,
  titleTooltip,
  description,
  items,
  flyoutTitleId,
  'data-test-subj': dataTestSubj,
}: HeaderZoneProps) => {
  const { euiTheme } = useEuiTheme();
  const badgeStyles = useEuiMemoizedStyles(badgeGroupStyles);
  const { dataTestSubj: rootTestSubj, paddingSize } = useFlyoutTemplateConfig();
  const { tabs, selectedTabId, selectTab } = useFlyoutTabs();

  warnOnUnstructuredChildren(items);

  const infoBlockItems = useMemo(() => {
    return partsOf(items, INFO_BLOCK_PART_NAME)
      .map((item) => infoBlockPart.resolve(item, undefined))
      .filter((item): item is InfoBlockItem => item !== undefined);
  }, [items]);

  // `MetadataPairs` owns the count guideline and its dev warning.
  const metadataItems = useMemo(() => {
    return partsOf(items, METADATA_PART_NAME)
      .map((item) => metadataPart.resolve(item, undefined))
      .filter((item): item is MetadataItem => item !== undefined);
  }, [items]);

  const badgeList = useMemo(() => {
    return partsOf(items, BADGE_PART_NAME)
      .map((item) => badgePart.resolve(item, undefined))
      .filter((badge): badge is HeaderBadgeDescriptor => badge !== undefined)
      .map((badge, index) => renderBadge(badge, index));
  }, [items]);

  const hasDescription = Boolean(description);
  const hasMetadata = metadataItems.length > 0;
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
      {hasMetadata && (
        <>
          <EuiSpacer size="xs" />
          <MetadataPairs items={metadataItems} />
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
          <InfoBlocks items={infoBlockItems} maxColumns="auto" />
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

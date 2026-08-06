/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import type { FlyoutTemplateProps } from './types';
import { FlyoutTemplate } from './flyout_template';

const LEADING_ACTIONS: NonNullable<FlyoutTemplateProps['flyoutMenuProps']>['leadingActions'] = [
  { iconType: 'documents', onClick: action('back'), 'aria-label': 'View surrounding documents', toolTipContent: 'View surrounding documents' },
  { iconType: 'document', onClick: action('back'), 'aria-label': 'View document', toolTipContent: 'View document' },
]; // prettier-ignore

const TRAILING_ACTIONS: NonNullable<FlyoutTemplateProps['flyoutMenuProps']>['trailingActions'] = [
  { iconType: 'share', onClick: action('share'), 'aria-label': 'Share', toolTipContent: 'Share' },
  { iconType: 'gear', onClick: action('settings'), 'aria-label': 'Settings', toolTipContent: 'Settings' },
]; // prettier-ignore

const TABS: Array<{ id: string; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'logs', label: 'Logs' },
];

/** Distinct look-and-feel per tab, so switching tabs is obvious even at a glance. */
const TAB_PANEL_DETAILS: Record<string, { icon: string; detail: string }> = {
  overview: { icon: 'inspect', detail: 'A high-level summary of the alert lifecycle and current state.' },
  metadata: { icon: 'tag', detail: 'Structured key/value pairs captured when the alert was created.' },
  timeline: { icon: 'clock', detail: 'A chronological list of state changes and annotations.' },
  logs: { icon: 'document', detail: 'Raw log lines correlated to this alert by trace id.' },
}; // prettier-ignore

interface Args {
  numInfoBlocks: number;
  sectionHasBorder: boolean;
  sectionIcon: boolean;
  sectionAction: boolean;
  numLeadingActions: number;
  numTrailingActions: number;
  numPages: number;
  paginationJump: boolean;
  footer: boolean;
  resizable: boolean;
  type: NonNullable<FlyoutTemplateProps['type']>;
  ownFocus: boolean;
  numSections: number;
  numUnstructuredBlocks: number;
  numSubsections: number;
  numTabs: number;
  titleIcon: boolean;
  description: boolean;
  numMetaBlocks: number;
  numBadges: number;
  secondaryActionIcon: boolean;
}

const meta: Meta<Args> = {
  title: 'Flyout Template/Template',
  args: {
    numLeadingActions: 1,
    numTrailingActions: 1,
    numPages: 0,
    paginationJump: false,
    numInfoBlocks: 5,
    numTabs: 3,
    numSections: 2,
    numUnstructuredBlocks: 0,
    sectionIcon: true,
    sectionAction: true,
    sectionHasBorder: false,
    numSubsections: 0,
    titleIcon: false,
    description: true,
    numMetaBlocks: 3,
    numBadges: 8,
    footer: true,
    secondaryActionIcon: true,
    resizable: true,
    type: 'overlay',
    ownFocus: false,
  },
  argTypes: {
    numLeadingActions: {
      name: 'Leading actions',
      control: { type: 'range', min: 0, max: 2, step: 1 },
      table: { category: 'Menu bar' },
    },
    numTrailingActions: {
      name: 'Trailing actions',
      control: { type: 'range', min: 0, max: 2, step: 1 },
      table: { category: 'Menu bar' },
    },
    numPages: {
      name: 'Pages',
      control: { type: 'range', min: 0, max: 42, step: 1 },
      table: { category: 'Menu bar' },
    },
    paginationJump: {
      name: 'Jump controls',
      control: { type: 'boolean' },
      if: { arg: 'numPages', truthy: true },
      table: { category: 'Menu bar' },
    },
    titleIcon: {
      name: 'Title icon',
      control: { type: 'boolean' },
      table: { category: 'Header' },
    },
    description: {
      name: 'Description',
      control: { type: 'boolean' },
      table: { category: 'Header' },
    },
    numMetaBlocks: {
      name: 'MetaBlocks',
      // Max is one above the cap, to exercise the dev warning.
      control: { type: 'range', min: 0, max: 4, step: 1 },
      table: { category: 'Header' },
    },
    numInfoBlocks: {
      name: 'Info blocks',
      control: { type: 'range', min: 0, max: 10, step: 1 },
      table: { category: 'Header' },
    },
    numBadges: {
      name: 'Badges',
      control: { type: 'range', min: 0, max: 8, step: 1 },
      table: { category: 'Header' },
    },
    numTabs: {
      name: 'Tabs',
      control: { type: 'range', min: 0, max: TABS.length, step: 1 },
      table: { category: 'Header' },
    },
    numSections: {
      name: 'Sections',
      // Zero is allowed so a body of only unstructured content is reachable.
      control: { type: 'range', min: 0, max: 4, step: 1 },
      table: { category: 'Body' },
    },
    sectionIcon: {
      name: 'Section icon',
      control: { type: 'boolean' },
      table: { category: 'Body' },
    },
    sectionAction: {
      name: 'Section action',
      control: { type: 'boolean' },
      table: { category: 'Body' },
    },
    sectionHasBorder: {
      name: 'Section has border',
      control: { type: 'boolean' },
      table: { category: 'Body' },
    },
    numSubsections: {
      name: 'Subsections',
      control: { type: 'range', min: 0, max: 4, step: 1 },
      table: { category: 'Body' },
    },
    numUnstructuredBlocks: {
      name: 'Unstructured blocks',
      control: { type: 'range', min: 0, max: 2, step: 1 },
      table: { category: 'Body' },
    },
    footer: { name: 'Footer', control: { type: 'boolean' }, table: { category: 'Footer' } },
    secondaryActionIcon: {
      name: 'Secondary action icon',
      control: { type: 'boolean' },
      if: { arg: 'footer', truthy: true },
      table: { category: 'Footer' },
    },
    resizable: { name: 'Resizable', control: { type: 'boolean' }, table: { category: 'Flyout' } },
    type: {
      name: 'Type',
      control: { type: 'inline-radio' },
      options: ['overlay', 'push'],
      table: { category: 'Flyout' },
    },
    ownFocus: {
      name: 'Own focus',
      control: { type: 'boolean' },
      if: { arg: 'type', eq: 'overlay' },
      table: { category: 'Flyout' },
    },
  },
};

/** Maps shared story args to `FlyoutTemplate` props. Pagination is handled per-story via useState. */
const buildFlyoutProps = (
  args: Args,
  paginationProps?: FlyoutTemplateProps['flyoutMenuProps']
): Omit<FlyoutTemplateProps, 'onClose' | 'children'> => {
  const { numLeadingActions, numTrailingActions, resizable, type, ownFocus } = args;
  const leadingActions = LEADING_ACTIONS.slice(0, numLeadingActions);
  const trailingActions = TRAILING_ACTIONS.slice(0, numTrailingActions);
  const hasMenuContent = leadingActions.length > 0 || trailingActions.length > 0 || paginationProps;
  const flyoutMenuProps: FlyoutTemplateProps['flyoutMenuProps'] = hasMenuContent
    ? {
        ...(leadingActions.length > 0 ? { leadingActions } : {}),
        ...(trailingActions.length > 0 ? { trailingActions } : {}),
        ...paginationProps,
      }
    : undefined;
  return {
    type,
    resizable,
    ...(resizable ? { minWidth: 320 } : {}),
    ...(type === 'overlay' ? { ownFocus } : {}),
    ...(flyoutMenuProps ? { flyoutMenuProps } : {}),
  };
};

/** Returns flyoutMenuProps containing pagination, or undefined when numPages is 0. */
const usePaginationProps = (args: Args): FlyoutTemplateProps['flyoutMenuProps'] | undefined => {
  const [currentIndex, setCurrentIndex] = useState(0);
  if (args.numPages === 0) return undefined;
  const total = args.numPages;
  return {
    pagination: {
      currentIndex,
      total,
      onPrevious: () => setCurrentIndex((i) => Math.max(0, i - 1)),
      onNext: () => setCurrentIndex((i) => Math.min(total - 1, i + 1)),
      ...(args.paginationJump
        ? {
            onFirst: () => setCurrentIndex(0),
            onLast: () => setCurrentIndex(total - 1),
          }
        : {}),
    },
  };
};

/** Title-row props shared by `Body.Section` and `Body.Accordion`. */
const buildTitleAdornments = (args: Args) => ({
  ...(args.sectionIcon
    ? { icon: 'info' as const, tooltip: 'Additional context about this section.' }
    : {}),
  ...(args.sectionAction
    ? { action: { label: 'Extra action', onClick: action('section action') } }
    : {}),
});

/** Maps the section-related story args onto `Body.Section` props. */
const buildSectionProps = (args: Args) => ({
  hasBorder: args.sectionHasBorder,
  ...buildTitleAdornments(args),
});

const HEADER_DESCRIPTION = 'Mar 30, 2022 @ 10:01:21.313';

/** Maps the title icon arg onto the header's icon/tooltip pair. */
const buildTitleIconProps = (args: Args) =>
  args.titleIcon
    ? { titleIcon: 'info' as const, titleTooltip: 'Additional context about this flyout.' }
    : {};

const METABLOCKS_POOL = [
  <FlyoutTemplate.Header.MetaBlock key="updated" title="Last updated">
    Dec 3, 2025
  </FlyoutTemplate.Header.MetaBlock>,
  <FlyoutTemplate.Header.MetaBlock key="updatedBy" title="Last updated by">
    <EuiLink href="#">name@elastic.co</EuiLink>
  </FlyoutTemplate.Header.MetaBlock>,
  <FlyoutTemplate.Header.MetaBlock key="owner" title="Owner">
    Platform
  </FlyoutTemplate.Header.MetaBlock>,
  <FlyoutTemplate.Header.MetaBlock key="creator" title="Created by">
    automation
  </FlyoutTemplate.Header.MetaBlock>,
];

const metaBlocksItems = (count: number) => METABLOCKS_POOL.slice(0, count);

const BADGE_POOL = [
  <FlyoutTemplate.Header.Badge key="type" iconType="warning" color="default">
    Type
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="urgency" color="warning">
    Urgency
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta1" color="hollow">
    Metadata 1 very very very very very very long label
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta2" color="hollow">
    Metadata 2
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta3" color="hollow">
    Metadata 2 very very very very long label
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta4" color="hollow">
    Metadata 4
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta5" color="hollow">
    Metadata 5
  </FlyoutTemplate.Header.Badge>,
  <FlyoutTemplate.Header.Badge key="meta6" color="hollow">
    Metadata 6
  </FlyoutTemplate.Header.Badge>,
];

const badgeItems = (count: number) => BADGE_POOL.slice(0, count);

const INFO_BLOCK_POOL = [
  <FlyoutTemplate.Header.InfoBlock key="owner" title="Owner">
    Platform
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="latency" title="Latency">
    <EuiHealth color="success">Healthy</EuiHealth>
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="throughput" title="Throughput">
    1.2k tpm
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="risk" title="Risk score" size="xl" color="danger">
    90
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="env" title="Environment">
    Production
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="version" title="Version">
    2.4.1
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="region" title="Region">
    us-east-1
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="uptime" title="Uptime">
    99.9%
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="last-seen" title="Last seen">
    2m ago
  </FlyoutTemplate.Header.InfoBlock>,
  <FlyoutTemplate.Header.InfoBlock key="errors" title="Errors" color="warning">
    12
  </FlyoutTemplate.Header.InfoBlock>,
];

const infoBlockItems = (count: number) => INFO_BLOCK_POOL.slice(0, count);

const renderTabPanelContent = (id: string, label: string) => {
  const details = TAB_PANEL_DETAILS[id];
  return (
    <FlyoutTemplate.Body.Section title={`${label} panel`} icon={details?.icon}>
      <EuiText size="s">
        <p>{details?.detail}</p>
      </EuiText>
    </FlyoutTemplate.Body.Section>
  );
};

const SECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'summary', title: 'Regular Section: Summary', content: 'Summary regular section content.' },
  { id: 'details', title: 'Regular Section: Details', content: 'Details regular section content.' },
  { id: 'context', title: 'Regular Section: Context', content: 'Context regular section content.' },
  { id: 'history', title: 'Regular Section: History', content: 'History regular section content.' },
];

const SUBSECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'host', title: 'Subsection: Host', content: 'Host subsection content.' },
  { id: 'process', title: 'Subsection: Process', content: 'Process subsection content.' },
  { id: 'network', title: 'Subsection: Network', content: 'Network subsection content.' },
  { id: 'user', title: 'Subsection: User', content: 'User subsection content.' },
];

const ACCORDIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'overview', title: 'Accordion: Overview', content: 'Overview accordion section content.' },
  { id: 'metadata', title: 'Accordion: Metadata', content: 'Metadata accordion section content.' },
  { id: 'timeline', title: 'Accordion: Timeline', content: 'Timeline accordion section content.' },
  { id: 'related', title: 'Accordion: Related', content: 'Related accordion section content.' },
];

/** Stand-ins for self-contained widgets that bring their own chrome. */
const UNSTRUCTURED_BLOCKS: Array<{ id: string; label: string; height: number }> = [
  { id: 'filterBar', label: 'Unstructured content: Filter Bar', height: 48 },
  { id: 'dataGrid', label: 'Unstructured content: Data Grid', height: 320 },
];

/** Content the template does not own, so each block brings its own bottom spacing. */
const unstructuredBlocks = (count: number) =>
  UNSTRUCTURED_BLOCKS.slice(0, count).map(({ id, label, height }) => (
    <React.Fragment key={id}>
      <EuiPanel color="primary" hasShadow={false} css={{ minHeight: height }}>
        <EuiText size="s" textAlign="center">
          <p>
            <em>{label}</em>
          </p>
        </EuiText>
      </EuiPanel>
      <EuiSpacer size="m" />
    </React.Fragment>
  ));

const bodyText = (content: string) => (
  <EuiText size="s">
    <p>{content}</p>
  </EuiText>
);

/**
 * Each zone below is called inline (not rendered as a component) so the root still
 * sees `FlyoutTemplate.Header`/`Body`/`Footer` as its own direct children.
 */
const headerZone = (args: Args, title: string) => (
  <FlyoutTemplate.Header
    title={title}
    {...buildTitleIconProps(args)}
    description={args.description ? HEADER_DESCRIPTION : undefined}
  >
    {metaBlocksItems(args.numMetaBlocks)}
    {badgeItems(args.numBadges)}
    {infoBlockItems(args.numInfoBlocks)}
    {TABS.slice(0, args.numTabs).map(({ id, label }) => (
      <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
    ))}
  </FlyoutTemplate.Header>
);

/** Wraps `content` in one `TabPanel` per tab, or renders it bare when there are no tabs. */
const bodyZone = (args: Args, content: (tabId?: string) => ReactNode) => {
  const tabs = TABS.slice(0, args.numTabs);
  return (
    <FlyoutTemplate.Body>
      {tabs.length
        ? tabs.map(({ id }) => (
            <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
              {content(id)}
            </FlyoutTemplate.Body.TabPanel>
          ))
        : content()}
    </FlyoutTemplate.Body>
  );
};

const footerZone = (args: Args) =>
  args.footer ? (
    <FlyoutTemplate.Footer>
      <FlyoutTemplate.Footer.SecondaryAction
        label="Discard"
        onClick={action('discard')}
        {...(args.secondaryActionIcon ? { iconType: 'trash' } : {})}
      />
      <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
    </FlyoutTemplate.Footer>
  ) : null;

export default meta;

type Story = StoryObj<Args>;

const RegularSectionsRender = (args: Args): React.JSX.Element => {
  const pagination = usePaginationProps(args);
  const subsections = SUBSECTIONS.slice(0, args.numSubsections);

  const bodyItems = SECTIONS.slice(0, args.numSections).map(({ id, title, content }) => (
    <FlyoutTemplate.Body.Section key={id} title={title} {...buildSectionProps(args)}>
      {subsections.length
        ? subsections.map(({ id: subId, title: subTitle, content: subContent }) => (
            <FlyoutTemplate.Body.Section.Subsection key={subId} id={subId} title={subTitle}>
              {bodyText(subContent)}
            </FlyoutTemplate.Body.Section.Subsection>
          ))
        : bodyText(content)}
    </FlyoutTemplate.Body.Section>
  ));

  return (
    <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args, pagination)}>
      {headerZone(args, 'Service details')}
      {bodyZone(args, () => (
        <>
          {unstructuredBlocks(args.numUnstructuredBlocks)}
          {bodyItems}
        </>
      ))}
      {footerZone(args)}
    </FlyoutTemplate>
  );
};

export const RegularSections: Story = {
  render: RegularSectionsRender,
};

const AccordionsRender = (args: Args): React.JSX.Element => {
  const pagination = usePaginationProps(args);
  const subsections = SUBSECTIONS.slice(0, args.numSubsections);

  const bodyItems = ACCORDIONS.slice(0, args.numSections).map(({ id, title, content }, index) => (
    <FlyoutTemplate.Body.Accordion
      key={id}
      id={id}
      title={title}
      initialIsOpen={index === 0}
      {...buildTitleAdornments(args)}
    >
      {subsections.length
        ? subsections.map(({ id: subId, title: subTitle, content: subContent }) => (
            <FlyoutTemplate.Body.Accordion.Subsection key={subId} id={subId} title={subTitle}>
              {bodyText(subContent)}
            </FlyoutTemplate.Body.Accordion.Subsection>
          ))
        : bodyText(content)}
    </FlyoutTemplate.Body.Accordion>
  ));

  return (
    <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args, pagination)}>
      {headerZone(args, 'Alert details')}
      {bodyZone(args, () => (
        <>
          {unstructuredBlocks(args.numUnstructuredBlocks)}
          {bodyItems}
        </>
      ))}
      {footerZone(args)}
    </FlyoutTemplate>
  );
};

export const AccordionSections: Story = {
  argTypes: {
    // Accordion content is always outlined, so the border toggle does not apply here.
    sectionHasBorder: { table: { disable: true } },
    numSections: { name: 'Body accordions', control: { type: 'range', min: 0, max: 4, step: 1 } },
  },
  render: AccordionsRender,
};

const TabsRender = (args: Args): React.JSX.Element => {
  const visibleTabs = TABS.slice(0, args.numTabs);
  const [selectedTabId, setSelectedTabId] = useState<string | undefined>(visibleTabs[0]?.id);

  useEffect(() => {
    if (!visibleTabs.some((tab) => tab.id === selectedTabId)) {
      setSelectedTabId(visibleTabs[0]?.id);
    }
  }, [visibleTabs, selectedTabId]);

  return (
    <>
      <EuiText size="s">
        <p>
          These buttons live outside the flyout and drive the same <code>selectedTabId</code> state
          as the tab bar below, to prove that tab selection is controlled end-to-end.
        </p>
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFlexGroup gutterSize="s" wrap responsive={false}>
        {visibleTabs.map(({ id, label }) => (
          <EuiFlexItem grow={false} key={id}>
            <EuiButton size="s" fill={selectedTabId === id} onClick={() => setSelectedTabId(id)}>
              {label}
            </EuiButton>
          </EuiFlexItem>
        ))}
      </EuiFlexGroup>
      <EuiSpacer size="m" />

      <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
        <FlyoutTemplate.Header
          title="Tabs demo"
          {...buildTitleIconProps(args)}
          description={args.description ? HEADER_DESCRIPTION : undefined}
          selectedTabId={selectedTabId}
          onTabChange={setSelectedTabId}
        >
          {visibleTabs.map(({ id, label }) => (
            <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
          ))}
        </FlyoutTemplate.Header>

        <FlyoutTemplate.Body>
          {visibleTabs.map(({ id, label }) => (
            <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
              {renderTabPanelContent(id, label)}
            </FlyoutTemplate.Body.TabPanel>
          ))}
        </FlyoutTemplate.Body>

        {footerZone(args)}
      </FlyoutTemplate>
    </>
  );
};

export const Tabs: Story = {
  argTypes: {
    numLeadingActions: { table: { disable: true } },
    numTrailingActions: { table: { disable: true } },
    numPages: { table: { disable: true } },
    paginationJump: { table: { disable: true } },
    numMetaBlocks: { table: { disable: true } },
    numBadges: { table: { disable: true } },
    numInfoBlocks: { table: { disable: true } },
    numSections: { table: { disable: true } },
    sectionIcon: { table: { disable: true } },
    sectionAction: { table: { disable: true } },
    sectionHasBorder: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
    numUnstructuredBlocks: { table: { disable: true } },
    numTabs: {
      name: 'Tabs',
      control: { type: 'range', min: 1, max: TABS.length, step: 1 },
      table: { category: 'Header' },
    },
  },
  args: {
    numTabs: 6,
    titleIcon: false,
    description: false,
    footer: true,
  },
  render: TabsRender,
};

const WithHistoryRender = (args: Args): React.JSX.Element => {
  const historyKey = useRef(Symbol('flyoutTemplateHistory')).current;

  const [isFlyoutAOpen, setIsFlyoutAOpen] = useState(true);
  const [isFlyoutBOpen, setIsFlyoutBOpen] = useState(false);
  const [isFlyoutCOpen, setIsFlyoutCOpen] = useState(false);

  const bodyContent = (label: string) => (
    <>
      {unstructuredBlocks(args.numUnstructuredBlocks)}
      <EuiText size="s">
        <p>This is the content of {label}.</p>
      </EuiText>
    </>
  );

  const openFlyoutA = () => {
    setIsFlyoutAOpen(true);
  };
  const openFlyoutB = () => {
    setIsFlyoutBOpen(true);
  };
  const openFlyoutC = () => {
    setIsFlyoutCOpen(true);
  };

  return (
    <>
      <EuiButton onClick={openFlyoutA} disabled={isFlyoutAOpen}>
        Open flyout A
      </EuiButton>
      <EuiSpacer size="s" />
      <EuiButton onClick={openFlyoutB} disabled={isFlyoutBOpen}>
        Open flyout B
      </EuiButton>
      <EuiSpacer size="s" />
      <EuiButton onClick={openFlyoutC} disabled={isFlyoutCOpen}>
        Open flyout C
      </EuiButton>

      {isFlyoutAOpen && (
        <FlyoutTemplate
          onClose={() => setIsFlyoutAOpen(false)}
          size="m"
          historyKey={historyKey}
          {...buildFlyoutProps(args)}
        >
          {headerZone(args, 'Flyout A')}
          {bodyZone(args, () => bodyContent('Flyout A'))}
          {footerZone(args)}
        </FlyoutTemplate>
      )}
      {isFlyoutBOpen && (
        <FlyoutTemplate
          onClose={() => setIsFlyoutBOpen(false)}
          size="m"
          historyKey={historyKey}
          {...buildFlyoutProps(args)}
        >
          {headerZone(args, 'Flyout B')}
          {bodyZone(args, () => bodyContent('Flyout B'))}
          {footerZone(args)}
        </FlyoutTemplate>
      )}
      {isFlyoutCOpen && (
        <FlyoutTemplate
          onClose={() => setIsFlyoutCOpen(false)}
          size="m"
          historyKey={historyKey}
          {...buildFlyoutProps(args)}
        >
          {headerZone(args, 'Flyout C')}
          {bodyZone(args, () => bodyContent('Flyout C'))}
          {footerZone(args)}
        </FlyoutTemplate>
      )}
    </>
  );
};

export const MenuBarHistory: Story = {
  argTypes: {
    titleIcon: { table: { disable: true } },
    description: { table: { disable: true } },
    numMetaBlocks: { table: { disable: true } },
    numBadges: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
    numPages: { table: { disable: true } },
    numInfoBlocks: { table: { disable: true } },
    numTabs: { table: { disable: true } },
    numSections: { table: { disable: true } },
    sectionIcon: { table: { disable: true } },
    sectionAction: { table: { disable: true } },
    sectionHasBorder: { table: { disable: true } },
    footer: { table: { disable: true } },
  },
  args: {
    numPages: 0,
    numInfoBlocks: 6,
    numTabs: 1,
    numSections: 2,
    numUnstructuredBlocks: 1,
    titleIcon: true,
    description: true,
    numMetaBlocks: 3,
    numBadges: 8,
    footer: true,
  },
  render: WithHistoryRender,
};

const PlaygroundRender = (args: Args): React.JSX.Element => {
  const historyKey = useRef(Symbol('playgroundHistory')).current;

  const [isSettingsFlyoutOpen, setIsSettingsFlyoutOpen] = useState(true);
  const [isToolsFlyoutOpen, setIsToolsFlyoutOpen] = useState(true);

  const singleFlyout = ({
    title,
    content,
    onClose,
    flyoutMenuProps,
  }: {
    title: string;
    content: string;
    onClose: () => void;
    flyoutMenuProps?: FlyoutTemplateProps['flyoutMenuProps'];
  }) => (
    <FlyoutTemplate
      onClose={onClose}
      size="m"
      historyKey={historyKey}
      type={args.type}
      ownFocus={args.ownFocus}
      resizable={args.resizable}
      flyoutMenuProps={flyoutMenuProps}
    >
      <FlyoutTemplate.Header title={title} />
      <FlyoutTemplate.Body>
        <EuiText size="s">
          <p>{content}</p>
        </EuiText>
      </FlyoutTemplate.Body>
    </FlyoutTemplate>
  );

  return (
    <>
      <EuiButton onClick={() => setIsToolsFlyoutOpen(true)} disabled={isToolsFlyoutOpen}>
        Open tools flyout
      </EuiButton>
      <EuiSpacer size="s" />
      <EuiButton onClick={() => setIsSettingsFlyoutOpen(true)} disabled={isSettingsFlyoutOpen}>
        Open settings flyout
      </EuiButton>

      {isSettingsFlyoutOpen &&
        singleFlyout({
          title: 'Settings',
          content: 'This is the content of the settings flyout.',
          flyoutMenuProps: {
            leadingActions: [
              {
                iconType: 'gear',
                toolTipContent: 'Settings action',
                onClick: action('click settings action'),
                'aria-label': 'Settings action',
              },
            ],
          },
          onClose: () => setIsSettingsFlyoutOpen(false),
        })}

      {isToolsFlyoutOpen &&
        singleFlyout({
          title: 'Tools',
          content: 'This is the content of the tools flyout.',
          flyoutMenuProps: {
            trailingActions: [
              {
                iconType: 'wrench',
                toolTipContent: 'Tools action',
                onClick: action('click tools action'),
                'aria-label': 'Tools action',
              },
            ],
          },
          onClose: () => setIsToolsFlyoutOpen(false),
        })}
    </>
  );
};

export const Playground: Story = {
  // do not allow any header args
  argTypes: {
    titleIcon: { table: { disable: true } },
    description: { table: { disable: true } },
    numPages: { table: { disable: true } },
    numMetaBlocks: { table: { disable: true } },
    numBadges: { table: { disable: true } },
    numInfoBlocks: { table: { disable: true } },
    numTabs: { table: { disable: true } },
    // do not allow any body args
    numSections: { table: { disable: true } },
    sectionIcon: { table: { disable: true } },
    sectionAction: { table: { disable: true } },
    sectionHasBorder: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
    numUnstructuredBlocks: { table: { disable: true } },
    // do not allow any footer args
    footer: { table: { disable: true } },
    secondaryActionIcon: { table: { disable: true } },
  },
  render: PlaygroundRender,
};

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
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import {
  type SharedStoryArgs,
  buildFlyoutProps,
  usePaginationProps,
  HEADER_DESCRIPTION,
  buildTitleIconProps,
  unstructuredBlocks,
  fillContent,
  bodyText,
  footerZone,
  headerZone as simpleHeaderZone,
  bodyZone as simpleBodyZone,
} from './stories_helpers';

type Args = SharedStoryArgs & {
  numInfoBlocks: number;
  sectionHasBorder: boolean;
  sectionIcon: boolean;
  sectionAction: boolean;
  numSections: number;
  numSubsections: number;
  numTabs: number;
  numMetaBlocks: number;
  numBadges: number;
  headerIsCollapsed: boolean;
};

const TABS: Array<{ id: string; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'logs', label: 'Logs' },
];

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
    headerIsCollapsed: false,
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
    headerIsCollapsed: {
      name: 'Force collapsed',
      control: { type: 'boolean' },
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

/**
 * Full header zone: includes tabs, badges, meta blocks, and info blocks.
 * Called inline so the root still sees `FlyoutTemplate.Header` as a direct child.
 */
const headerZone = (args: Args, title: string) => (
  <FlyoutTemplate.Header
    title={title}
    {...buildTitleIconProps(args)}
    description={args.description ? HEADER_DESCRIPTION : undefined}
    collapsed={args.headerIsCollapsed}
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

export default meta;

type Story = StoryObj<Args>;

const SECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'summary', title: 'Regular Section: Summary', content: 'Summary regular section content.' },
  { id: 'details', title: 'Regular Section: Details', content: 'Details regular section content.' },
  { id: 'context', title: 'Regular Section: Context', content: 'Context regular section content.' },
  { id: 'history', title: 'Regular Section: History', content: 'History regular section content.' },
].map(({ content, ...fields }) => ({ ...fields, content: fillContent(content) }));

const SUBSECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'host', title: 'Subsection: Host', content: 'Host subsection content.' },
  { id: 'process', title: 'Subsection: Process', content: 'Process subsection content.' },
  { id: 'network', title: 'Subsection: Network', content: 'Network subsection content.' },
  { id: 'user', title: 'Subsection: User', content: 'User subsection content.' },
].map(({ content, ...fields }) => ({ ...fields, content: fillContent(content) }));

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

const ACCORDIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'overview', title: 'Accordion: Overview', content: 'Overview accordion section content.' },
  { id: 'metadata', title: 'Accordion: Metadata', content: 'Metadata accordion section content.' },
  { id: 'timeline', title: 'Accordion: Timeline', content: 'Timeline accordion section content.' },
  { id: 'related', title: 'Accordion: Related', content: 'Related accordion section content.' },
];

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

/** Distinct look-and-feel per tab, so switching tabs is obvious even at a glance. */
const TAB_PANEL_DETAILS: Record<string, { icon: string; detail: string }> = {
  overview: { icon: 'inspect', detail: 'A high-level summary of the alert lifecycle and current state.' },
  metadata: { icon: 'tag', detail: 'Structured key/value pairs captured when the alert was created.' },
  timeline: { icon: 'clock', detail: 'A chronological list of state changes and annotations.' },
  logs: { icon: 'document', detail: 'Raw log lines correlated to this alert by trace id.' },
}; // prettier-ignore

const renderTabPanelContent = (id: string, label: string) => {
  const details = TAB_PANEL_DETAILS[id];
  return (
    <FlyoutTemplate.Body.Section title={`${label} panel`} icon={details?.icon}>
      <EuiText size="s">
        <p>{fillContent(details.detail)}</p>
        <p>{fillContent()}</p>
      </EuiText>
    </FlyoutTemplate.Body.Section>
  );
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
          collapsed={args.headerIsCollapsed}
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
    numTabs: 4,
    titleIcon: false,
    description: false,
    footer: true,
  },
  render: TabsRender,
};

const MenuBarPaginationRender = (args: Args): React.JSX.Element => {
  const pagination = usePaginationProps(args);
  return (
    <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args, pagination)}>
      {simpleHeaderZone(args, 'Service details')}
      {simpleBodyZone(
        <>
          {unstructuredBlocks(args.numUnstructuredBlocks)}
          {bodyText(fillContent('Service details.'))}
        </>
      )}
      {footerZone(args)}
    </FlyoutTemplate>
  );
};

export const MenuBarPagination: Story = {
  argTypes: {
    titleIcon: { table: { disable: true } },
    description: { table: { disable: true } },
    footer: { table: { disable: true } },
    numInfoBlocks: { table: { disable: true } },
    numSections: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
    numTabs: { table: { disable: true } },
    numMetaBlocks: { table: { disable: true } },
    numBadges: { table: { disable: true } },
    headerIsCollapsed: { table: { disable: true } },
    sectionIcon: { table: { disable: true } },
    sectionAction: { table: { disable: true } },
    sectionHasBorder: { table: { disable: true } },
  },
  args: {
    numUnstructuredBlocks: 1,
    titleIcon: true,
    description: true,
    footer: true,
    numPages: 5,
  },
  render: MenuBarPaginationRender,
};

const WithHistoryRender = (args: Args): React.JSX.Element => {
  const historyKey = useRef(Symbol('flyoutTemplateHistory')).current;

  const [isFlyoutAOpen, setIsFlyoutAOpen] = useState(true);
  const [isFlyoutBOpen, setIsFlyoutBOpen] = useState(true);
  const [isFlyoutCOpen, setIsFlyoutCOpen] = useState(true);

  const bodyContent = (label: string) => (
    <>
      {unstructuredBlocks(args.numUnstructuredBlocks)}
      <EuiText size="s">
        <p>This is content of {label}.</p>
      </EuiText>
    </>
  );

  return (
    <>
      <EuiButton onClick={() => setIsFlyoutAOpen(true)} disabled={isFlyoutAOpen}>
        Open flyout A
      </EuiButton>
      <EuiSpacer size="s" />
      <EuiButton onClick={() => setIsFlyoutBOpen(true)} disabled={isFlyoutBOpen}>
        Open flyout B
      </EuiButton>
      <EuiSpacer size="s" />
      <EuiButton onClick={() => setIsFlyoutCOpen(true)} disabled={isFlyoutCOpen}>
        Open flyout C
      </EuiButton>

      {isFlyoutAOpen && (
        <FlyoutTemplate
          onClose={() => setIsFlyoutAOpen(false)}
          size="m"
          historyKey={historyKey}
          {...buildFlyoutProps(args)}
        >
          {simpleHeaderZone(args, 'Flyout A')}
          {simpleBodyZone(bodyContent('Flyout A'))}
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
          {simpleHeaderZone(args, 'Flyout B')}
          {simpleBodyZone(bodyContent('Flyout B'))}
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
          {simpleHeaderZone(args, 'Flyout C')}
          {simpleBodyZone(bodyContent('Flyout C'))}
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
    headerIsCollapsed: { table: { disable: true } },
  },
  args: {
    numLeadingActions: 0,
    numTrailingActions: 0,
    numUnstructuredBlocks: 1,
    titleIcon: true,
    description: false,
    footer: true,
  },
  render: WithHistoryRender,
};

const HeaderCollapseOnScrollRender = (args: Args): React.JSX.Element => {
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
      {headerZone(
        args,
        'Flyout title is quite long, so that it takes up 2 lines of text and then some'
      )}
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

export const HeaderCollapseOnScroll: Story = {
  args: {
    numLeadingActions: 0,
    numTrailingActions: 0,
    numInfoBlocks: 10,
    numSections: 4,
    numUnstructuredBlocks: 1,
    sectionIcon: true,
    sectionAction: true,
    numSubsections: 2,
  },
  render: HeaderCollapseOnScrollRender,
};

const ErrorInFlyoutRender = (args: Args): React.JSX.Element => {
  const BadComponent = () => {
    const [hasError, setHasError] = useState(false);

    if (hasError) {
      throw new Error('This is an error to show the test user!'); // custom error
    }

    const clickedForError = action('clicked for error');
    const handleClick = () => {
      clickedForError();
      setHasError(true);
    };

    return (
      <EuiButton color="danger" onClick={handleClick}>
        Throw error
      </EuiButton>
    );
  };

  return (
    <FlyoutTemplate
      onClose={action('onClose')}
      size="s"
      type={args.type}
      ownFocus={args.ownFocus}
      resizable={args.resizable}
    >
      <FlyoutTemplate.Header title="Error in flyout">
        <FlyoutTemplate.Header.InfoBlock title="Bad component">
          <BadComponent />
        </FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Owner">Platform</FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Latency">
          <EuiHealth color="success">Healthy</EuiHealth>
        </FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Throughput">
          1.2k tpm
        </FlyoutTemplate.Header.InfoBlock>
      </FlyoutTemplate.Header>
      <FlyoutTemplate.Body>
        <BadComponent />
        <EuiSpacer size="m" />
        <FlyoutTemplate.Body.Section title="Section 1">
          <EuiText size="s">
            <p>This is a flyout template body section.</p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
    </FlyoutTemplate>
  );
};

export const ErrorInFlyout: Story = {
  // do not allow any header args
  argTypes: {
    titleIcon: { table: { disable: true } },
    description: { table: { disable: true } },
    numPages: { table: { disable: true } },
    numMetaBlocks: { table: { disable: true } },
    numBadges: { table: { disable: true } },
    numInfoBlocks: { table: { disable: true } },
    numTabs: { table: { disable: true } },
    numLeadingActions: { table: { disable: true } },
    numTrailingActions: { table: { disable: true } },
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
  render: ErrorInFlyoutRender,
};

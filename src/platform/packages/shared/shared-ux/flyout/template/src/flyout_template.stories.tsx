/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { EuiBadge, EuiHealth, EuiLink, EuiPanel, EuiText } from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import type { FlyoutTemplateProps } from './types';

const menuBarProps: FlyoutTemplateProps['flyoutMenuProps'] = {
  customActions: [
    { iconType: 'share', onClick: action('share'), 'aria-label': 'Share' },
    { iconType: 'gear', onClick: action('settings'), 'aria-label': 'Settings' },
  ],
};

interface Args {
  numInfoBlocks: number;
  sectionHasBorder: boolean;
  sectionIcon: boolean;
  sectionAction: boolean;
  menuBarActions: boolean;
  footer: boolean;
  resizable: boolean;
  type: NonNullable<FlyoutTemplateProps['type']>;
  ownFocus: boolean;
  numSections: number;
  numPlainSections: number;
  numSubsections: number;
  numTabs: number;
  titleIcon: boolean;
  description: boolean;
  numMetadata: number;
  numBadges: number;
}

const meta: Meta<Args> = {
  title: 'Flyout/Flyout Template',
  args: {
    menuBarActions: true,
    numInfoBlocks: 5,
    numTabs: 3,
    numSections: 2,
    numPlainSections: 2,
    sectionIcon: true,
    sectionAction: true,
    sectionHasBorder: false,
    numSubsections: 0,
    titleIcon: false,
    description: true,
    numMetadata: 3,
    numBadges: 8,
    footer: true,
    resizable: true,
    type: 'overlay',
    ownFocus: false,
  },
  argTypes: {
    menuBarActions: {
      name: 'Actions',
      control: { type: 'boolean' },
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
    numMetadata: {
      name: 'Metadata pairs',
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
      control: { type: 'range', min: 0, max: 10, step: 1 },
      table: { category: 'Header' },
    },
    numSections: {
      name: 'Sections',
      control: { type: 'range', min: 1, max: 4, step: 1 },
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
    numPlainSections: {
      name: 'Plain sections',
      control: { type: 'range', min: 1, max: 3, step: 1 },
      table: { category: 'Body' },
    },
    footer: { name: 'Footer', control: { type: 'boolean' }, table: { category: 'Footer' } },
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

/** Maps shared story args to `FlyoutTemplate` props. */
const buildFlyoutProps = ({
  menuBarActions,
  resizable,
  type,
  ownFocus,
}: Args): Omit<FlyoutTemplateProps, 'onClose' | 'children'> => ({
  type,
  resizable,
  ...(resizable ? { minWidth: 320 } : {}),
  ...(type === 'overlay' ? { ownFocus } : {}),
  ...(menuBarActions ? { flyoutMenuProps: menuBarProps } : {}),
});

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

const METADATA_POOL = [
  <FlyoutTemplate.Header.Metadata key="updated" title="Last updated">
    Dec 3, 2025
  </FlyoutTemplate.Header.Metadata>,
  <FlyoutTemplate.Header.Metadata key="updatedBy" title="Last updated by">
    <EuiLink href="#">name@elastic.co</EuiLink>
  </FlyoutTemplate.Header.Metadata>,
  <FlyoutTemplate.Header.Metadata key="owner" title="Owner">
    Platform
  </FlyoutTemplate.Header.Metadata>,
  <FlyoutTemplate.Header.Metadata key="creator" title="Created by">
    automation
  </FlyoutTemplate.Header.Metadata>,
];

const metadataItems = (count: number) => METADATA_POOL.slice(0, count);

const BADGE_POOL = [
  <EuiBadge key="type" iconType="warning" color="default">
    Type
  </EuiBadge>,
  <EuiBadge key="urgency" color="warning">
    Urgency
  </EuiBadge>,
  <EuiBadge key="meta1" color="hollow">
    Metadata 1 very very very very very very long label
  </EuiBadge>,
  <EuiBadge key="meta2" color="hollow">
    Metadata 2
  </EuiBadge>,
  <EuiBadge key="meta3" color="hollow">
    Metadata 2 very very very very long label
  </EuiBadge>,
  <EuiBadge key="meta4" color="hollow">
    Metadata 4
  </EuiBadge>,
  <EuiBadge key="meta5" color="hollow">
    Metadata 5
  </EuiBadge>,
  <EuiBadge key="meta6" color="hollow">
    Metadata 6
  </EuiBadge>,
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

/** Tab panels render the body sections, so tabs only need an id and a label. */
const TABS: Array<{ id: string; label: string }> = [
  { id: 'overview', label: 'Overview' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'logs', label: 'Logs' },
  { id: 'traces', label: 'Traces' },
  { id: 'errors', label: 'Errors' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'metrics', label: 'Metrics' },
  { id: 'events', label: 'Events' },
  { id: 'alerts', label: 'Alerts' },
];

const SECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'summary', title: 'Summary', content: 'Summary section content.' },
  { id: 'details', title: 'Details', content: 'Details section content.' },
  { id: 'context', title: 'Context', content: 'Context section content.' },
  { id: 'history', title: 'History', content: 'History section content.' },
];

const SUBSECTIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'host', title: 'Host', content: 'Host subsection content.' },
  { id: 'process', title: 'Process', content: 'Process subsection content.' },
  { id: 'network', title: 'Network', content: 'Network subsection content.' },
  { id: 'user', title: 'User', content: 'User subsection content.' },
];

const ACCORDIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'overview', title: 'Overview', content: 'Overview accordion content.' },
  { id: 'metadata', title: 'Metadata', content: 'Metadata accordion content.' },
  { id: 'timeline', title: 'Timeline', content: 'Timeline accordion content.' },
  { id: 'related', title: 'Related', content: 'Related accordion content.' },
];

/** Stand-ins for self-contained widgets that bring their own chrome. */
const PLAIN_SECTIONS: Array<{ id: string; label: string; height: number }> = [
  { id: 'filterBar', label: 'Filter Bar', height: 48 },
  { id: 'dataGrid', label: 'Data Grid', height: 320 },
  { id: 'pagination', label: 'Pagination', height: 48 },
];

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
    badges={badgeItems(args.numBadges)}
  >
    {metadataItems(args.numMetadata)}
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
      <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={action('discard')} />
      <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
    </FlyoutTemplate.Footer>
  ) : null;

export default meta;

type Story = StoryObj<Args>;

export const RegularSections: Story = {
  argTypes: {
    numPlainSections: { table: { disable: true } },
  },
  render: (args) => {
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
      <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
        {headerZone(args, 'Service details')}
        {bodyZone(args, () => bodyItems)}
        {footerZone(args)}
      </FlyoutTemplate>
    );
  },
};

export const Accordions: Story = {
  argTypes: {
    // Accordion content is always outlined, so the border toggle does not apply here.
    sectionHasBorder: { table: { disable: true } },
    numSections: { name: 'Body accordions', control: { type: 'range', min: 1, max: 4, step: 1 } },
    numPlainSections: { table: { disable: true } },
  },
  render: (args) => {
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
      <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
        {headerZone(args, 'Alert details')}
        {bodyZone(args, () => bodyItems)}
        {footerZone(args)}
      </FlyoutTemplate>
    );
  },
};

export const PlainSections: Story = {
  argTypes: {
    sectionIcon: { table: { disable: true } },
    sectionAction: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
    // Plain sections can stand alone, so allow a body with no titled sections.
    numSections: { name: 'Body sections', control: { type: 'range', min: 0, max: 4, step: 1 } },
  },
  render: (args) => {
    const plainSections = PLAIN_SECTIONS.slice(0, args.numPlainSections);
    const sections = SECTIONS.slice(0, args.numSections);

    // `PlainSection` ids must stay unique per tab panel, so prefix them when tabbed.
    const bodyItems = (tabId?: string) => (
      <>
        {plainSections.map(({ id, label, height }) => (
          <FlyoutTemplate.Body.PlainSection key={id} id={tabId ? `${tabId}-${id}` : id}>
            <EuiPanel color="primary" hasShadow={false} css={{ minHeight: height }}>
              <EuiText size="s" textAlign="center">
                <p>
                  <em>{label}</em>
                </p>
              </EuiText>
            </EuiPanel>
          </FlyoutTemplate.Body.PlainSection>
        ))}
        {sections.map(({ id, title, content }) => (
          <FlyoutTemplate.Body.Section key={id} title={title} hasBorder={args.sectionHasBorder}>
            {bodyText(content)}
          </FlyoutTemplate.Body.Section>
        ))}
      </>
    );

    return (
      <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
        {headerZone(args, 'Document')}
        {bodyZone(args, bodyItems)}
        {footerZone(args)}
      </FlyoutTemplate>
    );
  },
};

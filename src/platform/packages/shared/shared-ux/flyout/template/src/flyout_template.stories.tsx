/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  EuiBadge,
  EuiButton,
  EuiFlexGroup,
  EuiFlexItem,
  EuiHealth,
  EuiLink,
  EuiPanel,
  EuiText,
} from '@elastic/eui';
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
    numSubsections: 2,
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
      // One above the cap, to exercise the dev warning.
      name: 'Metadata pairs',
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
      control: { type: 'range', min: 1, max: 4, step: 1 },
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

const infoBlockParts = (count: number) => INFO_BLOCK_POOL.slice(0, count);

/**
 * The footer zone, which is optional. Called inline (not rendered as a component)
 * so the root still sees `FlyoutTemplate.Footer` as its own child.
 */
const footerZone = (args: Args) =>
  args.footer ? (
    <FlyoutTemplate.Footer>
      <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={action('discard')} />
      <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
    </FlyoutTemplate.Footer>
  ) : null;

const TABS: Array<{ id: string; label: string; content: string }> = [
  { id: 'overview', label: 'Overview', content: 'Overview panel content.' },
  { id: 'metadata', label: 'Metadata', content: 'Metadata panel content.' },
  { id: 'timeline', label: 'Timeline', content: 'Timeline panel content.' },
  { id: 'logs', label: 'Logs', content: 'Logs panel content.' },
  { id: 'traces', label: 'Traces', content: 'Traces panel content.' },
  { id: 'errors', label: 'Errors', content: 'Errors panel content.' },
  { id: 'dependencies', label: 'Dependencies', content: 'Dependencies panel content.' },
  { id: 'metrics', label: 'Metrics', content: 'Metrics panel content.' },
  { id: 'events', label: 'Events', content: 'Events panel content.' },
  { id: 'alerts', label: 'Alerts', content: 'Alerts panel content.' },
  { id: 'settings', label: 'Settings', content: 'Settings panel content.' },
  { id: 'history', label: 'History', content: 'History panel content.' },
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

export default meta;

type Story = StoryObj<Args>;

export const RegularSections: Story = {
  argTypes: {
    numPlainSections: { table: { disable: true } },
  },
  render: function Render(args) {
    const [open, setOpen] = useState<'simple' | 'subsections' | null>(null);
    const onClose = () => setOpen(null);
    const sections = SECTIONS.slice(0, args.numSections);
    const subsections = SUBSECTIONS.slice(0, args.numSubsections);
    const tabs = TABS.slice(0, args.numTabs);
    const hasTabs = tabs.length > 0;

    const simpleSections = sections.map(({ id, title, content }) => (
      <FlyoutTemplate.Body.Section key={id} title={title} {...buildSectionProps(args)}>
        <EuiText size="s">
          <p>{content}</p>
        </EuiText>
      </FlyoutTemplate.Body.Section>
    ));

    const subsectionSections = sections.map(({ id, title }) => (
      <FlyoutTemplate.Body.Section key={id} title={title} {...buildSectionProps(args)}>
        {subsections.map(({ id: subId, title: subTitle, content }) => (
          <FlyoutTemplate.Body.Section.Subsection key={subId} id={subId} title={subTitle}>
            <EuiText size="s">
              <p>{content}</p>
            </EuiText>
          </FlyoutTemplate.Body.Section.Subsection>
        ))}
      </FlyoutTemplate.Body.Section>
    ));

    return (
      <>
        <EuiFlexGroup gutterSize="s" wrap>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => setOpen('simple')}>Simple sections</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => setOpen('subsections')}>Sections with subsections</EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        {open === 'simple' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header
              title="Service details"
              {...buildTitleIconProps(args)}
              description={args.description ? HEADER_DESCRIPTION : undefined}
              badges={badgeItems(args.numBadges)}
            >
              {metadataItems(args.numMetadata)}
              {infoBlockParts(args.numInfoBlocks)}
              {tabs.map(({ id, label }) => (
                <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
              ))}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {hasTabs
                ? tabs.map(({ id }) => (
                    <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
                      {simpleSections}
                    </FlyoutTemplate.Body.TabPanel>
                  ))
                : simpleSections}
            </FlyoutTemplate.Body>
            {footerZone(args)}
          </FlyoutTemplate>
        )}

        {open === 'subsections' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header
              title="Alert details"
              {...buildTitleIconProps(args)}
              description={args.description ? HEADER_DESCRIPTION : undefined}
              badges={badgeItems(args.numBadges)}
            >
              {metadataItems(args.numMetadata)}
              {infoBlockParts(args.numInfoBlocks)}
              {tabs.map(({ id, label }) => (
                <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
              ))}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {hasTabs
                ? tabs.map(({ id }) => (
                    <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
                      {subsectionSections}
                    </FlyoutTemplate.Body.TabPanel>
                  ))
                : subsectionSections}
            </FlyoutTemplate.Body>
            {footerZone(args)}
          </FlyoutTemplate>
        )}
      </>
    );
  },
};

export const Accordions: Story = {
  // Accordion content is always outlined, so the border toggle does not apply here.
  args: { numSections: 3 },
  argTypes: {
    sectionHasBorder: { table: { disable: true } },
    numSections: { name: 'Body accordions', control: { type: 'range', min: 1, max: 4, step: 1 } },
    numPlainSections: { table: { disable: true } },
  },
  render: function Render(args) {
    const [open, setOpen] = useState<'simple' | 'subsections' | null>(null);
    const onClose = () => setOpen(null);
    const accordions = ACCORDIONS.slice(0, args.numSections);
    const subsections = SUBSECTIONS.slice(0, args.numSubsections);
    const tabs = TABS.slice(0, args.numTabs);
    const hasTabs = tabs.length > 0;

    const simpleAccordions = accordions.map(({ id, title, content }, index) => (
      <FlyoutTemplate.Body.Accordion
        key={id}
        id={id}
        title={title}
        initialIsOpen={index === 0}
        {...buildTitleAdornments(args)}
      >
        <EuiText size="s">
          <p>{content}</p>
        </EuiText>
      </FlyoutTemplate.Body.Accordion>
    ));

    const subsectionAccordions = accordions.map(({ id, title }, index) => (
      <FlyoutTemplate.Body.Accordion
        key={id}
        id={id}
        title={title}
        initialIsOpen={index === 0}
        {...buildTitleAdornments(args)}
      >
        {subsections.map(({ id: subId, title: subTitle, content }) => (
          <FlyoutTemplate.Body.Accordion.Subsection key={subId} id={subId} title={subTitle}>
            <EuiText size="s">
              <p>{content}</p>
            </EuiText>
          </FlyoutTemplate.Body.Accordion.Subsection>
        ))}
      </FlyoutTemplate.Body.Accordion>
    ));

    return (
      <>
        <EuiFlexGroup gutterSize="s" wrap>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => setOpen('simple')}>Simple accordions</EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => setOpen('subsections')}>
              Accordions with subsections
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        {open === 'simple' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header
              title="Alert details"
              {...buildTitleIconProps(args)}
              description={args.description ? HEADER_DESCRIPTION : undefined}
              badges={badgeItems(args.numBadges)}
            >
              {metadataItems(args.numMetadata)}
              {infoBlockParts(args.numInfoBlocks)}
              {tabs.map(({ id, label }) => (
                <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
              ))}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {hasTabs
                ? tabs.map(({ id }) => (
                    <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
                      {simpleAccordions}
                    </FlyoutTemplate.Body.TabPanel>
                  ))
                : simpleAccordions}
            </FlyoutTemplate.Body>
            {footerZone(args)}
          </FlyoutTemplate>
        )}

        {open === 'subsections' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header
              title="Alert details"
              {...buildTitleIconProps(args)}
              description={args.description ? HEADER_DESCRIPTION : undefined}
              badges={badgeItems(args.numBadges)}
            >
              {metadataItems(args.numMetadata)}
              {infoBlockParts(args.numInfoBlocks)}
              {tabs.map(({ id, label }) => (
                <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
              ))}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {hasTabs
                ? tabs.map(({ id }) => (
                    <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
                      {subsectionAccordions}
                    </FlyoutTemplate.Body.TabPanel>
                  ))
                : subsectionAccordions}
            </FlyoutTemplate.Body>
            {footerZone(args)}
          </FlyoutTemplate>
        )}
      </>
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
    const tabs = TABS.slice(0, args.numTabs);
    const hasTabs = tabs.length > 0;
    const plainSections = PLAIN_SECTIONS.slice(0, args.numPlainSections);
    const sections = SECTIONS.slice(0, args.numSections);

    const bodyContent = (tabId?: string) => (
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
            <EuiText size="s">
              <p>{content}</p>
            </EuiText>
          </FlyoutTemplate.Body.Section>
        ))}
      </>
    );

    return (
      <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
        <FlyoutTemplate.Header
          title="Document"
          {...buildTitleIconProps(args)}
          description={args.description ? HEADER_DESCRIPTION : undefined}
          badges={badgeItems(args.numBadges)}
        >
          {metadataItems(args.numMetadata)}
          {infoBlockParts(args.numInfoBlocks)}
          {tabs.map(({ id, label }) => (
            <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
          ))}
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          {hasTabs
            ? tabs.map((tab) => (
                <FlyoutTemplate.Body.TabPanel key={tab.id} tabId={tab.id}>
                  {bodyContent(tab.id)}
                </FlyoutTemplate.Body.TabPanel>
              ))
            : bodyContent()}
        </FlyoutTemplate.Body>
        {footerZone(args)}
      </FlyoutTemplate>
    );
  },
};

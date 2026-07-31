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
import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiHealth, EuiText } from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import type { FlyoutTemplateProps } from './types';

const menuBarProps: FlyoutTemplateProps['flyoutMenuProps'] = {
  customActions: [
    { iconType: 'share', onClick: action('share'), 'aria-label': 'Share' },
    { iconType: 'gear', onClick: action('settings'), 'aria-label': 'Settings' },
  ],
};

interface Args {
  infoBlocks: boolean;
  sectionHasBorder: boolean;
  sectionIcon: boolean;
  sectionAction: boolean;
  menuBarActions: boolean;
  footerActions: boolean;
  resizable: boolean;
  type: NonNullable<FlyoutTemplateProps['type']>;
  ownFocus: boolean;
  numSections: number;
  numSubsections: number;
  numTabs: number;
}

const meta: Meta<Args> = {
  title: 'Flyout/Flyout Template',
  args: {
    infoBlocks: true,
    sectionIcon: true,
    sectionAction: true,
    sectionHasBorder: false,
    menuBarActions: true,
    footerActions: true,
    resizable: true,
    type: 'overlay',
    ownFocus: false,
    numSections: 2,
    numSubsections: 3,
    numTabs: 3,
  },
  argTypes: {
    infoBlocks: { name: 'Info blocks', control: { type: 'boolean' } },
    sectionHasBorder: { name: 'Section has border', control: { type: 'boolean' } },
    sectionIcon: { name: 'Section icon', control: { type: 'boolean' } },
    sectionAction: { name: 'Section action', control: { type: 'boolean' } },
    menuBarActions: { name: 'Menu bar actions', control: { type: 'boolean' } },
    footerActions: { name: 'Footer actions', control: { type: 'boolean' } },
    resizable: { name: 'Resizable', control: { type: 'boolean' } },
    type: { name: 'Flyout type', control: { type: 'inline-radio' }, options: ['overlay', 'push'] },
    ownFocus: {
      name: 'Own focus',
      control: { type: 'boolean' },
      // `ownFocus` only applies to overlay flyouts, so hide it for push.
      if: { arg: 'type', eq: 'overlay' },
    },
    numSections: { name: 'Sections', control: { type: 'range', min: 1, max: 4, step: 1 } },
    numSubsections: { name: 'Subsections', control: { type: 'range', min: 1, max: 4, step: 1 } },
    numTabs: { name: 'Tabs', control: { type: 'range', min: 1, max: 12, step: 1 } },
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

/** Title-row adornments shared by `Body.Section` and `Body.Accordion`. */
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

const infoBlockParts = () => (
  <>
    <FlyoutTemplate.Header.InfoBlock title="Owner">Platform</FlyoutTemplate.Header.InfoBlock>
    <FlyoutTemplate.Header.InfoBlock title="Latency">
      <EuiHealth color="success">Healthy</EuiHealth>
    </FlyoutTemplate.Header.InfoBlock>
    <FlyoutTemplate.Header.InfoBlock title="Throughput">1.2k tpm</FlyoutTemplate.Header.InfoBlock>
    <FlyoutTemplate.Header.InfoBlock title="Risk score" size="xl" color="danger">
      90
    </FlyoutTemplate.Header.InfoBlock>
  </>
);

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

const renderWithTabs = (args: Args) => {
  const tabs = TABS.slice(0, args.numTabs);
  return (
    <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
      <FlyoutTemplate.Header title="Alert details">
        {args.infoBlocks && infoBlockParts()}
        {tabs.map(({ id, label }) => (
          <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
        ))}
      </FlyoutTemplate.Header>
      <FlyoutTemplate.Body>
        {tabs.map(({ id, label, content }) => (
          <FlyoutTemplate.Body.TabPanel key={id} tabId={id}>
            <FlyoutTemplate.Body.Section title={label} {...buildSectionProps(args)}>
              <EuiText size="s">
                <p>{content}</p>
              </EuiText>
            </FlyoutTemplate.Body.Section>
          </FlyoutTemplate.Body.TabPanel>
        ))}
      </FlyoutTemplate.Body>
      {args.footerActions && (
        <FlyoutTemplate.Footer>
          <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={action('discard')} />
          <FlyoutTemplate.Footer.PrimaryAction
            label="Investigate"
            onClick={action('investigate')}
          />
        </FlyoutTemplate.Footer>
      )}
    </FlyoutTemplate>
  );
};

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

export default meta;

type Story = StoryObj<Args>;

export const Tabs: Story = {
  argTypes: {
    numSections: { table: { disable: true } },
    numSubsections: { table: { disable: true } },
  },
  render: renderWithTabs,
};

export const Sections: Story = {
  argTypes: {
    numTabs: { table: { disable: true } },
  },
  render: function Render(args) {
    const [open, setOpen] = useState<'simple' | 'subsections' | null>(null);
    const onClose = () => setOpen(null);
    const sections = SECTIONS.slice(0, args.numSections);
    const subsections = SUBSECTIONS.slice(0, args.numSubsections);

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
            <FlyoutTemplate.Header title="Service details">
              {args.infoBlocks && infoBlockParts()}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {sections.map(({ id, title, content }) => (
                <FlyoutTemplate.Body.Section key={id} title={title} {...buildSectionProps(args)}>
                  <EuiText size="s">
                    <p>{content}</p>
                  </EuiText>
                </FlyoutTemplate.Body.Section>
              ))}
            </FlyoutTemplate.Body>
            {args.footerActions && (
              <FlyoutTemplate.Footer>
                <FlyoutTemplate.Footer.SecondaryAction
                  label="Discard"
                  onClick={action('discard')}
                />
                <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
              </FlyoutTemplate.Footer>
            )}
          </FlyoutTemplate>
        )}

        {open === 'subsections' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header title="Alert details">
              {args.infoBlocks && infoBlockParts()}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {sections.map(({ id, title }) => (
                <FlyoutTemplate.Body.Section key={id} title={title} {...buildSectionProps(args)}>
                  {subsections.map(({ id: subId, title: subTitle, content }) => (
                    <FlyoutTemplate.Body.Section.Subsection key={subId} id={subId} title={subTitle}>
                      <EuiText size="s">
                        <p>{content}</p>
                      </EuiText>
                    </FlyoutTemplate.Body.Section.Subsection>
                  ))}
                </FlyoutTemplate.Body.Section>
              ))}
            </FlyoutTemplate.Body>
            {args.footerActions && (
              <FlyoutTemplate.Footer>
                <FlyoutTemplate.Footer.SecondaryAction
                  label="Discard"
                  onClick={action('discard')}
                />
                <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
              </FlyoutTemplate.Footer>
            )}
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
    numSections: { name: 'Accordions', control: { type: 'range', min: 1, max: 4, step: 1 } },
    numTabs: { table: { disable: true } },
  },
  render: function Render(args) {
    const [open, setOpen] = useState<'simple' | 'subsections' | null>(null);
    const onClose = () => setOpen(null);
    const accordions = ACCORDIONS.slice(0, args.numSections);
    const subsections = SUBSECTIONS.slice(0, args.numSubsections);

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
            <FlyoutTemplate.Header title="Alert details">
              {args.infoBlocks && infoBlockParts()}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {accordions.map(({ id, title, content }, index) => (
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
              ))}
            </FlyoutTemplate.Body>
            {args.footerActions && (
              <FlyoutTemplate.Footer>
                <FlyoutTemplate.Footer.SecondaryAction
                  label="Discard"
                  onClick={action('discard')}
                />
                <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
              </FlyoutTemplate.Footer>
            )}
          </FlyoutTemplate>
        )}

        {open === 'subsections' && (
          <FlyoutTemplate onClose={onClose} size="m" {...buildFlyoutProps(args)}>
            <FlyoutTemplate.Header title="Alert details">
              {args.infoBlocks && infoBlockParts()}
            </FlyoutTemplate.Header>
            <FlyoutTemplate.Body>
              {accordions.map(({ id, title }, index) => (
                <FlyoutTemplate.Body.Accordion
                  key={id}
                  id={id}
                  title={title}
                  initialIsOpen={index === 0}
                  {...buildTitleAdornments(args)}
                >
                  {subsections.map(({ id: subId, title: subTitle, content }) => (
                    <FlyoutTemplate.Body.Accordion.Subsection
                      key={subId}
                      id={subId}
                      title={subTitle}
                    >
                      <EuiText size="s">
                        <p>{content}</p>
                      </EuiText>
                    </FlyoutTemplate.Body.Accordion.Subsection>
                  ))}
                </FlyoutTemplate.Body.Accordion>
              ))}
            </FlyoutTemplate.Body>
            {args.footerActions && (
              <FlyoutTemplate.Footer>
                <FlyoutTemplate.Footer.SecondaryAction
                  label="Discard"
                  onClick={action('discard')}
                />
                <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
              </FlyoutTemplate.Footer>
            )}
          </FlyoutTemplate>
        )}
      </>
    );
  },
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { EuiHealth, EuiText } from '@elastic/eui';
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

const renderSimple = (args: Args) => (
  <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
    <FlyoutTemplate.Header title="Service details">
      {args.infoBlocks && infoBlockParts()}
    </FlyoutTemplate.Header>
    <FlyoutTemplate.Body>
      <FlyoutTemplate.Body.Section title="Summary" {...buildSectionProps(args)}>
        <EuiText size="s">
          <p>
            Toggle the controls to preview info blocks, the managed menu bar, footer actions,
            resizing, and overlay/push behavior.
          </p>
        </EuiText>
      </FlyoutTemplate.Body.Section>
    </FlyoutTemplate.Body>
    {args.footerActions && (
      <FlyoutTemplate.Footer>
        <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={action('discard')} />
        <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
      </FlyoutTemplate.Footer>
    )}
  </FlyoutTemplate>
);

const TABS: Array<{ id: string; label: string; content: string }> = [
  { id: 'overview', label: 'Overview', content: 'Overview panel content.' },
  { id: 'metadata', label: 'Metadata', content: 'Metadata panel content.' },
  { id: 'timeline', label: 'Timeline', content: 'Timeline panel content.' },
];

const renderWithTabs = (args: Args) => (
  <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
    <FlyoutTemplate.Header title="Alert details">
      {args.infoBlocks && infoBlockParts()}
      {TABS.map(({ id, label }) => (
        <FlyoutTemplate.Header.Tab key={id} id={id} label={label} />
      ))}
    </FlyoutTemplate.Header>
    <FlyoutTemplate.Body>
      {TABS.map(({ id, label, content }) => (
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
        <FlyoutTemplate.Footer.PrimaryAction label="Investigate" onClick={action('investigate')} />
      </FlyoutTemplate.Footer>
    )}
  </FlyoutTemplate>
);

export const Tabs: Story = {
  render: renderWithTabs,
};

export default meta;

type Story = StoryObj<Args>;

export const RegularSections: Story = {
  render: renderSimple,
};

const ACCORDIONS: Array<{ id: string; title: string; content: string }> = [
  { id: 'overview', title: 'Overview', content: 'Overview accordion content.' },
  { id: 'metadata', title: 'Metadata', content: 'Metadata accordion content.' },
  { id: 'timeline', title: 'Timeline', content: 'Timeline accordion content.' },
];

const renderWithAccordions = (args: Args) => (
  <FlyoutTemplate onClose={action('onClose')} size="m" {...buildFlyoutProps(args)}>
    <FlyoutTemplate.Header title="Alert details">
      {args.infoBlocks && infoBlockParts()}
    </FlyoutTemplate.Header>
    <FlyoutTemplate.Body>
      {ACCORDIONS.map(({ id, title, content }, index) => (
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
        <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={action('discard')} />
        <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={action('save')} />
      </FlyoutTemplate.Footer>
    )}
  </FlyoutTemplate>
);

export const AccordionSections: Story = {
  render: renderWithAccordions,
  // Accordion content is always outlined, so the border toggle does not apply here.
  argTypes: {
    sectionHasBorder: { table: { disable: true } },
  },
};

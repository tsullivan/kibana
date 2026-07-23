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
import { EuiCallOut, EuiHealth, EuiText } from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import type { FlyoutTemplateProps } from './types';

const meta: Meta<typeof FlyoutTemplate> = {
  title: 'Flyout/Flyout Template',
  component: FlyoutTemplate,
};
export default meta;

type Story = StoryObj<typeof FlyoutTemplate>;

const noop = () => {};

const OpenableFlyout: React.FC<{
  children: React.ReactNode;
  label?: string;
  flyoutProps?: Omit<FlyoutTemplateProps, 'onClose' | 'children'>;
}> = ({ children, label = 'Open flyout', flyoutProps }) => {
  return (
    <FlyoutTemplate onClose={noop} size="m" {...flyoutProps}>
      {children}
    </FlyoutTemplate>
  );
};

export const Minimal: Story = {
  render: () => (
    <OpenableFlyout>
      <FlyoutTemplate.Header title="Service inventory" />
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Summary">
          <EuiText size="s">
            <p>A minimal flyout with a header title and a single body section.</p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
    </OpenableFlyout>
  ),
};

export const WithInfoBlocks: Story = {
  render: () => (
    <OpenableFlyout>
      <FlyoutTemplate.Header title="Service details">
        <FlyoutTemplate.Header.InfoBlock title="Owner">Platform</FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Latency">
          <EuiHealth color="success">Healthy</EuiHealth>
        </FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Throughput">
          1.2k tpm
        </FlyoutTemplate.Header.InfoBlock>
        <FlyoutTemplate.Header.InfoBlock title="Risk score" size="xl" color="danger">
          90
        </FlyoutTemplate.Header.InfoBlock>
      </FlyoutTemplate.Header>
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Summary">
          <EuiText size="s">
            <p>
              <code>Header.InfoBlock</code> parts resolve into{' '}
              <code>@kbn/shared-ux-info-blocks</code> and lay out in the responsive 3 → 2 → 1 column
              grid.
            </p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
    </OpenableFlyout>
  ),
};

export const SectionsWithPassthrough: Story = {
  render: () => (
    <OpenableFlyout>
      <FlyoutTemplate.Header title="Service details" />
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Summary">
          <EuiText size="s">
            <p>Structured sections can be interleaved with passthrough content.</p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
        <EuiCallOut title="Data is delayed" color="warning" size="s" />
        <FlyoutTemplate.Body.Section title="Dependencies">
          <EuiText size="s">
            <p>Another section rendered after the callout, preserving JSX order.</p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
    </OpenableFlyout>
  ),
};

export const WithFooterActions: Story = {
  render: () => (
    <OpenableFlyout>
      <FlyoutTemplate.Header title="Edit service" />
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Settings">
          <EuiText size="s">
            <p>Footer renders the primary action on the right and the secondary to its left.</p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
      <FlyoutTemplate.Footer>
        <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={noop} />
        <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={noop} />
      </FlyoutTemplate.Footer>
    </OpenableFlyout>
  ),
};

export const WithMenuBarActions: Story = {
  render: () => (
    <OpenableFlyout
      flyoutProps={{
        flyoutMenuProps: {
          customActions: [
            { iconType: 'share', onClick: noop, 'aria-label': 'Share' },
            { iconType: 'gear', onClick: noop, 'aria-label': 'Settings' },
          ],
        },
      }}
    >
      <FlyoutTemplate.Header title="Managed flyout" />
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Menu bar">
          <EuiText size="s">
            <p>
              Custom actions passed via <code>flyoutMenuProps</code> make EUI render the managed
              menu bar automatically.
            </p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
    </OpenableFlyout>
  ),
};

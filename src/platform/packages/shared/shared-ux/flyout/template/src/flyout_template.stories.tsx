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
import { EuiButton, EuiCallOut, EuiText } from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import type { FlyoutTemplateProps } from './types';

const meta: Meta<typeof FlyoutTemplate> = {
  title: 'Flyout/Flyout Template',
  component: FlyoutTemplate,
};
export default meta;

type Story = StoryObj<typeof FlyoutTemplate>;

const noop = () => {};

/**
 * The stories render managed flyouts (`session="start"`). The global Storybook
 * decorator provides `EuiProvider`, which supplies the `EuiFlyoutManager` and
 * the auto-provided menu bar.
 */
const OpenableFlyout: React.FC<{
  children: React.ReactNode;
  label?: string;
  flyoutProps?: Omit<FlyoutTemplateProps, 'onClose' | 'children'>;
}> = ({ children, label = 'Open flyout', flyoutProps }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <>
      <EuiButton onClick={() => setIsOpen(true)}>{label}</EuiButton>
      {isOpen && (
        <FlyoutTemplate onClose={() => setIsOpen(false)} size="m" {...flyoutProps}>
          {children}
        </FlyoutTemplate>
      )}
    </>
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

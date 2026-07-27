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
import { EuiHealth, EuiText } from '@elastic/eui';
import { FlyoutTemplate } from './flyout_template';
import type { FlyoutTemplateProps } from './types';

const noop = () => {};

const menuBarProps: FlyoutTemplateProps['flyoutMenuProps'] = {
  customActions: [
    { iconType: 'share', onClick: noop, 'aria-label': 'Share' },
    { iconType: 'gear', onClick: noop, 'aria-label': 'Settings' },
  ],
};

/**
 * Synthetic story args that toggle optional parts and structural props from the
 * Controls panel. These are not `FlyoutTemplate` props; the `render` maps them
 * onto the template and its declarative zones.
 */
interface Args {
  infoBlocks: boolean;
  menuBarActions: boolean;
  footerActions: boolean;
  resizable: boolean;
  type: NonNullable<FlyoutTemplateProps['type']>;
  ownFocus: boolean;
}

const renderSimple = ({
  infoBlocks,
  menuBarActions,
  footerActions,
  resizable,
  type,
  ownFocus,
}: Args) => {
  const flyoutProps: Omit<FlyoutTemplateProps, 'onClose' | 'children'> = {
    type,
    resizable,
    ...(resizable ? { minWidth: 320 } : {}),
    ...(type === 'overlay' ? { ownFocus } : {}),
    ...(menuBarActions ? { flyoutMenuProps: menuBarProps } : {}),
  };

  return (
    <FlyoutTemplate onClose={noop} size="m" {...flyoutProps}>
      <FlyoutTemplate.Header title="Service details">
        {infoBlocks && (
          <>
            <FlyoutTemplate.Header.InfoBlock title="Owner">
              Platform
            </FlyoutTemplate.Header.InfoBlock>
            <FlyoutTemplate.Header.InfoBlock title="Latency">
              <EuiHealth color="success">Healthy</EuiHealth>
            </FlyoutTemplate.Header.InfoBlock>
            <FlyoutTemplate.Header.InfoBlock title="Throughput">
              1.2k tpm
            </FlyoutTemplate.Header.InfoBlock>
            <FlyoutTemplate.Header.InfoBlock title="Risk score" size="xl" color="danger">
              90
            </FlyoutTemplate.Header.InfoBlock>
          </>
        )}
      </FlyoutTemplate.Header>
      <FlyoutTemplate.Body>
        <FlyoutTemplate.Body.Section title="Summary">
          <EuiText size="s">
            <p>
              Toggle the controls to preview info blocks, the managed menu bar, footer actions,
              resizing, and overlay/push behavior.
            </p>
          </EuiText>
        </FlyoutTemplate.Body.Section>
      </FlyoutTemplate.Body>
      {footerActions && (
        <FlyoutTemplate.Footer>
          <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={noop} />
          <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={noop} />
        </FlyoutTemplate.Footer>
      )}
    </FlyoutTemplate>
  );
};

const meta: Meta<Args> = {
  title: 'Flyout/Flyout Template',
  args: {
    infoBlocks: true,
    menuBarActions: true,
    footerActions: true,
    resizable: true,
    type: 'overlay',
    ownFocus: false,
  },
  argTypes: {
    infoBlocks: { name: 'Info blocks', control: { type: 'boolean' } },
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
  render: renderSimple,
};
export default meta;

type Story = StoryObj<Args>;

export const Simple: Story = {};

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
import {
  EuiBadge,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { MetadataPairs } from './metadata_pairs.component';
import type { MetadataItem } from './types';

const meta: Meta<typeof MetadataPairs> = {
  title: 'Flyout Template/Metadata Pairs',
  component: MetadataPairs,
  argTypes: {
    items: { table: { disable: true } },
    'data-test-subj': { table: { disable: true } },
  },
};
export default meta;

// Plain text pairs
const TEXT_ITEMS: MetadataItem[] = [
  { title: 'Last updated', value: 'Dec 3, 2025' },
  { title: 'Owner', value: 'Platform' },
  { title: 'Environment', value: 'production' },
  { title: 'Version', value: 'v8.19.0' },
  { title: 'Region', value: 'us-east-1' },
  { title: 'Namespace', value: 'kube-system' },
];

// Rich values
const RICH_ITEMS: MetadataItem[] = [
  {
    title: 'Rule',
    value: (
      <EuiLink href="#" onClick={action('Rule link clicked')}>
        Unusual process spawned
      </EuiLink>
    ),
  },
  { title: 'Severity', value: <EuiBadge color="danger">Critical</EuiBadge> },
  {
    title: 'Case',
    value: (
      <EuiLink href="#" onClick={action('Case link clicked')}>
        SOC-4821
      </EuiLink>
    ),
  },
  { title: 'Status', value: <EuiBadge color="hollow">Open</EuiBadge> },
  { title: 'Tags', value: <EuiBadge color="accent">exfiltration</EuiBadge> },
  { title: 'Assignee', value: 'Alex Braun' },
];

// Leads the set: a value long enough to exceed its column, so truncation is always visible.
const LONG_ITEM: MetadataItem = {
  title: 'Resource',
  value: 'etcd-cspm-control-plane-8fO2b-1a2b3c4d5e6f7g8h9i0j-kube-system',
};

// Interleaved so a row mixes plain and rich values.
const ITEMS: MetadataItem[] = [
  LONG_ITEM,
  ...TEXT_ITEMS.flatMap((item, index) => [item, RICH_ITEMS[index]]),
];
// Randomize ITEMS
const shuffledItems = ITEMS.sort(() => Math.random() - 0.5);
// Take the top 5 items
const topItems = shuffledItems.slice(0, 5);

interface StoryArgs {
  numberOfItems: number;
}

export const Metadata: StoryObj<StoryArgs> = {
  argTypes: {
    numberOfItems: {
      description: `Number of pairs to render. (3) is the designed maximum. At 0 it renders nothing.`,
      control: { type: 'range', min: 0, max: topItems.length, step: 1 },
    },
  },
  args: {
    numberOfItems: 3,
  },
  render: ({ numberOfItems }) => (
    <EuiFlyout
      onClose={action('Flyout closed')}
      size="m"
      aria-labelledby="flyoutTitle"
      minWidth={324}
      resizable
      ownFocus={false}
    >
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2 id="flyoutTitle">Unusual process spawned</h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <MetadataPairs items={topItems.slice(0, numberOfItems)} />
      </EuiFlyoutHeader>

      <EuiFlyoutBody>
        <EuiText size="s">
          <p>
            The metadata line sits beneath the flyout title, above the body content. Resize the
            flyout to watch the grid reflow.
          </p>
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  ),
};

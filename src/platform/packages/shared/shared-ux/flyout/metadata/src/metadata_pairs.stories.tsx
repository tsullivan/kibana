/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import {
  EuiBadge,
  EuiButton,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiLink,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { MetadataPairs } from './metadata_pairs.component';
import type { MetadataItem, MetadataPairsProps } from './types';

// Plain text pairs
const TEXT_ITEMS: MetadataItem[] = [
  {
    title: 'Resource',
    value: 'etcd-cspm-control-plane-8fO2b-1a2b3c4d5e6f7g8h9i0j-kube-system',
  },
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

const ALL_ITEMS: MetadataItem[] = [...TEXT_ITEMS, ...RICH_ITEMS];

// Copy before sorting: sort() mutates in place.
const getRandomItems = (count: number) =>
  [...ALL_ITEMS].sort(() => 0.5 - Math.random()).slice(0, count);

interface StoryArgs {
  numberOfItems: number;
}

const meta: Meta<MetadataPairsProps & StoryArgs> = {
  title: 'Flyout Template/Metadata',
  component: MetadataPairs,
  argTypes: {
    items: { table: { disable: true } },
    'data-test-subj': { table: { disable: true } },
    numberOfItems: {
      description: `Number of pairs to render. (3) is the designed maximum. At 0 it renders nothing.`,
      control: { type: 'range', min: 0, max: ALL_ITEMS.length, step: 1 },
    },
  },
  args: {
    numberOfItems: 3,
  },
};
export default meta;

const MetadataDemo: React.FC<StoryArgs> = ({ numberOfItems }) => {
  const [items, setItems] = useState<MetadataItem[]>(() => getRandomItems(numberOfItems));

  const setRandomItems = () => {
    setItems(getRandomItems(numberOfItems));
  };

  useEffect(() => {
    setItems(getRandomItems(numberOfItems));
  }, [numberOfItems]);

  return (
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
          <h2 id="flyoutTitle">Metadata Pairs</h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <MetadataPairs items={items} />
      </EuiFlyoutHeader>

      <EuiFlyoutBody>
        <EuiText>
          <p>Metadata component is in the flyout header with {numberOfItems} key-value pairs.</p>
        </EuiText>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiButton onClick={setRandomItems}>Randomize Items</EuiButton>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
};

export const Metadata: StoryObj<typeof meta> = {
  render: ({ numberOfItems }) => <MetadataDemo numberOfItems={numberOfItems} />,
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MetadataPairs } from './metadata_pairs.component';

describe('MetadataPairs', () => {
  it('renders each pair title and node value', () => {
    render(
      <MetadataPairs
        items={[
          { title: 'Last updated', value: 'Dec 3, 2025' },
          { title: 'Owner', value: <span>Platform</span> },
        ]}
      />
    );

    expect(screen.getByText('Last updated')).toBeInTheDocument();
    expect(screen.getByText('Dec 3, 2025')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
  });

  it('renders nothing when there are no items', () => {
    render(<MetadataPairs items={[]} />);
    expect(screen.queryByTestId('metadataPairs')).not.toBeInTheDocument();
  });

  it('honors a custom data-test-subj on the container', () => {
    render(<MetadataPairs data-test-subj="myPairs" items={[{ title: 'A', value: '1' }]} />);
    expect(screen.getByTestId('myPairs')).toBeInTheDocument();
  });

  it('honors a custom data-test-subj on an item', () => {
    render(
      <MetadataPairs
        items={[{ title: 'Owner', value: 'Platform', 'data-test-subj': 'ownerPair' }]}
      />
    );

    expect(screen.getByTestId('ownerPair')).toBeInTheDocument();
  });
});

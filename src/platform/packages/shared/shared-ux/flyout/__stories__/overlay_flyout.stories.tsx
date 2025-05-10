/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useRef } from 'react';
import { EuiButton, EuiText } from '@elastic/eui';

import type { FlyoutApi } from '../src/types';
import { JourneyFlyout } from '../src/journey_flyout';
import { PageTemplate } from './page_template';

const FlyoutOne = () => {
  return (
    <EuiText>
      <h2>Main flyout one</h2>
      <p>This is some other text.</p>
    </EuiText>
  );
};

export const OverlayFlyout = () => {
  const flyoutApi = useRef<FlyoutApi | null>(null);

  return (
    <PageTemplate
      title="Overlay flyout"
      button={[
        <>
          <EuiButton
            onClick={() => {
              flyoutApi.current?.openFlyout<{}>({
                Component: FlyoutOne,
                width: 800,
              });
            }}
          >
            Show flyout
          </EuiButton>
          <JourneyFlyout ref={flyoutApi} />
        </>,
      ]}
    />
  );
};

export default {
  title: 'Grouped Flyout',
  component: OverlayFlyout,
};

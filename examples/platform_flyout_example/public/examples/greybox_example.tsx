/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';

import { EuiButton, EuiSpacer, EuiText } from '@elastic/eui';

import { OverlayStart } from '@kbn/core/public';

interface GreyboxExampleProps {
  core: {
    overlays: OverlayStart;
  };
}

const GreyboxFlyout1: React.FC<{}> = () => {
  return (
    <EuiText>
      <h2>My flyout</h2>
      <EuiText>This is my fly fly flyout.</EuiText>
    </EuiText>
  );
};

export const GreyboxExample = ({ core }: GreyboxExampleProps) => {
  const flyoutApi = core.overlays.useManagedFlyout();

  return (
    <>
      <EuiText>
        <p>
          This example contains a simplistic greybox demonstration of the features of the system.
        </p>
      </EuiText>
      <EuiSpacer />
      <EuiButton
        onClick={() => {
          flyoutApi.openFlyout({
            Component: GreyboxFlyout1,
          });
        }}
      >
        Open my flyout
      </EuiButton>
    </>
  );
};

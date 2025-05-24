/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, type FC, useState } from 'react';

import { EuiButton, EuiFlexGrid, EuiFlexItem, EuiListGroup, EuiPanel, EuiText } from '@elastic/eui';
import { OverlayStart, ManagedFlyoutApi } from '@kbn/core-overlays-browser';

interface DemoProps {
  overlays: OverlayStart;
}

const Step1Content: FC<ManagedFlyoutApi> = (managedFlyoutApi) => {
  const { nextFlyout, openChildFlyout } = managedFlyoutApi;
  return (
    <EuiText>
      <h3>Step 1: Initial Content</h3>
      <p>This is the first piece of content in the flyout.</p>
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiButton onClick={() => nextFlyout({ Component: Step2Content, width: 450 })}>
            Go to Step 2
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton onClick={() => openChildFlyout({ Component: ChildContent, width: 250 })}>
            Open Child Flyout
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const Step2Content: FC<ManagedFlyoutApi> = ({ nextFlyout, openChildFlyout }) => {
  return (
    <EuiText>
      <h3>Step 2: Next Content</h3>
      <p>You navigated from Step 1.</p>
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiButton onClick={() => nextFlyout({ Component: Step3Content, width: 500 })}>
            Go to Step 3
          </EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton onClick={() => openChildFlyout({ Component: ChildContent, width: 280 })}>
            Open Child Flyout
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const Step3Content: FC<ManagedFlyoutApi> = ({ openChildFlyout }) => {
  return (
    <EuiText>
      <h3>Step 3: Final Content</h3>
      <p>This is the last step in this sequence.</p>
      <p>Use the &quot;Back&quot; button to return.</p>
      <EuiFlexGrid>
        <EuiFlexItem>
          <EuiButton onClick={() => openChildFlyout({ Component: ChildContent, width: 220 })}>
            Open Child Flyout
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const ChildContent: React.FC<ManagedFlyoutApi> = ({ closeChildFlyout }) => {
  return (
    <EuiText>
      <h4>Child Flyout Content!</h4>
      <p>This panel is aligned to the left of the main flyout.</p>
      <EuiFlexGrid>
        <EuiFlexItem>
          <EuiButton onClick={closeChildFlyout}>Close Child Flyout</EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const AnotherFlyoutContent: FC = () => {
  return (
    <EuiText>
      <h3>New</h3>
      <p>This is a fresh new flyout.</p>
    </EuiText>
  );
};

export const Demo: FC<DemoProps> = ({ overlays }) => {
  const { openFlyout, closeFlyout, getIsFlyoutOpen$, isFlyoutOpen } = overlays.useManagedFlyout();

  const handleOpenInitialFlyout = () => {
    openFlyout({ Component: Step1Content, width: 400 });
  };

  const handleOpenAnotherFreshFlyout = () => {
    openFlyout({
      // This will clear history if already open
      Component: AnotherFlyoutContent,
      width: 350,
    });
  };

  const handleCheckFlyoutStatus = () => {
    alert(`The flyout is currently ${isFlyoutOpen() ? 'open' : 'closed'}. (Synchronous check)`);
  };

  const buttonContent = [
    {
      label: 'Open step-by-step flyout (step 1)',
      href: '#',
      onClick: handleOpenInitialFlyout,
    },
    {
      label: 'Open fresh flyout',
      href: '#',
      onClick: handleOpenAnotherFreshFlyout,
    },
    {
      label: 'Close flyout',
      href: '#',
      onClick: closeFlyout,
    },
    {
      label: 'Check flyout status (synchronous)',
      href: '#',
      onClick: handleCheckFlyoutStatus,
    },
  ];

  const [flyoutStatus, setFlyoutStatus] = useState<boolean>(isFlyoutOpen());
  useEffect(() => {
    const subscription = getIsFlyoutOpen$().subscribe((isOpen) => {
      setFlyoutStatus(isOpen);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getIsFlyoutOpen$]);

  return (
    <EuiText>
      <h1>Demo</h1>
      <p>
        Flyout is currently: <strong>{flyoutStatus ? 'OPEN' : 'CLOSED'}</strong> (Reactive update)
      </p>

      <EuiPanel>
        <EuiListGroup listItems={buttonContent} color="primary" />
      </EuiPanel>
    </EuiText>
  );
};

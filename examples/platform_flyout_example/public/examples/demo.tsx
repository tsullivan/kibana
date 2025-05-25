/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  EuiButton,
  EuiFlexGrid,
  EuiFlexItem,
  EuiListGroup,
  EuiPanel,
  EuiSpacer,
  EuiText,
} from '@elastic/eui';
import { OverlayStart, UseManagedFlyoutApi } from '@kbn/core-overlays-browser';
import React, { useCallback, useEffect, useMemo, useState, type FC } from 'react';
import useObservable from 'react-use/lib/useObservable';
import { BehaviorSubject, Observable } from 'rxjs';

interface DemoDeps {
  overlays: OverlayStart;
}

interface StepProps {
  username: string;
}

const DataList: FC<StepProps> = React.memo(({ username }) => {
  return (
    <ul>
      <li>Username: {username || 'Guest'}</li>
    </ul>
  );
});

const renderStep1Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { nextFlyout, openChildFlyout } = managedFlyoutApi;

  const handleGoToStep2 = () => {
    nextFlyout({ renderBody: renderStep2Content(props), width: 450 });
  };

  const handleOpenChild = () => {
    openChildFlyout({ renderBody: renderChildContent(props), width: 250 });
  };

  return (
    <EuiText>
      <h3>Step 1: Initial Content</h3>
      <p>This is the first piece of content in the flyout.</p>
      <DataList {...props} />
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiButton onClick={handleGoToStep2}>Go to Step 2</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton onClick={handleOpenChild}>Open Child Flyout</EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const renderStep2Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { nextFlyout, openChildFlyout } = managedFlyoutApi;

  const handleGoToStep3 = () => {
    nextFlyout({ renderBody: renderStep3Content(props), width: 500 });
  };

  const handleOpenChild = () => {
    openChildFlyout({ renderBody: renderChildContent(props), width: 280 });
  };

  return (
    <EuiText>
      <h3>Step 2: Next Content</h3>
      <p>You navigated from Step 1.</p>
      <DataList {...props} />
      <EuiFlexGrid columns={2}>
        <EuiFlexItem>
          <EuiButton onClick={handleGoToStep3}>Go to Step 3</EuiButton>
        </EuiFlexItem>
        <EuiFlexItem>
          <EuiButton onClick={handleOpenChild}>Open Child Flyout</EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const renderStep3Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { openChildFlyout } = managedFlyoutApi;

  const handleOpenChild = () => {
    openChildFlyout({ renderBody: renderChildContent(props), width: 220 });
  };

  return (
    <EuiText>
      <h3>Step 3: Final Content</h3>
      <p>This is the last step in this sequence.</p>
      <p>Use the &quot;Back&quot; button to return.</p>
      <DataList {...props} />
      <EuiFlexGrid>
        <EuiFlexItem>
          <EuiButton onClick={handleOpenChild}>Open Child Flyout</EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const renderChildContent = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { closeChildFlyout } = managedFlyoutApi;

  const handleCloseChild = () => {
    closeChildFlyout();
  };

  return (
    <EuiText>
      <h4>Child Flyout Content!</h4>
      <p>This panel is aligned to the left of the main flyout.</p>
      <DataList {...props} />
      <EuiFlexGrid>
        <EuiFlexItem>
          <EuiButton onClick={handleCloseChild}>Close Child Flyout</EuiButton>
        </EuiFlexItem>
      </EuiFlexGrid>
    </EuiText>
  );
};

const renderAnotherFlyoutContent =
  ({ username$ }: { username$: Observable<string> }) =>
  () => {
    const FlyoutContent: React.FC = () => {
      const username = useObservable(username$, 'Guest');
      console.log('FlyoutContent!', username);
      return (
        <EuiText>
          <h3>New</h3>
          <p>This is a fresh new flyout.</p>
          <DataList username={username} />
        </EuiText>
      );
    };

    return <FlyoutContent />;
  };

export const Demo: FC<DemoDeps> = ({ overlays }) => {
  const { openFlyout, closeFlyout, isFlyoutOpen } = overlays.useManagedFlyout();
  const [username, setUsername] = useState<string>('');

  const username$ = useMemo(() => new BehaviorSubject(username), [username]);

  useEffect(() => {
    console.log('use effect!', username);
    username$.next(username);

    return () => username$.complete();
  }, [username$, username]);

  const handleOpenInitialFlyout = useCallback(() => {
    openFlyout({
      renderBody: renderStep1Content({ username }),
      width: 400,
    });
  }, [openFlyout, username]);

  const handleOpenAnotherFreshFlyout = useCallback(() => {
    openFlyout({
      renderBody: renderAnotherFlyoutContent({ username$: username$.asObservable() }),
      width: 350,
    });
  }, [openFlyout, username$]);

  const handleCheckFlyoutStatus = useCallback(() => {
    alert(`The flyout is currently ${isFlyoutOpen() ? 'open' : 'closed'}. (Synchronous check)`);
  }, [isFlyoutOpen]);

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
      label: 'Check flyout status',
      href: '#',
      onClick: handleCheckFlyoutStatus,
    },
  ];

  return (
    <EuiText>
      <h1>Demo</h1>
      <EuiPanel>
        <label htmlFor="username-input" style={{ marginRight: '10px' }}>
          Your Name:
        </label>
        <input
          id="username-input"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your name"
        />
      </EuiPanel>

      <EuiSpacer />

      <EuiPanel>
        <EuiListGroup listItems={buttonContent} color="primary" />
      </EuiPanel>
    </EuiText>
  );
};

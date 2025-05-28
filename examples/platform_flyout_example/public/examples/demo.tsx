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
  EuiFlexGroup,
  EuiFlexItem,
  EuiForm,
  EuiListGroup,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { OverlayStart, UseManagedFlyoutApi } from '@kbn/core-overlays-browser';
import React, { useCallback, useEffect, useRef, useState, type FC } from 'react';
import useObservable from 'react-use/lib/useObservable';
import { BehaviorSubject, Observable } from 'rxjs';

interface DemoDeps {
  overlays: OverlayStart;
}

interface StepProps {
  username$: Observable<string>;
}

const DataList: FC<StepProps> = ({ username$ }) => {
  const username = useObservable(username$);
  return (
    <ul>
      <li>Username: {username}</li>
    </ul>
  );
};

const childFlyoutConfig = (props: StepProps) => ({
  renderHeader: () => (
    <EuiTitle size="s">
      <h2>Child Flyout</h2>
    </EuiTitle>
  ),
  renderBody: (managedFlyoutApi: UseManagedFlyoutApi) => {
    return (
      <EuiText>
        <h4>Child Flyout Content!</h4>
        <p>This panel is aligned to the left of the main flyout.</p>
        <DataList {...props} />
        <EuiButton onClick={managedFlyoutApi.closeChildFlyout}>Close Child Flyout</EuiButton>
      </EuiText>
    );
  },
  flyoutProps: {
    ownFocus: false,
  },
});

const step1Config = (props: StepProps) => ({
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 1: The initial flyout</h2>
    </EuiTitle>
  ),
  renderBody: (managedFlyoutApi: UseManagedFlyoutApi) => {
    const { nextFlyout, openChildFlyout } = managedFlyoutApi;
    const handleGoToStep2 = () => {
      nextFlyout(step2Config(props));
    };

    const handleOpenChild = () => {
      openChildFlyout(childFlyoutConfig(props));
    };

    return (
      <EuiText>
        <p>This is the first step in the flyout sequence.</p>
        <DataList {...props} />
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem>
            <span>
              <EuiButton onClick={handleGoToStep2}>Go to Step 2</EuiButton>
            </span>
          </EuiFlexItem>
          <EuiFlexItem>
            <span>
              <EuiButton onClick={handleOpenChild}>Open Child Flyout</EuiButton>
            </span>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiText>
    );
  },
  flyoutProps: {
    ownFocus: false,
    size: 'm',
    type: 'push' as const,
  },
});

const step2Config = (props: StepProps) => ({
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 2: The second flyout</h2>
    </EuiTitle>
  ),
  renderBody: (managedFlyoutApi: UseManagedFlyoutApi) => {
    const handleGoToStep3 = () => {
      managedFlyoutApi.nextFlyout(step3Config(props));
    };

    return (
      <EuiText>
        <p>This is the second step in the flyout sequence.</p>
        <DataList {...props} />
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem>
            <span>
              <EuiButton onClick={handleGoToStep3}>Go to Step 3</EuiButton>
            </span>
          </EuiFlexItem>
          <EuiFlexItem>
            <span>
              <EuiButton onClick={managedFlyoutApi.closeFlyout}>Close Flyout</EuiButton>
            </span>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiText>
    );
  },
  flyoutProps: {
    ownFocus: false,
    size: 'm',
    type: 'push' as const,
  },
});

const step3Config = (props: StepProps) => ({
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 3: The final flyout</h2>
    </EuiTitle>
  ),
  renderBody: () => (
    <EuiText>
      <p>This is the final step in the flyout sequence.</p>
      <DataList {...props} />
    </EuiText>
  ),
  flyoutProps: {
    ownFocus: false,
    size: 'm',
    type: 'push' as const,
  },
});

export const Demo: FC<DemoDeps> = ({ overlays }) => {
  const { openFlyout, closeFlyout, isFlyoutOpen } = overlays.useManagedFlyout();
  const [username, setUsername] = useState<string>('Guest');

  const usernameSubjectRef = useRef(new BehaviorSubject(username));

  useEffect(() => {
    usernameSubjectRef.current.next(username);
  }, [username]);

  useEffect(() => {
    const currentSubject = usernameSubjectRef.current;
    return () => {
      currentSubject.complete();
    };
  }, []);

  const handleOpenInitialFlyout = useCallback(() => {
    openFlyout(step1Config({ username$: usernameSubjectRef.current.asObservable() }));
  }, [openFlyout]);

  const handleOpenAnotherFreshFlyout = useCallback(() => {
    openFlyout({
      renderBody: () => (
        <EuiText>
          <p>This is a fresh new flyout with no header!</p>
          <DataList username$={usernameSubjectRef.current} />
        </EuiText>
      ),
      flyoutProps: {
        ownFocus: false,
        type: 'push',
      },
    });
  }, [openFlyout]);

  const handleCheckFlyoutStatus = useCallback(() => {
    alert(`The flyout is currently ${isFlyoutOpen() ? 'open' : 'closed'}. (Synchronous check)`);
  }, [isFlyoutOpen]);

  const buttonContent = [
    { label: 'Open step-by-step flyout (step 1)', href: '#', onClick: handleOpenInitialFlyout },
    { label: 'Open fresh flyout (push)', href: '#', onClick: handleOpenAnotherFreshFlyout },
    { label: 'Close flyout', href: '#', onClick: closeFlyout },
    { label: 'Check flyout status', href: '#', onClick: handleCheckFlyoutStatus },
  ];

  return (
    <EuiText>
      <h1>Demo</h1>
      <EuiPanel>
        <EuiForm>
          <label htmlFor="username-input" css={{ marginRight: '10px' }}>
            Your Name:
          </label>
          <input
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
        </EuiForm>
      </EuiPanel>

      <EuiSpacer />

      <EuiPanel>
        <EuiListGroup listItems={buttonContent} color="primary" />
      </EuiPanel>
    </EuiText>
  );
};

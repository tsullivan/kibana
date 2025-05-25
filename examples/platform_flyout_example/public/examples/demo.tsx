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

const renderStep1Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { nextFlyout, openChildFlyout } = managedFlyoutApi;

  const handleGoToStep2 = () => {
    nextFlyout({
      renderBody: renderStep2Content(props),
      flyoutProps: { ownFocus: false, size: 'm' },
    });
  };

  const handleOpenChild = () => {
    openChildFlyout({
      renderBody: renderChildContent(props),
      flyoutProps: { ownFocus: false, size: 's' },
    });
  };

  return (
    <EuiText>
      <h3>Step 1: Initial Content</h3>
      <p>This is the first piece of content in the flyout.</p>
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
};

const renderStep2Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { nextFlyout, openChildFlyout } = managedFlyoutApi;

  const handleGoToStep3 = () => {
    nextFlyout({
      renderBody: renderStep3Content(props),
      flyoutProps: { ownFocus: false, size: 'l' },
    });
  };

  const handleOpenChild = () => {
    openChildFlyout({
      renderBody: renderChildContent(props),
      flyoutProps: { ownFocus: false, size: 's' },
    });
  };

  return (
    <EuiText>
      <h3>Step 2: Next Content</h3>
      <p>You navigated from Step 1.</p>
      <DataList {...props} />
      <EuiFlexGroup justifyContent="spaceBetween">
        <EuiFlexItem>
          <span>
            <EuiButton onClick={handleGoToStep3}>Go to Step 3</EuiButton>
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
};

const renderStep3Content = (props: StepProps) => (managedFlyoutApi: UseManagedFlyoutApi) => {
  const { openChildFlyout } = managedFlyoutApi;

  const handleOpenChild = () => {
    openChildFlyout({
      renderBody: renderChildContent(props),
      flyoutProps: { ownFocus: false, size: 's' },
    });
  };

  return (
    <EuiText>
      <h3>Step 3: Final Content</h3>
      <p>This is the last step in this sequence.</p>
      <p>Use the &quot;Back&quot; button to return.</p>
      <DataList {...props} />
      <EuiFlexGroup>
        <EuiFlexItem>
          <span>
            <EuiButton onClick={handleOpenChild}>Open Child Flyout</EuiButton>
          </span>
        </EuiFlexItem>
      </EuiFlexGroup>
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
      <EuiButton onClick={handleCloseChild}>Close Child Flyout</EuiButton>
    </EuiText>
  );
};

const renderAnotherFlyoutContent = (props: StepProps) => () => {
  const FlyoutContent: React.FC = () => {
    return (
      <EuiText>
        <h3>New</h3>
        <p>This is a fresh new flyout.</p>
        <DataList {...props} />
      </EuiText>
    );
  };

  return <FlyoutContent />;
};

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
    openFlyout({
      renderBody: renderStep1Content({ username$: usernameSubjectRef.current }),
      flyoutProps: { ownFocus: false, size: 's' },
    });
  }, [openFlyout]);

  const handleOpenAnotherFreshFlyout = useCallback(() => {
    openFlyout({
      renderBody: renderAnotherFlyoutContent({ username$: usernameSubjectRef.current }),
      flyoutProps: { ownFocus: false, type: 'push' },
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

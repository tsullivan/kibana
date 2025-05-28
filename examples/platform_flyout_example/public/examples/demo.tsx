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
  EuiFieldText,
  EuiFormRow,
  EuiListGroup,
  EuiPanel,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import { ManagedFlyoutEntry, OverlayStart, UseManagedFlyoutApi } from '@kbn/core-overlays-browser';
import React, {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
} from 'react';
import useObservable from 'react-use/lib/useObservable';
import { BehaviorSubject, Observable } from 'rxjs';

interface DemoDeps {
  overlays: OverlayStart;
}

// Non-reactive props for the flyout steps
interface StepProps {
  username: string;
  isPushMode: boolean;
}

const childFlyoutConfig = ({ isPushMode }: StepProps): ManagedFlyoutEntry => ({
  renderBody: () => {
    return (
      <EuiText>
        <h4>Child Flyout Content!</h4>
        <p>This panel is aligned to the left of the main flyout.</p>
      </EuiText>
    );
  },
  flyoutProps: () => ({
    type: isPushMode ? 'push' : 'overlay',
    size: 300,
  }),
});

const step1Config = (props: StepProps): ManagedFlyoutEntry => ({
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 1: The initial flyout</h2>
    </EuiTitle>
  ),
  renderBody: (managedFlyoutApi: UseManagedFlyoutApi) => {
    const { nextFlyout } = managedFlyoutApi;
    const handleGoToStep2 = () => {
      nextFlyout(step2Config(props));
    };

    return (
      <EuiText>
        <p>This is the first step in the flyout sequence.</p>
        <p>
          <EuiButton onClick={handleGoToStep2}>Go to Step 2</EuiButton>
        </p>
      </EuiText>
    );
  },
  flyoutProps: () => ({
    size: 400,
    type: props.isPushMode ? 'push' : 'overlay',
  }),
  footerActions: (managedFlyoutApi: UseManagedFlyoutApi) => ({
    openChildFlyout: (
      <EuiButton
        key="openChildFlyout"
        onClick={() => managedFlyoutApi.openChildFlyout(childFlyoutConfig(props))}
        color="primary"
      >
        Open Child Flyout
      </EuiButton>
    ),
  }),
});

const step2Config = (props: StepProps): ManagedFlyoutEntry => ({
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 2: The second flyout</h2>
    </EuiTitle>
  ),
  renderBody: () => {
    return (
      <EuiText>
        <p>This is the second step in the flyout sequence.</p>
      </EuiText>
    );
  },
  flyoutProps: () => ({
    size: 600,
    type: props.isPushMode ? 'push' : 'overlay',
  }),
  footerActions: (managedFlyoutApi: UseManagedFlyoutApi) => ({
    goBack: (
      <EuiButton
        key="goBack"
        onClick={managedFlyoutApi.goBack}
        color="text"
        fill
        data-test-subj="flyoutGoBackButton"
      >
        Go Back
      </EuiButton>
    ),
    openChildFlyout: (
      <EuiButton
        key="openChildFlyout"
        onClick={() => managedFlyoutApi.openChildFlyout(childFlyoutConfig(props))}
        color="primary"
      >
        Open Child Flyout
      </EuiButton>
    ),
  }),
});

interface DemoFlyoutContextProps {
  children: React.ReactNode;
  username$: Observable<string>;
  isPushMode$: Observable<boolean>;
}
interface DemoFlyoutContextValue {
  children: React.ReactNode;
  username: string;
  isPushMode: boolean;
}

const DemoFlyoutContext = createContext<DemoFlyoutContextValue | null>(null);

const DemoFlyoutProvider: FC<DemoFlyoutContextProps> = ({ children, username$, isPushMode$ }) => {
  const username = useObservable(username$, 'Guest');
  const isPushMode = useObservable(isPushMode$, true);
  return (
    <DemoFlyoutContext.Provider value={{ children, username, isPushMode }}>
      {children}
    </DemoFlyoutContext.Provider>
  );
};

const useDemoFlyoutContext = (): DemoFlyoutContextValue => {
  const context = useContext(DemoFlyoutContext);
  if (!context) {
    throw new Error('useDemoFlyoutContext must be used within a DemoFlyoutProvider');
  }
  return context;
};

const DataList: FC<{}> = () => {
  const { username, isPushMode } = useDemoFlyoutContext();
  return (
    <ul>
      <li>Username: {username}</li>
      <li>Push Mode: {isPushMode ? 'Enabled' : 'Disabled'}</li>
    </ul>
  );
};

export const Demo: FC<DemoDeps> = ({ overlays }) => {
  const { openFlyout, closeFlyout, isFlyoutOpen } = overlays.useManagedFlyout();
  const [username, setUsername] = useState<string>('Guest');
  const [isPushMode, setIsPushMode] = useState<boolean>(true);

  const usernameSubjectRef = useRef(new BehaviorSubject(username));
  const isPushSubjectRef = useRef(new BehaviorSubject(isPushMode));

  useEffect(() => {
    usernameSubjectRef.current.next(username);
  }, [username]);

  useEffect(() => {
    isPushSubjectRef.current.next(isPushMode);
  }, [isPushMode]);

  useEffect(() => {
    const currentSubject = usernameSubjectRef.current;
    const currentPushSubject = isPushSubjectRef.current;
    return () => {
      currentSubject.complete();
      currentPushSubject.complete();
    };
  }, []);

  const handleOpenInitialFlyout = useCallback(() => {
    openFlyout(step1Config({ username, isPushMode }));
  }, [openFlyout, username, isPushMode]);

  // Renders with a context provider, needs to set values from closure scope
  const handleOpenReactiveDemoFlyout = useCallback(() => {
    openFlyout({
      renderBody: () => (
        <DemoFlyoutProvider
          username$={usernameSubjectRef.current.asObservable()}
          isPushMode$={isPushSubjectRef.current.asObservable()}
        >
          <EuiText>
            <p>This is a fresh new flyout with no header!</p>
            <DataList />
          </EuiText>
        </DemoFlyoutProvider>
      ),
      flyoutProps: () => ({
        type: isPushMode ? 'push' : 'overlay',
        size: 800,
      }),
      footerActions: (managedFlyoutApi: UseManagedFlyoutApi) => ({
        openChildFlyout: (
          <EuiButton
            key="openChildFlyout"
            onClick={() =>
              managedFlyoutApi.openChildFlyout(childFlyoutConfig({ username, isPushMode }))
            }
            color="primary"
          >
            Open Child Flyout
          </EuiButton>
        ),
      }),
    });
  }, [openFlyout, username, isPushMode]);

  const handleCheckFlyoutStatus = useCallback(() => {
    alert(`The flyout is currently ${isFlyoutOpen() ? 'open' : 'closed'}. (Synchronous check)`);
  }, [isFlyoutOpen]);

  const buttonContent = [
    {
      label: 'Open step-by-step flyout with header',
      href: '#',
      onClick: handleOpenInitialFlyout,
    },
    {
      label: 'Open flyout with reactive state (no header)',
      href: '#',
      onClick: handleOpenReactiveDemoFlyout,
    },
    {
      label: 'Close flyout',
      href: '#',
      onClick: closeFlyout,
    },
    {
      label: 'Check flyout status (sync)',
      href: '#',
      onClick: handleCheckFlyoutStatus,
    },
  ];

  return (
    <EuiText>
      <h1>Demo</h1>
      <EuiPanel>
        <EuiFormRow label="Username">
          <EuiFieldText
            id="username-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your name"
          />
        </EuiFormRow>

        <EuiFormRow>
          <EuiSwitch
            label="Enable push mode"
            checked={isPushMode}
            onChange={(e) => setIsPushMode(e.target.checked)}
          />
        </EuiFormRow>
      </EuiPanel>

      <EuiSpacer />

      <EuiPanel>
        <EuiListGroup listItems={buttonContent} color="primary" />
      </EuiPanel>
    </EuiText>
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useMemo, type FC } from 'react';

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
import type { ManagedFlyoutEntry, OverlayStart } from '@kbn/core-overlays-browser';
import {
  initializeStateManager,
  useStateFromPublishingSubject,
} from '@kbn/presentation-publishing';
import type { StateManager } from '@kbn/presentation-publishing-types';

interface DemoDeps {
  overlays: OverlayStart;
}

interface StateType {
  username: string;
  isPushMode: boolean;
}

interface StepProps {
  stateManager: StateManager<StateType>;
}

const DataList: FC<StepProps> = ({ stateManager }) => {
  const { username$, isPushMode$ } = stateManager.api;
  const username = useStateFromPublishingSubject(username$);
  const isPushMode = useStateFromPublishingSubject(isPushMode$);

  return (
    <EuiListGroup
      listItems={[
        { label: `Username: ${username}`, size: 's' },
        { label: `Push Mode: ${isPushMode ? 'Enabled' : 'Disabled'}`, size: 's' },
      ]}
      color="subdued"
      flush={true}
    />
  );
};

const childFlyoutConfig: ManagedFlyoutEntry<StateType> = {
  renderBody: ({ getStateManager }) => {
    return (
      <EuiText>
        <h4>Child Flyout Content!</h4>
        <p>This panel is aligned to the left of the main flyout.</p>
        <DataList stateManager={getStateManager()} />
      </EuiText>
    );
  },
};

const step1Config: ManagedFlyoutEntry<StateType> = {
  flyoutProps: ({ getStateManager }) => ({
    size: 400,
    type: getStateManager().getLatestState().isPushMode ? 'push' : 'overlay',
  }),
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 1: The initial flyout</h2>
    </EuiTitle>
  ),
  renderBody: ({ nextFlyout, getStateManager }) => {
    const handleGoToStep2 = () => {
      nextFlyout(step2Config);
    };

    return (
      <EuiText>
        <p>This is the first step in the flyout sequence.</p>
        <DataList stateManager={getStateManager()} />
        <p>
          <EuiButton onClick={handleGoToStep2}>Go to Step 2</EuiButton>
        </p>
      </EuiText>
    );
  },
  footerActions: ({ openChildFlyout }) => ({
    openChildFlyout: (
      <EuiButton
        key="openChildFlyout"
        onClick={() => openChildFlyout(childFlyoutConfig)}
        color="primary"
      >
        Open Child Flyout
      </EuiButton>
    ),
  }),
};

const step2Config: ManagedFlyoutEntry<StateType> = {
  flyoutProps: ({ getStateManager }) => ({
    size: 600,
    type: getStateManager().getLatestState().isPushMode ? 'push' : 'overlay',
  }),
  renderHeader: () => (
    <EuiTitle size="m">
      <h2>Step 2: The second flyout</h2>
    </EuiTitle>
  ),
  renderBody: ({ getStateManager }) => {
    return (
      <EuiText>
        <p>This is the second step in the flyout sequence.</p>
        <DataList stateManager={getStateManager()} />
      </EuiText>
    );
  },
  footerActions: ({ goBack, openChildFlyout }) => ({
    goBack: (
      <EuiButton
        key="goBack"
        onClick={goBack}
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
        onClick={() => openChildFlyout(childFlyoutConfig)}
        color="primary"
      >
        Open Child Flyout
      </EuiButton>
    ),
  }),
};

const complexFlyoutConfig: ManagedFlyoutEntry<StateType> = {
  flyoutProps: ({ getStateManager }) => ({
    type: getStateManager().getLatestState().isPushMode ? 'push' : 'overlay',
    size: 800,
  }),
  renderBody: () => {
    const ComplexComponent: FC = () => {
      return (
        <EuiText>
          <h4>Complex Flyout Content!</h4>
          <p>This flyout has no header and is more complex.</p>
        </EuiText>
      );
    };

    return <ComplexComponent />;
  },
  footerActions: ({ openChildFlyout }) => ({
    openChildFlyout: (
      <EuiButton
        key="openChildFlyout"
        onClick={() => openChildFlyout(childFlyoutConfig)}
        color="primary"
      >
        Open Child Flyout
      </EuiButton>
    ),
  }),
};

export const Demo: FC<DemoDeps> = ({ overlays }) => {
  const { openFlyout, closeFlyout, isFlyoutOpen } = overlays.useManagedFlyout<StateType>();

  const stateManager = useMemo(
    () =>
      initializeStateManager<StateType>(
        { username: 'Guest', isPushMode: true }, // initial state
        { username: '', isPushMode: true } // default state
      ),
    []
  );

  const { username$, isPushMode$, setUsername, setIsPushMode } = stateManager.api;
  const username = useStateFromPublishingSubject(username$);
  const isPushMode = useStateFromPublishingSubject(isPushMode$);

  const handleOpenInitialFlyout = useCallback(() => {
    openFlyout(step1Config, stateManager);
  }, [openFlyout, stateManager]);

  const handleOpenComplexFlyout = useCallback(() => {
    openFlyout(complexFlyoutConfig, stateManager);
  }, [openFlyout, stateManager]);

  const handleCheckFlyoutStatus = useCallback(() => {
    alert(`The flyout is currently ${isFlyoutOpen() ? 'open' : 'closed'}. (Synchronous check)`);
  }, [isFlyoutOpen]);

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
        <EuiListGroup
          listItems={[
            {
              label: 'Open step-by-step flyout with header',
              href: '#',
              onClick: handleOpenInitialFlyout,
            },
            {
              label: 'Open complex flyout (no header)',
              href: '#',
              onClick: handleOpenComplexFlyout,
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
          ]}
          color="primary"
          flush={true}
        />
      </EuiPanel>
    </EuiText>
  );
};

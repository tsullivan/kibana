/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  EuiButton,
  EuiCode,
  EuiDescriptionList,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import type { OverlayRef } from '@kbn/core-mount-utils-browser';
import type { OverlayStart } from '@kbn/core/public';
import { useBooleanUrlState } from '@kbn/shared-url-state';

import {
  createChildFlyoutDescriptionItems,
  createMainFlyoutDescriptionItems,
  FLYOUT_MIN_WIDTH,
  FlyoutOwnFocusSwitch,
  FlyoutTypeSwitch,
} from '../utils';

export interface FlyoutFromOverlaysProps {
  historyKey: symbol;
  overlays: OverlayStart;
}

interface SessionFlyoutProps {
  historyKey: symbol;
  title: string;
  mainSize: 's' | 'm' | 'l' | 'fill';
  mainMaxWidth?: number;
  childSize: 's' | 'm' | 'fill';
  childMaxWidth?: number;
  overlays: OverlayStart;
}

/** The child flyout's single body item; no `EuiFlyoutBody` wrapper needed. */
const ChildFlyoutContent: React.FC<Pick<SessionFlyoutProps, 'childSize' | 'childMaxWidth'>> =
  React.memo(({ childSize, childMaxWidth }) => (
    <>
      <EuiText>
        <p>
          This is a child flyout opened from the flyout that was opened using the{' '}
          <EuiCode>openFlyoutTemplate</EuiCode> method.
        </p>
      </EuiText>
      <EuiSpacer size="m" />
      <EuiDescriptionList
        type="column"
        listItems={createChildFlyoutDescriptionItems(
          childSize,
          childMaxWidth,
          <EuiCode>openFlyoutTemplate</EuiCode>
        )}
      />
    </>
  ));

interface FlyoutPropertiesProps {
  flyoutType: 'overlay' | 'push';
  flyoutOwnFocus: boolean;
  mainSize: 's' | 'm' | 'l' | 'fill';
  mainMaxWidth?: number;
}

/** The main flyout's first body section: a description list of the current widget options. */
const FlyoutProperties: React.FC<FlyoutPropertiesProps> = React.memo(
  ({ flyoutType, flyoutOwnFocus, mainSize, mainMaxWidth }) => (
    <EuiDescriptionList
      type="column"
      listItems={createMainFlyoutDescriptionItems(
        flyoutType,
        flyoutOwnFocus,
        mainSize,
        mainMaxWidth,
        <EuiCode>openFlyoutTemplate</EuiCode>
      )}
    />
  )
);

/** Filler content between the two sections, long enough to demonstrate header-collapse-on-scroll. */
const FillerContent: React.FC = () => (
  <EuiText>
    <p>
      Below is some filler content to demonstrate scrolling behavior. Scroll down to access the
      button to <strong>open the child flyout</strong>.
    </p>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
      labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
      laboris nisi ut aliquip ex ea commodo consequat.
    </p>
    <p>
      Sed vel lacus id magna laoreet aliquam. Praesent aliquam in tellus eu pellentesque. Nulla
      facilisi. Sed pulvinar, massa vitae interdum pulvinar, risus lectus porta nunc, vel efficitur
      turpis odio nec nisi. Donec nec justo eget felis facilisis fermentum. Aliquam porttitor mauris
      sit amet orci. Aenean dignissim pellentesque felis, non volutpat arcu. Morbi a enim in magna
      semper bibendum. Etiam scelerisque, nunc ac egestas consequat, odio nibh euismod nulla, eget
      auctor orci nibh vel nisi. Aliquam erat volutpat. Mauris vel neque sit amet nunc gravida
      congue sed sit amet purus. Quisque lacus quam, egestas ac tincidunt a, lacinia vel velit.
      Aenean facilisis nulla vitae urna tincidunt congue sed ut dui. Morbi malesuada nulla nec purus
      convallis consequat. Vivamus id mollis quam. Morbi ac commodo nulla.
    </p>
  </EuiText>
);

interface ChildFlyoutTriggersProps {
  historyKey: symbol;
  title: string;
  childSize: 's' | 'm' | 'fill';
  childMaxWidth?: number;
  overlays: OverlayStart;
}

/**
 * The two child-flyout trigger buttons, and everything that drives them. Owning this state
 * as a `Content` component (rather than on the main flyout's descriptor) is the point of the
 * `Content: ComponentType` slot form: this subtree re-renders on click without core
 * re-rendering the main flyout's chrome.
 */
const ChildFlyoutTriggers: React.FC<ChildFlyoutTriggersProps> = ({
  historyKey,
  title,
  childSize,
  childMaxWidth,
  overlays,
}) => {
  const [isChildFlyoutAOpen, setIsChildFlyoutAOpen] = useState<boolean>(false);
  const [isChildFlyoutBOpen, setIsChildFlyoutBOpen] = useState<boolean>(false);

  const childFlyoutRefA = useRef<OverlayRef | null>(null);
  const childFlyoutRefB = useRef<OverlayRef | null>(null);

  // Refs for manual focus management - return focus to child trigger buttons
  const childTriggerARef = useRef<HTMLButtonElement>(null);
  const childTriggerBRef = useRef<HTMLButtonElement>(null);

  const handleCloseChildFlyoutA = useCallback(() => {
    if (childFlyoutRefA.current) {
      childFlyoutRefA.current.close();
      childFlyoutRefA.current = null;
      setIsChildFlyoutAOpen(false);
    }

    // Return focus to child trigger button after closing child flyout A
    setTimeout(() => {
      childTriggerARef.current?.focus();
    }, 100);
  }, []);
  const handleCloseChildFlyoutB = useCallback(() => {
    if (childFlyoutRefB.current) {
      childFlyoutRefB.current.close();
      childFlyoutRefB.current = null;
      setIsChildFlyoutBOpen(false);
    }

    // Return focus to child trigger button after closing child flyout B
    setTimeout(() => {
      childTriggerBRef.current?.focus();
    }, 100);
  }, []);

  const openChildFlyoutA = useCallback(() => {
    childFlyoutRefA.current = overlays.openFlyoutTemplate({
      id: `childFlyout-${title}`,
      title: `Child flyout A of ${title}`,
      session: 'inherit',
      historyKey,
      size: childSize,
      hasChildBackground: true,
      maxWidth: childMaxWidth,
      minWidth: FLYOUT_MIN_WIDTH,
      header: { collapsed: true },
      onActive: () => {
        console.log('activate child flyout', title); // eslint-disable-line no-console
      },
      onClose: () => {
        console.log('close child flyout', title); // eslint-disable-line no-console
        childFlyoutRefA.current = null;
        setIsChildFlyoutAOpen(false);

        // Return focus to child trigger button after closing child flyout A
        setTimeout(() => {
          childTriggerARef.current?.focus();
        }, 100);
      },
      body: [
        {
          kind: 'content',
          Content: () => <ChildFlyoutContent childSize={childSize} childMaxWidth={childMaxWidth} />,
        },
      ],
    });
    setIsChildFlyoutAOpen(true);
  }, [historyKey, childSize, childMaxWidth, overlays, title]);

  const openChildFlyoutB = useCallback(() => {
    childFlyoutRefB.current = overlays.openFlyoutTemplate({
      id: `childFlyout-${title}-B`,
      title: `Child flyout B of ${title}`,
      session: 'inherit',
      historyKey,
      size: childSize,
      hasChildBackground: true,
      maxWidth: childMaxWidth,
      minWidth: FLYOUT_MIN_WIDTH,
      header: { collapsed: true },
      onActive: () => {
        console.log('activate child flyout B', title); // eslint-disable-line no-console
      },
      onClose: () => {
        console.log('close child flyout B', title); // eslint-disable-line no-console
        childFlyoutRefB.current = null;
        setIsChildFlyoutBOpen(false);

        // Return focus to child trigger button after closing child flyout B
        setTimeout(() => {
          childTriggerBRef.current?.focus();
        }, 100);
      },
      body: [
        {
          kind: 'content',
          Content: () => <ChildFlyoutContent childSize={childSize} childMaxWidth={childMaxWidth} />,
        },
      ],
    });
    setIsChildFlyoutBOpen(true);
  }, [historyKey, childSize, childMaxWidth, overlays, title]);

  return (
    <>
      <EuiButton
        buttonRef={childTriggerARef}
        onClick={isChildFlyoutAOpen ? handleCloseChildFlyoutA : openChildFlyoutA}
        data-test-subj={`openChildFlyoutAOverlaysButton-${title}`}
      >
        {isChildFlyoutAOpen ? 'Close child flyout A' : 'Open child flyout A'}
      </EuiButton>{' '}
      <EuiButton
        buttonRef={childTriggerBRef}
        onClick={isChildFlyoutBOpen ? handleCloseChildFlyoutB : openChildFlyoutB}
        data-test-subj={`openChildFlyoutBOverlaysButton-${title}`}
      >
        {isChildFlyoutBOpen ? 'Close child flyout B' : 'Open child flyout B'}
      </EuiButton>
    </>
  );
};

const SessionFlyout: React.FC<SessionFlyoutProps> = React.memo((props) => {
  const { title, mainSize, childSize, mainMaxWidth, childMaxWidth, overlays, historyKey } = props;

  const [flyoutType, setFlyoutType] = useState<'overlay' | 'push'>('overlay');
  const [flyoutOwnFocus, setFlyoutOwnFocus] = useState<boolean>(false);
  const [isFlyoutOpen, setIsFlyoutOpen] = useBooleanUrlState(
    `flyoutOverlays_${title.replace(/\s+/g, '')}Open`
  );
  const flyoutRef = useRef<OverlayRef | null>(null);

  // Ref for manual focus management - return focus to trigger button
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Callbacks for state synchronization
  const mainFlyoutOnActive = useCallback(() => {
    console.log('activate main flyout', title); // eslint-disable-line no-console
  }, [title]);

  const handleCloseFlyout = useCallback(() => {
    setIsFlyoutOpen(false);
  }, [setIsFlyoutOpen]);

  // Bridge URL-backed open state to the imperative overlays.openFlyoutTemplate API:
  // opening mounts the overlay, closing (via URL, Back button, or user click) unmounts it.
  useEffect(() => {
    if (isFlyoutOpen && !flyoutRef.current) {
      flyoutRef.current = overlays.openFlyoutTemplate({
        id: `mainFlyout-${title}`,
        title,
        header: {
          description: (
            <>
              Opened with <EuiCode>openFlyoutTemplate</EuiCode>
            </>
          ),
        },
        type: flyoutType,
        ownFocus: flyoutOwnFocus,
        size: mainSize,
        minWidth: FLYOUT_MIN_WIDTH,
        maxWidth: mainMaxWidth,
        resizable: true,
        onActive: mainFlyoutOnActive,
        onClose: () => {
          setIsFlyoutOpen(false);
          // flyoutRef is cleared by the effect cleanup
        },
        historyKey,
        body: [
          {
            kind: 'section',
            title: 'Flyout properties',
            items: [
              {
                kind: 'content',
                Content: () => (
                  <FlyoutProperties
                    flyoutType={flyoutType}
                    flyoutOwnFocus={flyoutOwnFocus}
                    mainSize={mainSize}
                    mainMaxWidth={mainMaxWidth}
                  />
                ),
              },
            ],
          },
          { kind: 'content', Content: FillerContent },
          {
            kind: 'section',
            title: 'Child flyouts',
            items: [
              {
                kind: 'content',
                Content: () => (
                  <ChildFlyoutTriggers
                    historyKey={historyKey}
                    title={title}
                    childSize={childSize}
                    childMaxWidth={childMaxWidth}
                    overlays={overlays}
                  />
                ),
              },
            ],
          },
        ],
        footer: {
          secondaryAction: {
            label: 'Close',
            onClick: handleCloseFlyout,
            'data-test-subj': `closeMainFlyoutOverlaysButton-${title}`,
          },
        },
      });
    } else if (!isFlyoutOpen && flyoutRef.current) {
      flyoutRef.current.close();
      flyoutRef.current = null;
      setTimeout(() => {
        triggerRef.current?.focus();
      }, 100);
    }
  }, [
    isFlyoutOpen,
    title,
    flyoutType,
    flyoutOwnFocus,
    mainSize,
    mainMaxWidth,
    childSize,
    childMaxWidth,
    overlays,
    historyKey,
    mainFlyoutOnActive,
    handleCloseFlyout,
    setIsFlyoutOpen,
  ]);

  // Unmount cleanup: prevent an orphaned overlay if the component unmounts while open.
  useEffect(() => {
    return () => {
      if (flyoutRef.current) {
        flyoutRef.current.close();
        flyoutRef.current = null;
      }
    };
  }, []);

  return (
    <>
      <EuiFlexGroup gutterSize="m" alignItems="center">
        <EuiFlexItem grow={false}>
          <EuiFlexGroup gutterSize="s">
            <EuiFlexItem grow={false}>
              {/* Switches to control flyout options. Disabled while open: the imperative
                  overlays.openFlyoutTemplate API bakes these options in at open time. */}
              <FlyoutTypeSwitch
                title={title}
                flyoutType={flyoutType}
                onChange={setFlyoutType}
                disabled={isFlyoutOpen}
              />
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              {/* Switch for ownFocus behavior */}
              <FlyoutOwnFocusSwitch
                title={title}
                flyoutOwnFocus={flyoutOwnFocus}
                onChange={setFlyoutOwnFocus}
                disabled={isFlyoutOpen || flyoutType === 'push'}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiButton
            buttonRef={triggerRef}
            onClick={() => setIsFlyoutOpen(true)}
            disabled={isFlyoutOpen}
            data-test-subj={`openMainFlyoutOverlaysButton-${title}`}
          >
            Open {title}
          </EuiButton>
        </EuiFlexItem>
      </EuiFlexGroup>
    </>
  );
});

SessionFlyout.displayName = 'SessionFlyoutFromOverlaysService';

export const FlyoutWithOverlays: React.FC<FlyoutFromOverlaysProps> = ({ overlays, historyKey }) => (
  <>
    <EuiTitle size="s">
      <h2>
        <EuiCode>core.overlays.openFlyoutTemplate</EuiCode>
      </h2>
    </EuiTitle>
    <EuiSpacer size="s" />
    <EuiPanel>
      <EuiSpacer size="s" />
      <EuiDescriptionList
        type="column"
        listItems={[
          {
            title: 'Session X: main size = s, child size = s',
            description: (
              <SessionFlyout
                historyKey={historyKey}
                title="Session X"
                mainSize="s"
                childSize="s"
                overlays={overlays}
              />
            ),
          },
          {
            title: 'Session Y: main size = m, child size = s',
            description: (
              <SessionFlyout
                historyKey={historyKey}
                title="Session Y"
                mainSize="m"
                childSize="s"
                overlays={overlays}
              />
            ),
          },
          {
            title: 'Session Z: main size = m, child size = fill',
            description: (
              <SessionFlyout
                historyKey={historyKey}
                title="Session Z"
                mainSize="m"
                childSize="fill"
                overlays={overlays}
              />
            ),
          },
        ]}
      />
    </EuiPanel>
  </>
);

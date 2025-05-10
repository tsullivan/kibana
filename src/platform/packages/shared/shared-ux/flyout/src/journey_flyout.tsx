/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  EuiButtonIcon,
  EuiFlexGroup,
  EuiFlexItem,
  euiAnimFadeIn,
  transparentize,
  useEuiTheme,
} from '@elastic/eui';
import { css } from '@emotion/react';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { v4 } from 'uuid';
import {
  getJourneyFlyoutChildStyles,
  getJourneyFlyoutParentStyles,
  getZIndex,
} from './journey_flyout.styles';
import { FlyoutApi, FlyoutEntry, FlyoutProps } from './types';

interface ActiveFlyoutEntry<StateType extends object = {}> {
  Component: FlyoutEntry<StateType>['Component'];
  width: FlyoutEntry<StateType>['width'];
  activeChildFlyoutId?: string;
}

export const JourneyFlyout = forwardRef<FlyoutApi, { childBackgroundColor?: string }>(
  ({ childBackgroundColor }, ref) => {
    const { euiTheme } = useEuiTheme();

    /**
     * FLYOUTS TODO: Widths in this system are passed as numbers. Instead it would make the API simpler if we provided size strings e.g. "s", "m", "l" etc.
     */
    const [width, setWidth] = useState(800);
    const [childWidth, setChildWidth] = useState(800);

    const activeFlyouts = useRef<{ [key: string]: ActiveFlyoutEntry<object> }>({});
    const [historyEntries, setHistoryEntries] = useState<string[]>([]);

    const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

    const flyoutRef = useRef<HTMLDivElement>(null);

    const componentAId = useMemo(() => historyEntries[0], [historyEntries]);

    const [hasChildFlyout, setHasChildFlyout] = useState(false);
    const [childId, setChildId] = useState<string>();

    const { journeyFlyoutParentStyles, journeyFlyoutChildStyles } = useMemo(
      () => ({
        journeyFlyoutParentStyles: getJourneyFlyoutParentStyles(euiTheme, width),
        journeyFlyoutChildStyles: getJourneyFlyoutChildStyles(
          euiTheme,
          hasChildFlyout ? childWidth : Math.min(childWidth, width),
          childBackgroundColor
        ),
      }),
      [euiTheme, width, hasChildFlyout, childWidth, childBackgroundColor]
    );

    useEffect(() => {
      setHasChildFlyout(Boolean(activeFlyouts.current[componentAId]?.activeChildFlyoutId));
    }, [componentAId]);

    const resetFlyoutState = useCallback(() => {
      setIsFlyoutOpen(false);
      activeFlyouts.current = {};
      setHistoryEntries([]);
    }, []);

    useImperativeHandle(ref, () => ({
      // send back an imperative method that opens the INITIAL flyout
      openFlyout: (flyoutEntry) => {
        const flyoutId = v4();
        setHistoryEntries([flyoutId]);
        setWidth(flyoutEntry.width);
        activeFlyouts.current[flyoutId] = flyoutEntry as ActiveFlyoutEntry<object>;
        setIsFlyoutOpen(true);
      },
    }));

    const openChildFlyout: FlyoutProps['openChildFlyout'] = useCallback(
      ({ Component, width: nextChildWidth }) => {
        const activeFlyout = activeFlyouts?.current[historyEntries[0]];
        if (!activeFlyout) return;

        const nextChildId = v4();
        activeFlyouts.current[nextChildId] = {
          Component,
          width: nextChildWidth,
        } as ActiveFlyoutEntry<object>;
        activeFlyout.activeChildFlyoutId = nextChildId;
        setHasChildFlyout(true);
        setChildWidth(nextChildWidth);
        setChildId(nextChildId);
      },
      [historyEntries]
    );

    const { ComponentA, CurrentChildComponent } = useMemo(() => {
      return {
        ComponentA: activeFlyouts?.current[componentAId]?.Component,
        CurrentChildComponent:
          hasChildFlyout && childId ? activeFlyouts?.current[childId]?.Component : null,
      };
    }, [componentAId, hasChildFlyout, childId]);

    if (!isFlyoutOpen) return null;

    return (
      <>
        <JourneyFlyoutFade />
        <div
          css={css`
            right: ${hasChildFlyout ? `${width}px` : '0'};
            ${journeyFlyoutChildStyles}
          `}
        >
          <div className="journey-flyout-toolbar">
            <EuiFlexGroup alignItems="center" justifyContent="flexEnd">
              <EuiFlexItem grow={false}>
                <EuiButtonIcon
                  iconType="cross"
                  onClick={() => {
                    setHasChildFlyout(false);
                  }}
                  aria-label="Close journey flyout"
                />
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
          <div
            key={childId}
            css={css`
              padding: ${euiTheme.size.s};
            `}
          >
            {CurrentChildComponent && childId && (
              <CurrentChildComponent openChildFlyout={openChildFlyout} />
            )}
          </div>
        </div>
        <div css={journeyFlyoutParentStyles}>
          <div className="journey-flyout-toolbar">
            <EuiButtonIcon
              iconType="cross"
              onClick={resetFlyoutState}
              aria-label="Close journey flyout"
            />
          </div>
          <div className="journey-flyout-content-container">
            <div ref={flyoutRef} className="journey-flyout-content" css={getZIndex(true)}>
              {ComponentA && <ComponentA openChildFlyout={openChildFlyout} />}
            </div>
            <div className="journey-flyout-shadow" />
          </div>
        </div>
      </>
    );
  }
);

export const JourneyFlyoutFade = () => {
  const { euiTheme } = useEuiTheme();
  return (
    <div
      className="journey-flyout-fade"
      css={css`
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: ${euiTheme.levels.maskBelowHeader};
        animation: ${euiAnimFadeIn} ${euiTheme.animation.fast} ease-in;
        background-color: ${transparentize(euiTheme.colors.plainDark, 0.5)};
      `}
    />
  );
};

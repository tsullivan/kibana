/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { css } from '@emotion/react';
import React, { memo, useEffect, useState, type FC } from 'react';

import type { ManagedFlyoutApi, ManagedFlyoutEntry, FlyoutState } from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

interface FlyoutContainerProps {
  managedFlyoutApi: ManagedFlyoutApi;
}

interface FlyoutPanelProps {
  entry: ManagedFlyoutEntry | null;
  positionRight: number; // Right offset in pixels
  level: 'main' | 'child';
  zIndex: number;
  showMainControls?: boolean;
  managedFlyoutApi: ManagedFlyoutApi;
}

const FlyoutPanel = memo<FlyoutPanelProps>(
  ({ entry, positionRight, level, zIndex, showMainControls, managedFlyoutApi }) => {
    const [isOpen, setIsOpen] = useState(!!entry);

    useEffect(() => {
      setIsOpen(!!entry);
    }, [entry]);

    const defaultWidth = 300;
    const panelWidth = entry?.width || defaultWidth;

    const panelStyles = css`
      position: fixed;
      top: 110px;
      right: ${positionRight}px; /* Dynamic right position */
      height: 100%;
      width: ${panelWidth}px;
      background-color: ${level === 'main'
        ? 'lightgray'
        : '#e0e0e0'}; /* Different background for child */
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.3); /* Stronger shadow for layering */
      transform: translateX(${isOpen ? '0' : `${panelWidth + 10}px`}); /* Slide in/out */
      transition: transform 0.3s ease-in-out;
      z-index: ${zIndex}; /* Layering */
      display: ${entry || isOpen ? 'block' : 'none'}; /* Keep block display during transition */
      pointer-events: ${entry || isOpen ? 'auto' : 'none'};
      visibility: ${entry || isOpen ? 'visible' : 'hidden'};
      box-sizing: border-box; /* Include padding in width */
      padding: 60px 20px 20px 20px;
      border-left: ${level === 'child' ? '1px solid #ccc' : 'none'}; /* Visual separation */
    `;

    const closeButtonStyles = css`
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
      background: none;
      border: none;
      font-size: 1.2em;
      font-weight: bold;
      color: #333;
      &:hover {
        color: #000;
      }
    `;

    const backButtonStyles = css`
      position: absolute;
      top: 10px;
      left: 10px; /* Position relative to the panel's left edge */
      padding: 8px 12px;
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      &:hover {
        background-color: #0056b3;
      }
    `;

    const canGoBack = managedFlyoutApi.canGoBack();

    return (
      <div css={panelStyles}>
        {entry && entry.Component && <entry.Component {...managedFlyoutApi} />}

        {/* Render buttons ONLY if showMainControls is true (i.e., this is the main flyout) */}
        {showMainControls && (
          <>
            <button
              onClick={() => managedFlyoutApi.goBack()}
              css={backButtonStyles}
              disabled={!canGoBack}
              style={{ display: canGoBack ? 'inline-block' : 'none' }}
            >
              Back
            </button>
            <button onClick={() => managedFlyoutApi.closeFlyout()} css={closeButtonStyles}>
              X
            </button>
          </>
        )}
      </div>
    );
  }
);

export const FlyoutContainer: FC<FlyoutContainerProps> = ({ managedFlyoutApi }) => {
  const [flyoutState, setFlyoutState] = useState<FlyoutState>({ main: null, child: null });

  // get the current flyout state from the singleton service
  const flyout$ = managedFlyoutService.getFlyout$();

  useEffect(() => {
    const subscription = flyout$.subscribe((state) => {
      setFlyoutState(state);
    });
    return () => subscription.unsubscribe();
  }, [flyout$]);

  const mainFlyoutWidth = flyoutState.main?.width || 300;
  const childPanelRight = mainFlyoutWidth;

  return (
    <>
      <FlyoutPanel
        entry={flyoutState.main}
        positionRight={0}
        level="main"
        zIndex={1000}
        showMainControls={!!flyoutState.main}
        managedFlyoutApi={managedFlyoutApi}
      />

      {flyoutState.main && (
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          level="child"
          zIndex={1001}
          managedFlyoutApi={managedFlyoutApi}
        />
      )}
    </>
  );
};

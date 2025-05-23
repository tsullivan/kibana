/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { css } from '@emotion/react';
import React, { useEffect, useState, type FC } from 'react';

import type {
  UseManagedFlyoutApi,
  ManagedFlyoutEntry,
  FlyoutState,
} from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

interface FlyoutContainerProps {
  managedFlyoutApi: UseManagedFlyoutApi;
}

const FlyoutPanel: FC<{
  entry: ManagedFlyoutEntry | null;
  // props for buttons (if this is the main flyout)
  positionRight: number; // Right offset in pixels
  type: 'main' | 'child';
  zIndex: number;
  showMainControls?: boolean;
  managedFlyoutApi: UseManagedFlyoutApi;
}> = ({ entry, positionRight, type, zIndex, showMainControls, managedFlyoutApi }) => {
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
    background-color: ${type === 'main'
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
    border-left: ${type === 'child' ? '1px solid #ccc' : 'none'}; /* Visual separation */
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
      {entry && entry.Component && <entry.Component managedFlyoutApi={managedFlyoutApi} />}

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
};

export const FlyoutContainer: FC<FlyoutContainerProps> = ({ managedFlyoutApi }) => {
  const [flyoutState, setFlyoutState] = useState<FlyoutState>({ main: null, child: null });

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
        type="main"
        zIndex={1000}
        showMainControls={!!flyoutState.main}
        managedFlyoutApi={managedFlyoutApi}
      />

      {flyoutState.main && (
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          type="child"
          zIndex={1001}
          managedFlyoutApi={managedFlyoutApi}
        />
      )}
    </>
  );
};

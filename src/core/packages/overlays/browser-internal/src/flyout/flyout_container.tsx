/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useState } from 'react';
import { css } from '@emotion/react';
import { FlyoutState, ManagedFlyoutEntry } from '@kbn/core-overlays-browser/src/flyout';
import { managedFlyoutService } from './managed_flyout_service';

// Helper component for a single flyout panel (main or child)
const FlyoutPanel: React.FC<{
  entry: ManagedFlyoutEntry | null;
  positionRight: number; // Right offset in pixels
  type: 'main' | 'child'; // To apply specific styles/classes if needed
  zIndex: number; // For layering
  // props for buttons (if this is the main flyout)
  showMainControls?: boolean;
  canGoBack?: boolean;
}> = ({ entry, positionRight, type, zIndex, showMainControls, canGoBack }) => {
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

  return (
    <div css={panelStyles}>
      {entry && entry.Component && <entry.Component />}

      {/* Render buttons ONLY if showMainControls is true (i.e., this is the main flyout) */}
      {showMainControls && (
        <>
          <button
            onClick={() => managedFlyoutService.goBack()}
            css={backButtonStyles}
            disabled={!canGoBack}
            style={{ display: canGoBack ? 'inline-block' : 'none' }}
          >
            Back
          </button>
          <button
            onClick={() => managedFlyoutService.initializeFlyout(null)}
            css={closeButtonStyles}
          >
            X
          </button>
        </>
      )}
    </div>
  );
};

export const FlyoutContainer: React.FC = () => {
  const [flyoutState, setFlyoutState] = useState<FlyoutState>({ main: null, child: null });

  const flyout$ = managedFlyoutService.getFlyout$();

  useEffect(() => {
    const subscription = flyout$.subscribe((state) => {
      setFlyoutState(state);
    });
    return () => subscription.unsubscribe();
  }, [flyout$]);

  const mainFlyoutWidth = flyoutState.main?.width || 300;
  // const childFlyoutWidth = flyoutState.child?.width || 300; // Not directly needed for positioning logic here

  const mainPanelRight = 0;
  const childPanelRight = mainFlyoutWidth;

  const canGoBack = managedFlyoutService.canGoBack();

  return (
    <>
      {/* Main Flyout Panel: Pass control props */}
      <FlyoutPanel
        entry={flyoutState.main}
        positionRight={mainPanelRight}
        type="main"
        zIndex={1000}
        showMainControls={!!flyoutState.main} // Only show controls if main flyout is active
        canGoBack={canGoBack}
      />

      {/* Child Flyout Panel: No controls here */}
      {flyoutState.main && ( // Only render child if main is conceptually open
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          type="child"
          zIndex={1001} // Child z-index should be higher than main
        />
      )}
    </>
  );
};

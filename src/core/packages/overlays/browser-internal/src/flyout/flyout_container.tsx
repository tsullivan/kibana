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
import { FlyoutState, ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

// Helper component for a single flyout panel (main or child)
const FlyoutPanel: React.FC<{
  entry: ManagedFlyoutEntry | null;
  positionRight: number; // Right offset in pixels
  type: 'main' | 'child'; // To apply specific styles/classes if needed
  zIndex: number; // For layering
  // Add controls props for passing down button handlers etc.
}> = ({ entry, positionRight, type, zIndex }) => {
  const [isOpen, setIsOpen] = useState(!!entry); // Manages its own internal transition state

  // Update isOpen state based on entry prop
  useEffect(() => {
    setIsOpen(!!entry);
  }, [entry]);

  // Use a unique ID for each panel to avoid emotion style conflicts if necessary
  const panelId = `${type}-flyout-panel-${entry?.Component?.name || 'empty'}`;

  const defaultWidth = 300;
  const panelWidth = entry?.width || defaultWidth;

  const panelStyles = css`
    position: fixed;
    top: 0;
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
    padding: 20px;
    border-left: ${type === 'child' ? '1px solid #ccc' : 'none'}; /* Visual separation */
  `;

  return (
    <div id={panelId} css={panelStyles}>
      {entry && entry.Component && <entry.Component />}
    </div>
  );
};

export const FlyoutContainer: React.FC = () => {
  const [flyoutState, setFlyoutState] = useState<FlyoutState>({ main: null, child: null });

  const flyout$ = managedFlyoutService.getFlyout$();

  useEffect(() => {
    console.log(`[FlyoutContainer] useEffect: Subscribing to flyout$ from global service.`);
    const subscription = flyout$.subscribe((state) => {
      console.log(`[FlyoutContainer] flyout$ Callback Fired! New State:`, state);
      setFlyoutState(state);
    });
    return () => {
      console.log(`[FlyoutContainer] useEffect Cleanup: Unsubscribing from flyout$.`);
      subscription.unsubscribe();
    };
  }, [flyout$]);

  // Calculate positions
  const mainFlyoutWidth = flyoutState.main?.width || 300;
  const childFlyoutWidth = flyoutState.child?.width || 300;

  const mainPanelRight = 0;
  // Child flyout is to the left of the main flyout. Its right position is main's left position.
  // Main's left = 0 (right edge) + mainWidth
  const childPanelRight = mainFlyoutWidth;

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
    z-index: 1001; /* Ensure buttons are above content */
    &:hover {
      color: #000;
    }
  `;

  const backButtonStyles = css`
    position: absolute; /* Position relative to FlyoutContainer's DOM root */
    top: 10px;
    left: 10px; /* Adjust position relative to the main flyout's left edge */
    padding: 8px 12px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    z-index: 1001;
    &:hover {
      background-color: #0056b3;
    }
  `;

  const canGoBack = managedFlyoutService.canGoBack();

  return (
    <>
      {/* Main Flyout Panel */}
      <FlyoutPanel
        entry={flyoutState.main}
        positionRight={mainPanelRight}
        type="main"
        zIndex={1000}
      />

      {/* Child Flyout Panel */}
      {/* Only render child if main is open, and child itself is requested */}
      {flyoutState.main && (
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          type="child"
          zIndex={1001}
        />
      )}

      {/* Control Buttons (overlaying all panels, usually attached to the main flyout or top-level) */}
      {/* Let's attach control buttons to the highest visible panel (main) for simplicity
          We'll position them absolutely within the target DOM element that FlyoutContainer renders into. */}

      {flyoutState.main && ( // Show controls only if main flyout is conceptually open
        <>
          <button
            onClick={() => managedFlyoutService.goBack()}
            css={backButtonStyles}
            disabled={!canGoBack}
            style={{
              display: canGoBack ? 'inline-block' : 'none',
              right: `${mainFlyoutWidth - 100}px`,
            }} // Position back button to the left of main flyout
          >
            Back
          </button>
          <button
            onClick={() => managedFlyoutService.initializeFlyout(null)}
            css={closeButtonStyles}
            style={{ right: '10px' }} // Position close button on the main flyout
          >
            X
          </button>
        </>
      )}
    </>
  );
};

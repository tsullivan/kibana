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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FlyoutProps {}

const FlyoutPanel: React.FC<{
  entry: ManagedFlyoutEntry | null;
  positionRight: number;
  type: 'main' | 'child';
  zIndex: number;
}> = ({ entry, positionRight, type, zIndex }) => {
  const [isOpen, setIsOpen] = useState(!!entry);

  useEffect(() => {
    setIsOpen(!!entry);
  }, [entry]);

  const defaultWidth = 300;
  const panelWidth = entry?.width || defaultWidth;

  const panelStyles = css`
    position: fixed;
    top: 0;
    right: ${positionRight}px;
    height: 100%;
    width: ${panelWidth}px;
    background-color: ${type === 'main' ? 'lightgray' : '#e0e0e0'};
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
    transform: translateX(${isOpen ? '0' : `${panelWidth + 10}px`});
    transition: transform 0.3s ease-in-out;
    z-index: ${zIndex};
    display: ${entry || isOpen ? 'block' : 'none'};
    pointer-events: ${entry || isOpen ? 'auto' : 'none'};
    visibility: ${entry || isOpen ? 'visible' : 'hidden'};
    box-sizing: border-box;
    padding: 20px;
    border-left: ${type === 'child' ? '1px solid #ccc' : 'none'};
  `;

  return <div css={panelStyles}>{entry && entry.Component && <entry.Component />}</div>;
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
  const childFlyoutWidth = flyoutState.child?.width || 300;

  const mainPanelRight = 0;
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
    z-index: 1001;
    &:hover {
      color: #000;
    }
  `;

  const backButtonStyles = css`
    position: absolute;
    top: 10px;
    left: 10px;
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
      <FlyoutPanel
        entry={flyoutState.main}
        positionRight={mainPanelRight}
        type="main"
        zIndex={1000}
      />

      {flyoutState.main && (
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          type="child"
          zIndex={1001}
        />
      )}

      {flyoutState.main && (
        <>
          <button
            onClick={() => managedFlyoutService.goBack()}
            css={backButtonStyles}
            disabled={!canGoBack}
            style={{
              display: canGoBack ? 'inline-block' : 'none',
              right: `${mainFlyoutWidth - 100}px`,
            }}
          >
            Back
          </button>
          <button
            onClick={() => managedFlyoutService.initializeFlyout(null)}
            css={closeButtonStyles}
            style={{ right: '10px' }}
          >
            X
          </button>
        </>
      )}
    </>
  );
};

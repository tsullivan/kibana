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
import { ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

export const FlyoutContainer: React.FC = () => {
  const [flyoutEntry, setFlyoutEntry] = useState<ManagedFlyoutEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const flyout$ = managedFlyoutService.getFlyout$();

  useEffect(() => {
    console.log(`[FlyoutContainer] useEffect: Subscribing to flyout$ from global service.`);
    const subscription = flyout$.subscribe((entry) => {
      console.log(`[FlyoutContainer] flyout$ Callback Fired! Entry:`, entry);
      setFlyoutEntry(entry);
      setIsOpen(!!entry);
    });
    return () => {
      console.log(`[FlyoutContainer] useEffect Cleanup: Unsubscribing from flyout$.`);
      subscription.unsubscribe();
    };
  }, [flyout$]);

  const flyoutStyles = css`
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: ${flyoutEntry?.width || 300}px;
    background-color: lightgray;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transform: translateX(${isOpen ? '0' : `${(flyoutEntry?.width || 300) + 10}px`});
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    display: ${flyoutEntry || isOpen ? 'block' : 'none'};
    pointer-events: ${flyoutEntry || isOpen ? 'auto' : 'none'};
    visibility: ${flyoutEntry || isOpen ? 'visible' : 'hidden'};
    padding: 20px;
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
    margin-top: 10px;
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

  const canGoBack = managedFlyoutService.canGoBack();

  return (
    <div css={flyoutStyles}>
      {/* Back button calls managedFlyoutService.goBack() */}
      <button
        onClick={() => managedFlyoutService.goBack()}
        css={backButtonStyles}
        disabled={!canGoBack}
        style={{ display: canGoBack ? 'inline-block' : 'none' }}
      >
        Back
      </button>
      {/* Close button calls initializeFlyout(null) for a full reset */}
      <button onClick={() => managedFlyoutService.initializeFlyout(null)} css={closeButtonStyles}>
        X
      </button>
      {flyoutEntry && (
        <div style={{ marginTop: '20px' }}>
          {flyoutEntry.Component && <flyoutEntry.Component />}
        </div>
      )}
    </div>
  );
};

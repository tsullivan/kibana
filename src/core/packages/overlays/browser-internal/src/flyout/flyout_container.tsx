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
import { ManagedFlyoutEntry } from '@kbn/core-overlays-browser/src/flyout';
import { managedFlyoutService } from './managed_flyout_service'; // Import the global service instance

export const FlyoutContainer: React.FC = () => {
  const [flyoutEntry, setFlyoutEntry] = useState<ManagedFlyoutEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get the subject from the globally imported service instance
  const flyoutSubject = managedFlyoutService.getFlyoutSubject();

  useEffect(() => {
    console.log(`[FlyoutContainer] useEffect: Subscribing to Subject from global service.`);
    const subscription = flyoutSubject.subscribe((entry) => {
      console.log(`[FlyoutContainer] Subject Callback Fired! Entry:`, entry);
      setFlyoutEntry(entry);
      setIsOpen(!!entry);
    });
    return () => {
      console.log(`[FlyoutContainer] useEffect Cleanup: Unsubscribing from Subject.`);
      subscription.unsubscribe();
    };
  }, [flyoutSubject]); // Dependency array includes flyoutSubject, which is stable for this pattern

  const flyoutStyles = css`
    position: fixed;
    top: 110px; /* FIXME */
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

  return (
    <div css={flyoutStyles}>
      <button onClick={() => flyoutSubject.next(null)} css={closeButtonStyles}>
        X
      </button>
      {flyoutEntry && <flyoutEntry.Component />}
    </div>
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs'; // From rxjs
import { css } from '@emotion/react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FlyoutProps {}

export interface ManagedFlyoutEntry {
  Component: React.FC<FlyoutProps>;
  width?: number;
}

interface StartProps {
  targetDomElement: HTMLElement;
}

const FlyoutContainer: React.FC<{
  flyoutSubject: Subject<ManagedFlyoutEntry | null>; // Pass the subject as a prop
}> = ({ flyoutSubject }) => {
  const [flyoutEntry, setFlyoutEntry] = useState<ManagedFlyoutEntry | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Subscribe to the subject for state updates
    const subscription = flyoutSubject.subscribe((entry) => {
      setFlyoutEntry(entry);
      setIsOpen(!!entry);
    });
    return () => subscription.unsubscribe(); // Unsubscribe on unmount
  }, [flyoutSubject]); // Re-subscribe if subject instance changes (though it won't in this pattern)

  const flyoutStyles = css`
    position: fixed;
    top: 0;
    right: 0;
    height: 100%;
    width: ${flyoutEntry?.width || 300}px;
    background-color: lightgray;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    transform: translateX(
      ${isOpen ? '0' : `${(flyoutEntry?.width || 300) + 10}px`}
    ); /* Offset for full hide */
    transition: transform 0.3s ease-in-out;
    z-index: 1000;
    display: ${flyoutEntry || isOpen ? 'block' : 'none'};
    pointer-events: ${flyoutEntry || isOpen ? 'auto' : 'none'}; /* Only auto when open/closing */
    visibility: ${flyoutEntry || isOpen
      ? 'visible'
      : 'hidden'}; /* Ensure it doesn't take space when hidden */
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

// The ManagedFlyoutService class
export class ManagedFlyoutService {
  private flyoutSubject = new Subject<ManagedFlyoutEntry | null>();
  private targetElement: HTMLElement | null = null;

  public start({ targetDomElement }: StartProps): void {
    this.targetElement = targetDomElement;
    ReactDOM.render(<FlyoutContainer flyoutSubject={this.flyoutSubject} />, this.targetElement);
  }

  // Exposed method for the hook to interact with the subject
  public getFlyoutSubject(): Subject<ManagedFlyoutEntry | null> {
    return this.flyoutSubject;
  }
}

// Export a single, globally accessible instance of the service.
export const managedFlyoutService = new ManagedFlyoutService();

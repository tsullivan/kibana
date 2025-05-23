/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { css } from '@emotion/react';
import { ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs';

interface StartDeps {
  targetDomElement: HTMLElement;
}

export class ManagedFlyoutService {
  private flyoutSubject = new Subject<ManagedFlyoutEntry | null>();
  private targetElement: HTMLElement | null = null;
  private isStarted = false;
  private instanceId = Math.random().toString(36).substring(2, 9); // For debugging instance issues

  constructor() {
    console.log(`[ManagedFlyoutService] Instance created with ID: ${this.instanceId}`);
  }

  public start({ targetDomElement }: StartDeps): void {
    if (this.isStarted) {
      console.warn(
        `[ManagedFlyoutService:${this.instanceId}] Already started. Ignoring subsequent start calls.`
      );
      return;
    }

    this.targetElement = targetDomElement;
    console.log(
      `[ManagedFlyoutService:${this.instanceId}] Starting rendering FlyoutContainer into`,
      targetDomElement
    );

    // Internal FlyoutContainer component - defined within the scope of the service
    const FlyoutContainer: React.FC<{
      flyoutSubject: Subject<ManagedFlyoutEntry | null>; // Prop now required again
      subjectInstanceId: string; // Debugging prop
    }> = ({ flyoutSubject, subjectInstanceId }) => {
      const [flyoutEntry, setFlyoutEntry] = useState<ManagedFlyoutEntry | null>(null);
      const [isOpen, setIsOpen] = useState(false);

      useEffect(() => {
        console.log(`[FlyoutContainer] useEffect: Subscribing to Subject ID: ${subjectInstanceId}`);
        const subscription = flyoutSubject.subscribe((entry) => {
          console.log(`[FlyoutContainer] Subject Callback Fired! Entry:`, entry);
          setFlyoutEntry(entry);
          setIsOpen(!!entry);
        });
        return () => {
          console.log(
            `[FlyoutContainer] useEffect Cleanup: Unsubscribing from Subject ID: ${subjectInstanceId}`
          );
          subscription.unsubscribe();
        };
      }, [flyoutSubject, subjectInstanceId]);

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
            Close the managed flyout
          </button>
          {flyoutEntry && <flyoutEntry.Component />}
        </div>
      );
    };

    // Pass the subject as a prop to FlyoutContainer
    ReactDOM.render(
      <FlyoutContainer flyoutSubject={this.flyoutSubject} subjectInstanceId={this.instanceId} />,
      this.targetElement
    );
    this.isStarted = true;
  }

  public getFlyoutSubject(): Subject<ManagedFlyoutEntry | null> {
    console.log(`[ManagedFlyoutService:${this.instanceId}] getFlyoutSubject called.`);
    return this.flyoutSubject;
  }

  /* TODO: call this from somewhere */
  public stop(): void {
    if (this.targetElement && this.isStarted) {
      console.log(
        `[ManagedFlyoutService:${this.instanceId}] Stopping service and unmounting component.`
      );
      ReactDOM.unmountComponentAtNode(this.targetElement);
      this.isStarted = false;
      this.targetElement = null;
    }
  }
}

// singleton
export const managedFlyoutService = new ManagedFlyoutService();

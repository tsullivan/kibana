/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { Subject } from 'rxjs'; // From rxjs

import { ManagedFlyoutEntry } from '@kbn/core-overlays-browser/src/flyout';
import { FlyoutContainer } from './flyout_container'; // Import the new FlyoutContainer component

interface StartProps {
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

  public start({ targetDomElement }: StartProps): void {
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
    // Render FlyoutContainer without passing the subject as a prop
    // FlyoutContainer will get the subject directly from the global managedFlyoutService instance
    ReactDOM.render(<FlyoutContainer />, this.targetElement);
    this.isStarted = true;
  }

  // This method still needs to be public so useManagedFlyout and FlyoutContainer can access the subject
  public getFlyoutSubject(): Subject<ManagedFlyoutEntry | null> {
    console.log(`[ManagedFlyoutService:${this.instanceId}] getFlyoutSubject called.`);
    return this.flyoutSubject;
  }

  // Optional: A stop method to clean up
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

// Export a single, globally accessible instance of the service.
export const managedFlyoutService = new ManagedFlyoutService();

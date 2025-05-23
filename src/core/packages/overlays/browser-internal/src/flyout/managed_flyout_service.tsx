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
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import { FlyoutContainer } from './flyout_container';

interface ManagedFlyoutServiceStartDeps {
  targetDomElement: HTMLElement;
}

export class ManagedFlyoutService {
  private flyout$ = new Subject<ManagedFlyoutEntry | null>();
  private isOpen$ = new BehaviorSubject<boolean>(false);
  private targetElement: HTMLElement | null = null;
  private isStarted = false;
  private instanceId = Math.random().toString(36).substring(2, 9); // For debugging instance issues

  constructor() {
    console.log(`[ManagedFlyoutService] Instance created with ID: ${this.instanceId}`);
    this.flyout$.subscribe((entry) => {
      this.isOpen$.next(!!entry);
    });
  }

  public start({ targetDomElement }: ManagedFlyoutServiceStartDeps): void {
    if (this.isStarted) {
      return;
    }

    this.targetElement = targetDomElement;
    ReactDOM.render(<FlyoutContainer />, this.targetElement);
    this.isStarted = true;
  }

  public getFlyout$(): Subject<ManagedFlyoutEntry | null> {
    return this.flyout$;
  }

  public getIsFlyoutOpen(): boolean {
    const isOpen = this.isOpen$.getValue();
    return isOpen;
  }

  public onFlyoutToggle(): Observable<boolean> {
    return this.isOpen$.asObservable();
  }

  // TODO: use this from somewhere
  public stop(): void {
    if (this.targetElement && this.isStarted) {
      ReactDOM.unmountComponentAtNode(this.targetElement);
      this.isStarted = false;
      this.targetElement = null;
      this.flyout$.complete();
      this.isOpen$.complete();
    }
  }
}

// Export a single instance of the service accessible from the UseManagedFlyoutApi hook
export const managedFlyoutService = new ManagedFlyoutService();

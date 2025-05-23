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
import { BehaviorSubject, Subject, Observable } from 'rxjs';

import { FlyoutState, ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import { FlyoutContainer } from './flyout_container';

interface ManagedFlyoutServiceStartDeps {
  targetDomElement: HTMLElement;
}

export class ManagedFlyoutService {
  private flyout$ = new Subject<FlyoutState>();
  private isOpen$ = new BehaviorSubject<boolean>(false);
  private targetElement: HTMLElement | null = null;
  private isStarted = false;
  private instanceId = Math.random().toString(36).substring(2, 9); // For debugging instance issues

  // State for the main flyout and its history
  private _currentMainEntry: ManagedFlyoutEntry | null = null;
  private _mainHistoryStack: ManagedFlyoutEntry[] = [];

  // State for the child flyout
  private _childFlyoutEntry: ManagedFlyoutEntry | null = null;

  constructor() {
    console.log(`[ManagedFlyoutService] Instance created with ID: ${this.instanceId}`);
    // There should never be a child flyout without a main, nevertheless isOpen$ reflects if *any* flyout is open
    this.flyout$.subscribe((state) => {
      this.isOpen$.next(!!state.main || !!state.child);
      console.log(
        `[ManagedFlyoutService:${
          this.instanceId
        }] Flyout state updated: Main=${!!state.main}, Child=${!!state.child}`
      );
    });
  }

  // --- Internal Helper Method to Emit Current Flyout State ---

  private _emitFlyoutState(): void {
    this.flyout$.next({
      main: this._currentMainEntry,
      child: this._childFlyoutEntry,
    });
  }

  // --- Public API Methods ---

  public start({ targetDomElement }: ManagedFlyoutServiceStartDeps): void {
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
    ReactDOM.render(<FlyoutContainer />, this.targetElement);
    this.isStarted = true;
  }

  public initializeFlyout(entry: ManagedFlyoutEntry | null): void {
    console.log(
      `[ManagedFlyoutService:${this.instanceId}] initializeFlyout called. Clearing history and children.`
    );
    this._mainHistoryStack = []; // Clear all history
    this._childFlyoutEntry = null; // Close any active child flyouts
    this._currentMainEntry = entry; // Set the new entry as the first one
    this._emitFlyoutState(); // Emit the new state
  }

  public navigateToFlyout(entry: ManagedFlyoutEntry): void {
    console.log(`[ManagedFlyoutService:${this.instanceId}] navigateToFlyout called.`);
    if (this._currentMainEntry) {
      this._mainHistoryStack.push(this._currentMainEntry);
      console.log(
        `[ManagedFlyoutService:${this.instanceId}] Pushed current main flyout to history. Stack length: ${this._mainHistoryStack.length}`
      );
    }
    this._childFlyoutEntry = null; // Close any active child flyouts when navigating main
    this._currentMainEntry = entry;
    this._emitFlyoutState();
  }

  public goBack(): void {
    console.log(`[ManagedFlyoutService:${this.instanceId}] goBack called.`);
    if (this.canGoBack()) {
      const prevEntry = this._mainHistoryStack.pop();
      console.log(
        `[ManagedFlyoutService:${this.instanceId}] Popped from history. Going back to:`,
        prevEntry?.Component?.name || 'null'
      );
      this._childFlyoutEntry = null; // Close any active child flyouts when going back on main
      this._currentMainEntry = prevEntry || null;
      this._emitFlyoutState();
    } else {
      console.warn(
        `[ManagedFlyoutService:${this.instanceId}] Cannot go back, main history stack is empty. Closing main flyout.`
      );
      this.initializeFlyout(null); // Close main flyout if no history left
    }
  }

  public openChildFlyout(entry: ManagedFlyoutEntry): void {
    console.log(`[ManagedFlyoutService:${this.instanceId}] openChildFlyout called.`);
    if (!this._currentMainEntry) {
      console.warn(
        `[ManagedFlyoutService:${this.instanceId}] Cannot open child flyout: main flyout is not open.`
      );
      return;
    }
    this._childFlyoutEntry = entry;
    this._emitFlyoutState();
  }

  public closeChildFlyout(): void {
    console.log(`[ManagedFlyoutService:${this.instanceId}] closeChildFlyout called.`);
    if (this._childFlyoutEntry) {
      this._childFlyoutEntry = null;
      this._emitFlyoutState();
    }
  }

  public canGoBack(): boolean {
    return this._mainHistoryStack.length > 0;
  }

  public getFlyout$(): Subject<FlyoutState> {
    console.log(`[ManagedFlyoutService:${this.instanceId}] getFlyout$ called.`);
    return this.flyout$;
  }

  public getIsFlyoutOpen(): boolean {
    const isOpen = this.isOpen$.getValue();
    console.log(
      `[ManagedFlyoutService:${this.instanceId}] getIsFlyoutOpen called. Returning: ${isOpen}`
    );
    return isOpen;
  }

  public onFlyoutToggle(): Observable<boolean> {
    console.log(
      `[ManagedFlyoutService:${this.instanceId}] onFlyoutToggle called. Returning isOpen$ as observable.`
    );
    return this.isOpen$.asObservable();
  }

  public stop(): void {
    if (this.targetElement && this.isStarted) {
      console.log(
        `[ManagedFlyoutService:${this.instanceId}] Stopping service and unmounting component.`
      );
      ReactDOM.unmountComponentAtNode(this.targetElement);
      this.isStarted = false;
      this.targetElement = null;
      this.flyout$.complete();
      this.isOpen$.complete();
      // Clear all internal states
      this._mainHistoryStack = [];
      this._currentMainEntry = null;
      this._childFlyoutEntry = null;
    }
  }
}

export const managedFlyoutService = new ManagedFlyoutService();

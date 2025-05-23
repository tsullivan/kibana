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

  // State for navigation history
  private historyStack: ManagedFlyoutEntry[] = [];
  private currentFlyoutEntry: ManagedFlyoutEntry | null = null; // What is currently displayed

  constructor() {
    console.log(`[ManagedFlyoutService] Instance created with ID: ${this.instanceId}`);
    this.flyout$.subscribe((entry) => {
      this.isOpen$.next(!!entry); // true if entry is not null, false if null
      console.log(
        `[ManagedFlyoutService:${this.instanceId}] Flyout state updated to open: ${!!entry}`
      );
    });
  }

  // --- Internal/Prefixed Methods for Flyout Navigation Management ---

  // Centralized method to update the currently displayed flyout and emit to observables
  // This is a lower-level primitive, only used by higher-level public methods.
  private _updateCurrentFlyout(entry: ManagedFlyoutEntry | null): void {
    this.currentFlyoutEntry = entry;
    this.flyout$.next(entry);
    // isOpen$ is already updated by the flyout$ subscription in the constructor
  }

  // Handles pushing current onto stack and displaying new entry
  // Intended to be called by public methods like `MapsToFlyout`
  private _pushCurrentToHistoryAndDisplay(entry: ManagedFlyoutEntry): void {
    if (this.currentFlyoutEntry) {
      this.historyStack.push(this.currentFlyoutEntry);
    }
    this._updateCurrentFlyout(entry);
  }

  // Handles popping from history and displaying the previous entry
  // Intended to be called by public methods like `goBack`
  private _popHistoryAndDisplay(): void {
    if (this.canGoBack()) {
      const prevEntry = this.historyStack.pop();
      this._updateCurrentFlyout(prevEntry || null);
    } else {
      // If we cannot go back and _popHistoryAndDisplay is called, it means we are at the root
      // of the flyout, and a "back" action should typically close it.
      this._updateCurrentFlyout(null);
    }
  }

  // --- Public API Methods ---

  public start({ targetDomElement }: ManagedFlyoutServiceStartDeps): void {
    if (this.isStarted) {
      return;
    }

    this.targetElement = targetDomElement;
    ReactDOM.render(<FlyoutContainer />, this.targetElement);
    this.isStarted = true;
  }

  public initializeFlyout(entry: ManagedFlyoutEntry | null): void {
    this.historyStack = []; // Clear all history
    this._updateCurrentFlyout(entry); // Set the new entry as the first one
  }

  public navigateToFlyout(entry: ManagedFlyoutEntry): void {
    this._pushCurrentToHistoryAndDisplay(entry);
  }

  public goBack(): void {
    this._popHistoryAndDisplay();
  }

  // Public method to check if going back is possible
  public canGoBack(): boolean {
    return this.historyStack.length > 0;
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

  public stop(): void {
    if (this.targetElement && this.isStarted) {
      ReactDOM.unmountComponentAtNode(this.targetElement);
      this.isStarted = false;
      this.targetElement = null;
      this.flyout$.complete();
      this.isOpen$.complete();
      this.historyStack = []; // Clear history on stop
      this.currentFlyoutEntry = null;
    }
  }
}

export const managedFlyoutService = new ManagedFlyoutService();

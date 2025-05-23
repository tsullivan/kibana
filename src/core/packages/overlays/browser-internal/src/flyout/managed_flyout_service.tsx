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

interface HistoryEntry {
  main: ManagedFlyoutEntry;
  child: ManagedFlyoutEntry | null;
}

export class ManagedFlyoutService {
  private flyout$ = new Subject<FlyoutState>();
  private isOpen$ = new BehaviorSubject<boolean>(false);
  private targetElement: HTMLElement | null = null;
  private isStarted = false;

  private _currentMainEntry: ManagedFlyoutEntry | null = null;
  private _mainHistoryStack: HistoryEntry[] = [];
  private _childFlyoutEntry: ManagedFlyoutEntry | null = null;

  constructor() {
    this.flyout$.subscribe((state) => {
      this.isOpen$.next(!!state.main || !!state.child);
    });
  }

  private _emitFlyoutState(): void {
    this.flyout$.next({
      main: this._currentMainEntry,
      child: this._childFlyoutEntry,
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

  public initializeFlyout(entry: ManagedFlyoutEntry | null): void {
    this._mainHistoryStack = [];
    this._childFlyoutEntry = null;
    this._currentMainEntry = entry;
    this._emitFlyoutState();
  }

  public navigateToFlyout(entry: ManagedFlyoutEntry): void {
    if (this._currentMainEntry) {
      this._mainHistoryStack.push({
        main: this._currentMainEntry,
        child: this._childFlyoutEntry,
      });
    }
    this._childFlyoutEntry = null; // New step always starts without a child flyout
    this._currentMainEntry = entry;
    this._emitFlyoutState();
  }

  public goBack(): void {
    if (this.canGoBack()) {
      // Use non-null assertion operator '!' because canGoBack() guarantees array is not empty
      const prevState = this._mainHistoryStack.pop()!;
      this._currentMainEntry = prevState.main;
      this._childFlyoutEntry = prevState.child;
      this._emitFlyoutState();
    } else {
      this.initializeFlyout(null); // Close main flyout if no history left
    }
  }

  public openChildFlyout(entry: ManagedFlyoutEntry): void {
    if (!this._currentMainEntry) {
      return;
    }
    this._childFlyoutEntry = entry;
    this._emitFlyoutState();
  }

  public closeChildFlyout(): void {
    if (this._childFlyoutEntry) {
      this._childFlyoutEntry = null;
      this._emitFlyoutState();
    }
  }

  public canGoBack(): boolean {
    return this._mainHistoryStack.length > 0;
  }

  public getFlyout$(): Subject<FlyoutState> {
    return this.flyout$;
  }

  public getIsFlyoutOpen(): boolean {
    return this.isOpen$.getValue();
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
      this._mainHistoryStack = [];
      this._currentMainEntry = null;
      this._childFlyoutEntry = null;
    }
  }
}

export const managedFlyoutService = new ManagedFlyoutService();

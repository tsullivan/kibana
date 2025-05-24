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

import type { ManagedFlyoutEntry, ManagedFlyoutApi } from '@kbn/core-overlays-browser';
import { FlyoutContainer } from './flyout_container';

interface ManagedFlyoutServiceStartDeps {
  targetDomElement: HTMLElement;
}

export interface FlyoutState {
  main: ManagedFlyoutEntry | null;
  child: ManagedFlyoutEntry | null;
}

interface HistoryEntry {
  main: ManagedFlyoutEntry;
  child: ManagedFlyoutEntry | null;
}

export class ManagedFlyoutService implements Pick<ManagedFlyoutApi, 'openFlyout'> {
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

    const managedFlyoutApi = {
      openFlyout: this.openFlyout.bind(this),
      closeFlyout: this.closeFlyout.bind(this),
      isFlyoutOpen: this.isFlyoutOpen.bind(this),
      getIsFlyoutOpen: this.getIsFlyoutOpen$.bind(this),
      nextFlyout: this.nextFlyout.bind(this),
      goBack: this.goBack.bind(this),
      canGoBack: this.canGoBack.bind(this),
      openChildFlyout: this.openChildFlyout.bind(this),
      closeChildFlyout: this.closeChildFlyout.bind(this),
    };
    ReactDOM.render(<FlyoutContainer managedFlyoutApi={managedFlyoutApi} />, this.targetElement);
    this.isStarted = true;
  }

  // --- Implementations of ManagedFlyoutApi methods ---

  public openFlyout(entry: ManagedFlyoutEntry): void {
    this.initializeFlyout(entry);
  }

  public closeFlyout(): void {
    this.initializeFlyout(null);
  }

  public isFlyoutOpen(): boolean {
    return this.getIsFlyoutOpen();
  }

  public getIsFlyoutOpen$(): Observable<boolean> {
    return this.isOpen$.asObservable();
  }

  public nextFlyout(entry: ManagedFlyoutEntry): void {
    this.navigateToFlyout(entry);
  }

  public goBack(): void {
    if (this.canGoBack()) {
      const prevState = this._mainHistoryStack.pop()!;
      this._currentMainEntry = prevState.main;
      this._childFlyoutEntry = prevState.child;
      this._emitFlyoutState();
    } else {
      this.initializeFlyout(null);
    }
  }

  public canGoBack(): boolean {
    return this._mainHistoryStack.length > 0;
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

  public getFlyout$(): Subject<FlyoutState> {
    return this.flyout$;
  }

  public getIsFlyoutOpen(): boolean {
    return this.isOpen$.getValue();
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
    this._childFlyoutEntry = null;
    this._currentMainEntry = entry;
    this._emitFlyoutState();
  }

  /**
   * TODO: use this from somewhere
   */
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

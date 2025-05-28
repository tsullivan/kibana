/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';

import type { EuiFlyoutProps, EuiFlyoutResizableProps } from '@elastic/eui';
import type { MountPoint, OverlayRef } from '@kbn/core-mount-utils-browser';

/**
 * APIs to open and manage fly-out dialogs.
 *
 * @public
 */
export interface OverlayFlyoutStart {
  /**
   * Opens a flyout panel with the given mount point inside. You can use
   * `close()` on the returned FlyoutRef to close the flyout.
   *
   * @param mount {@link MountPoint} - Mounts the children inside a flyout panel
   * @param options {@link OverlayFlyoutOpenOptions} - options for the flyout
   * @return {@link OverlayRef} A reference to the opened flyout panel.
   */
  open(mount: MountPoint, options?: OverlayFlyoutOpenOptions): OverlayRef;
}

/**
 * @public
 */
export type OverlayFlyoutOpenOptions = Omit<
  EuiFlyoutProps | EuiFlyoutResizableProps,
  'onClose' | 'onResize'
> & {
  /**
   * EuiFlyout onClose handler.
   * If provided the consumer is responsible for calling flyout.close() to close the flyout;
   */
  onClose?: (flyout: OverlayRef) => void;
  isResizable?: boolean;
};

export interface UseManagedFlyoutApi {
  openFlyout: (entry: ManagedFlyoutEntry) => void;
  closeFlyout: () => void;
  isFlyoutOpen: () => boolean;
  nextFlyout: (entry: ManagedFlyoutEntry) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  openChildFlyout: (entry: ManagedFlyoutEntry) => void;
  closeChildFlyout: () => void;
}

type FlyoutPropsExpected = Omit<EuiFlyoutProps, 'onClose' | 'hideCloseButton'>;

export interface ManagedFlyoutEntry {
  renderBody: (managedFlyoutApi: UseManagedFlyoutApi) => React.ReactElement;
  renderHeader?: (managedFlyoutApi: UseManagedFlyoutApi) => React.ReactElement;
  flyoutProps?: (managedFlyoutApi: UseManagedFlyoutApi) => FlyoutPropsExpected;
}

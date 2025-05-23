/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ManagedFlyoutEntry, UseManagedFlyoutApi } from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

export function useManagedFlyout(): UseManagedFlyoutApi {
  const openFlyout = (entry: ManagedFlyoutEntry) => {
    managedFlyoutService.initializeFlyout(entry);
  };

  const closeFlyout = () => {
    managedFlyoutService.initializeFlyout(null);
  };

  const isFlyoutOpen = (): boolean => {
    return managedFlyoutService.getIsFlyoutOpen();
  };

  const onFlyoutToggle = managedFlyoutService.onFlyoutToggle();

  const nextFlyout = (entry: ManagedFlyoutEntry) => {
    managedFlyoutService.navigateToFlyout(entry);
  };

  const goBack = () => {
    managedFlyoutService.goBack();
  };

  const canGoBack = (): boolean => {
    return managedFlyoutService.canGoBack();
  };

  const openChildFlyout = (entry: ManagedFlyoutEntry) => {
    managedFlyoutService.openChildFlyout(entry);
  };

  const closeChildFlyout = () => {
    managedFlyoutService.closeChildFlyout();
  };

  return {
    openFlyout,
    closeFlyout,
    isFlyoutOpen,
    onFlyoutToggle,
    nextFlyout,
    goBack,
    canGoBack,
    openChildFlyout,
    closeChildFlyout,
  };
}

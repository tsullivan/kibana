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
    console.log(
      `[useManagedFlyout] openFlyout called (will initialize new flyout and clear history).`
    );
    managedFlyoutService.initializeFlyout(entry);
  };

  const closeFlyout = () => {
    console.log(`[useManagedFlyout] closeFlyout called. Closing all flyouts and clearing history.`);
    managedFlyoutService.initializeFlyout(null); // Close all flyouts and clear history
  };

  const isFlyoutOpen = (): boolean => {
    return managedFlyoutService.getIsFlyoutOpen();
  };

  const onFlyoutToggle = managedFlyoutService.onFlyoutToggle();

  const nextFlyout = (entry: ManagedFlyoutEntry) => {
    console.log(`[useManagedFlyout] nextFlyout called (will navigate to next main flyout).`);
    managedFlyoutService.navigateToFlyout(entry);
  };

  const goBack = () => {
    console.log(`[useManagedFlyout] goBack called (will go back in main flyout history).`);
    managedFlyoutService.goBack();
  };

  const canGoBack = (): boolean => {
    return managedFlyoutService.canGoBack();
  };

  const openChildFlyout = (entry: ManagedFlyoutEntry) => {
    console.log(`[useManagedFlyout] openChildFlyout called.`);
    managedFlyoutService.openChildFlyout(entry);
  };

  const closeChildFlyout = () => {
    console.log(`[useManagedFlyout] closeChildFlyout called.`);
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

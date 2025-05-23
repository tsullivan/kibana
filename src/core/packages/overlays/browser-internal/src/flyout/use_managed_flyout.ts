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
  const flyout$ = managedFlyoutService.getFlyout$();

  const openFlyout = (entry: ManagedFlyoutEntry) => {
    flyout$.next(entry);
  };

  const closeFlyout = () => {
    flyout$.next(null);
  };

  const isFlyoutOpen = (): boolean => {
    return managedFlyoutService.getIsFlyoutOpen();
  };

  const onFlyoutToggle = managedFlyoutService.onFlyoutToggle();

  return {
    openFlyout,
    closeFlyout,
    isFlyoutOpen,
    onFlyoutToggle,
  };
}

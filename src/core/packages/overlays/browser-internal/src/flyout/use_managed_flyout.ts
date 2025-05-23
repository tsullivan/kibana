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
  const flyoutSubject = managedFlyoutService.getFlyoutSubject();

  const openFlyout = (entry: ManagedFlyoutEntry) => {
    flyoutSubject.next(entry);
  };

  const closeFlyout = () => {
    flyoutSubject.next(null); // Emit null to close the flyout
  };

  return {
    openFlyout,
    closeFlyout,
  };
}

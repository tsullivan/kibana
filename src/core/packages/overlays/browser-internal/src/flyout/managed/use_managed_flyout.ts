/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { useMemo } from 'react';
import { ManagedFlyoutApi } from '@kbn/core-overlays-browser';
import { managedFlyoutService } from './managed_flyout_service';

export function useManagedFlyout(): ManagedFlyoutApi {
  // Get the singleton service instance
  const service = managedFlyoutService;

  return useMemo(
    () => ({
      openFlyout: service.openFlyout.bind(service),
      closeFlyout: service.closeFlyout.bind(service),
      isFlyoutOpen: service.isFlyoutOpen.bind(service),
      getIsFlyoutOpen: service.getIsFlyoutOpen$.bind(service),
      nextFlyout: service.nextFlyout.bind(service),
      goBack: service.goBack.bind(service),
      canGoBack: service.canGoBack.bind(service),
      openChildFlyout: service.openChildFlyout.bind(service),
      closeChildFlyout: service.closeChildFlyout.bind(service),
    }),
    [service]
  );
}

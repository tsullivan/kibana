/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { useMemo } from 'react';
import useObservable from 'react-use/lib/useObservable';
import { filter } from 'rxjs';

import type { UseManagedFlyoutApi } from '@kbn/core-overlays-browser';
import type { StateManager } from '@kbn/presentation-publishing-types';

// Get the singleton service instance
import { managedFlyoutService as service } from './managed_flyout_service';

export function useManagedFlyout<StateType extends object>(): UseManagedFlyoutApi<StateType> {
  const stateManager = useObservable(
    service.getStateManager$().pipe(filter(Boolean))
  ) as StateManager<StateType> | null;

  return useMemo(
    () => ({
      openFlyout: service.openFlyout.bind(service) as any,
      closeFlyout: service.closeFlyout.bind(service) as any,
      nextFlyout: service.nextFlyout.bind(service) as any,
      openChildFlyout: service.openChildFlyout.bind(service) as any,
      isFlyoutOpen: service.isFlyoutOpen.bind(service),
      goBack: service.goBack.bind(service),
      canGoBack: service.canGoBack.bind(service),
      closeChildFlyout: service.closeChildFlyout.bind(service),
      getStateManager: () => {
        if (!stateManager) {
          throw new Error('State manager not initialized');
        }
        return stateManager;
      },
    }),
    [stateManager]
  );
}

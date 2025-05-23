/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { type FC, createContext, useContext } from 'react';
import { UseManagedFlyoutApi } from '@kbn/core-overlays-browser';

const FlyoutApiContext = createContext<UseManagedFlyoutApi | undefined>(undefined);

interface FlyoutApiProviderDeps {
  overlays: {
    useManagedFlyout: () => UseManagedFlyoutApi;
  };
}

export const FlyoutApiProvider: FC<{ children: React.ReactNode; core: FlyoutApiProviderDeps }> = ({
  children,
  core,
}) => {
  const api = core.overlays.useManagedFlyout();
  return <FlyoutApiContext.Provider value={api}>{children}</FlyoutApiContext.Provider>;
};

export const useManagedFlyout = (): UseManagedFlyoutApi => {
  const context = useContext(FlyoutApiContext);
  if (context === undefined) {
    throw new Error('useManagedFlyout must be used within FlyoutApiProvider');
  }
  return context;
};

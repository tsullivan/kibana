/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * Dynamic scroll/collapse state. In this slice the values are static defaults;
 * the header collapse behavior wires real values into this context in a
 * follow-up. The header already reads `scrollIndex` to choose its heading level.
 */
export interface FlyoutScrollState {
  /** 0 while the title is at its resting position; greater than 0 once collapsed. */
  scrollIndex: number;
  isCollapsed: boolean;
}

const DEFAULT_SCROLL_STATE: FlyoutScrollState = { scrollIndex: 0, isCollapsed: false };

const FlyoutScrollContext = createContext<FlyoutScrollState>(DEFAULT_SCROLL_STATE);

export const FlyoutScrollProvider = ({
  value,
  children,
}: {
  value: FlyoutScrollState;
  children: ReactNode;
}) => <FlyoutScrollContext.Provider value={value}>{children}</FlyoutScrollContext.Provider>;

export const useFlyoutScroll = (): FlyoutScrollState => useContext(FlyoutScrollContext);

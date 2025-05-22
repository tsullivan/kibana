/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom';

import type {
  ManagedFlyoutEntry,
  ManagedFlyoutImperativeHandle,
  UseManagedFlyoutApi,
} from '@kbn/core-overlays-browser';

interface StartProps {
  targetDomElement: HTMLElement;
}

const useManagedFlyout = (): UseManagedFlyoutApi => {
  const flyoutRef = useRef<UseManagedFlyoutApi | null>(null);

  const openFlyout = useCallback((entry: ManagedFlyoutEntry) => {
    flyoutRef.current?.openFlyout(entry);
  }, []);

  return {
    ref: flyoutRef,
    openFlyout,
  };
};

export class ManagedFlyoutService {
  public start({ targetDomElement }: StartProps) {
    const Flyout: React.FC<{}> = () => {
      const { ref } = useManagedFlyout();

      return <>Hello!!!!</>;
    };

    ReactDOM.render(<Flyout />, targetDomElement);

    // return the imperative API
    return {} as ManagedFlyoutImperativeHandle;
  }
}

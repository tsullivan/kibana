/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { useCallback, useRef, useState } from 'react';

/**
 * Tracks an element's content-box inline size via `ResizeObserver`.
 *
 * Width is `0` until the first observation lands. Callers should read that as "not measured
 * yet" rather than "zero width", so the first paint does not commit to a layout decision that
 * no measurement supports.
 */
export const useElementWidth = (): [(node: HTMLElement | null) => void, number] => {
  const [width, setWidth] = useState(0);
  const cleanupRef = useRef<(() => void) | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    ro.observe(node);
    cleanupRef.current = () => ro.disconnect();
  }, []);

  return [ref, width];
};

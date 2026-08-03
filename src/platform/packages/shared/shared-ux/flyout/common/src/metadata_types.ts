/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ReactNode } from 'react';

/**
 * A single key-value pair rendered by `MetadataPairs`. Also the descriptor produced by
 * resolving the template's `Header.Metadata` part.
 */
export interface MetadataItem {
  /** The pair's key, rendered bold ahead of the value. */
  title: ReactNode;
  /** The pair's value; accepts rich content such as links. */
  value: ReactNode;
  'data-test-subj'?: string;
}

/** Props for the standalone `MetadataPairs` component. */
export interface MetadataPairsProps {
  /**
   * The pairs to render. Unbounded, though `MAX_METADATA_ITEMS` is the designed maximum —
   * exceeding it warns in development but still renders every pair.
   */
  items: readonly MetadataItem[];
  'data-test-subj'?: string;
}

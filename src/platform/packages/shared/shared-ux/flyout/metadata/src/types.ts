/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ReactNode } from 'react';

/** A single key-value pair rendered by `MetadataPairs`. */
export interface MetadataItem {
  /** The pair's key. */
  title: ReactNode;
  /** The pair's value. */
  value: ReactNode;
  'data-test-subj'?: string;
}

export interface MetadataPairsProps {
  items: readonly MetadataItem[];
  'data-test-subj'?: string;
}

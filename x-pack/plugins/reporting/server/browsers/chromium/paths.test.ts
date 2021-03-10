/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import fs from 'fs';
import { fromRoot } from 'src/core/server/utils';
import { chromiumCommit } from './paths';

describe('Chromium download file paths', () => {
  it('commit hash matches the value in the build_chromium folder', () => {
    const buildChromiumCommit = fs.readFileSync(
      fromRoot('x-pack', 'build_chromium', '.chromium-commit'),
      'utf-8'
    );

    expect(buildChromiumCommit.startsWith(chromiumCommit)).toBe(true);
  });
});

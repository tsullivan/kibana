/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

module.exports = {
  preset: '@kbn/test',
  rootDir: '../../../../..',
  roots: ['<rootDir>/src/platform/plugins/shared/embeddable'],
  coverageDirectory: '<rootDir>/target/kibana-coverage/jest/src/platform/plugins/shared/embeddable',
  coverageReporters: ['text', 'html'],
  setupFiles: ['<rootDir>/src/platform/plugins/shared/embeddable/jest_setup.ts'],
  collectCoverageFrom: [
    '<rootDir>/src/platform/plugins/shared/embeddable/{common,public,server}/**/*.{ts,tsx}',
  ],
};

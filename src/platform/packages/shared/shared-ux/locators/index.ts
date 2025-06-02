/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

export type { LocatorPublic } from './src';
export type { LocatorClientDependencies } from './src/locator_client';
export type { ILocatorClient, KibanaLocation, LocatorData, LocatorDefinition } from './src/types';

export { LocatorClient } from './src/locator_client';

export {
  LEGACY_SHORT_URL_LOCATOR_ID,
  LegacyShortUrlLocatorDefinition,
} from './src/legacy_short_url_locator';
export {
  SHORT_URL_REDIRECT_LOCATOR_ID,
  ShortUrlRedirectLocatorDefinition,
} from './src/short_url_redirect_locator';

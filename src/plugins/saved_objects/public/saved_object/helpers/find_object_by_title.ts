/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  SavedObjectsClientContract,
  SimpleSavedObject,
  SavedObjectAttributes,
} from '@kbn/core/public';

/**
 * Returns an object matching a given title
 *
 * @param savedObjectsClient {SavedObjectsClientContract}
 * @param type {string}
 * @param title {string}
 * @returns {Promise<SimpleSavedObject|undefined>}
 */
export async function findObjectByTitle<T extends SavedObjectAttributes>(
  savedObjectsClient: SavedObjectsClientContract,
  type: string,
  title: string
): Promise<SimpleSavedObject<T> | void> {
  if (!title) {
    return;
  }

  // Elastic search will return the most relevant results first, which means exact matches should come
  // first, and so we shouldn't need to request everything. Using 10 just to be on the safe side.
  const response = await savedObjectsClient.find<T>({
    type,
    perPage: 10,
    search: `"${title}"`,
    searchFields: ['title'],
    fields: ['title'],
  });
  return response.savedObjects.find(
    (obj) => obj.get('title').toLowerCase() === title.toLowerCase()
  );
}

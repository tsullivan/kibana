/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { SavedObjectsClientWrapper } from './saved_objects_client_wrapper';
import { SavedObjectsClientContract } from '@kbn/core/server';

import { DataViewSavedObjectConflictError } from '../common';

describe('SavedObjectsClientPublicToCommon', () => {
  const soClient = { resolve: jest.fn() } as unknown as SavedObjectsClientContract;

  test('get saved object - exactMatch', async () => {
    const mockedSavedObject = {
      version: 'abc',
    };
    soClient.resolve = jest
      .fn()
      .mockResolvedValue({ outcome: 'exactMatch', saved_object: mockedSavedObject });
    const service = new SavedObjectsClientWrapper(soClient);
    const result = await service.get('1');
    expect(result).toStrictEqual(mockedSavedObject);
  });

  test('get saved object - aliasMatch', async () => {
    const mockedSavedObject = {
      version: 'def',
    };
    soClient.resolve = jest
      .fn()
      .mockResolvedValue({ outcome: 'aliasMatch', saved_object: mockedSavedObject });
    const service = new SavedObjectsClientWrapper(soClient);
    const result = await service.get('1');
    expect(result).toStrictEqual(mockedSavedObject);
  });

  test('get saved object - conflict', async () => {
    const mockedSavedObject = {
      version: 'ghi',
    };

    soClient.resolve = jest
      .fn()
      .mockResolvedValue({ outcome: 'conflict', saved_object: mockedSavedObject });
    const service = new SavedObjectsClientWrapper(soClient);

    await expect(service.get('1')).rejects.toThrow(DataViewSavedObjectConflictError);
  });
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as Rx from 'rxjs';
import { first, map, mergeMap } from 'rxjs/operators';
import { CONTENT_TYPE_CSV, CSV_JOB_TYPE } from '../../../common/constants';
import { RunTaskFn, RunTaskFnFactory } from '../../types';
import { decryptJobHeaders } from '../common';
import { generateCsv$ } from './generate_csv';
import { TaskPayloadCSV } from './types';

export const runTaskFnFactory: RunTaskFnFactory<
  RunTaskFn<TaskPayloadCSV>
> = function executeJobFactoryFn(reporting, parentLogger) {
  const config = reporting.getConfig();

  return function runTask(jobId, job, cancellationToken) {
    const elasticsearch = reporting.getElasticsearchService();
    const logger = parentLogger.clone([CSV_JOB_TYPE, 'execute-job', jobId]);

    const encryptionKey = config.get('encryptionKey');

    return Rx.of().pipe(
      mergeMap(async () => {
        const headers = await decryptJobHeaders(encryptionKey, job.headers, logger);
        const fakeRequest = reporting.getFakeRequest({ headers }, job.spaceId, logger);
        const uiSettingsClient = await reporting.getUiSettingsClient(fakeRequest, logger);

        const { callAsCurrentUser } = elasticsearch.legacy.client.asScoped(fakeRequest);
        const callEndpoint = (endpoint: string, clientParams = {}, options = {}) =>
          callAsCurrentUser(endpoint, clientParams, options);

        return await generateCsv$(
          job,
          config,
          uiSettingsClient,
          callEndpoint,
          cancellationToken,
          logger
        )
          .pipe(
            map(({ content, maxSizeReached, size, csvContainsFormulas, warnings }) => {
              // @TODO: Consolidate these one-off warnings into the warnings array (max-size reached and csv contains formulas)
              return {
                content_type: CONTENT_TYPE_CSV,
                content,
                max_size_reached: maxSizeReached,
                size,
                csv_contains_formulas: csvContainsFormulas,
                warnings,
              };
            }),
            first()
          )
          .toPromise();
      })
    );
  };
};

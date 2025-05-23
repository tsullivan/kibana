/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type moment from 'moment';

import type { estypes } from '@elastic/elasticsearch';

import { withSecuritySpan } from '../../../../../utils/with_security_span';
import { buildEventsSearchQuery, buildTimeRangeFilter } from '../../utils/build_events_query';
import type {
  SecurityRuleServices,
  SecuritySharedParams,
  SearchAfterAndBulkCreateReturnType,
} from '../../types';
import {
  addToSearchAfterReturn,
  getUnprocessedExceptionsWarnings,
  getMaxSignalsWarning,
  mergeReturns,
} from '../../utils/utils';
import type { SuppressionBucket } from './wrap_suppressed_alerts';
import { wrapSuppressedAlerts } from './wrap_suppressed_alerts';
import { buildGroupByFieldAggregation } from './build_group_by_field_aggregation';
import type { EventGroupingMultiBucketAggregationResult } from './build_group_by_field_aggregation';
import { singleSearchAfter } from '../../utils/single_search_after';
import { bulkCreateWithSuppression } from '../../utils/bulk_create_with_suppression';
import type { UnifiedQueryRuleParams } from '../../../rule_schema';
import type { BuildReasonMessage } from '../../utils/reason_formatters';
import { AlertSuppressionMissingFieldsStrategyEnum } from '../../../../../../common/api/detection_engine/model/rule_schema';
import { bulkCreateUnsuppressedAlerts } from './bulk_create_unsuppressed_alerts';
import type { ITelemetryEventsSender } from '../../../../telemetry/sender';
import { DEFAULT_SUPPRESSION_MISSING_FIELDS_STRATEGY } from '../../../../../../common/detection_engine/constants';
import { getNumberOfSuppressedAlerts } from '../../utils/get_number_of_suppressed_alerts';
import * as i18n from '../../translations';
import { bulkCreate } from '../../factories';

export interface BucketHistory {
  key: Record<string, string | number | null>;
  endDate: string;
}

export interface GroupAndBulkCreateParams {
  sharedParams: SecuritySharedParams<UnifiedQueryRuleParams>;
  services: SecurityRuleServices;
  filter: estypes.QueryDslQueryContainer;
  buildReasonMessage: BuildReasonMessage;
  bucketHistory?: BucketHistory[];
  groupByFields: string[];
  eventsTelemetry: ITelemetryEventsSender | undefined;
  isLoggedRequestsEnabled: boolean;
}

export interface GroupAndBulkCreateReturnType extends SearchAfterAndBulkCreateReturnType {
  state: {
    suppressionGroupHistory: BucketHistory[];
    isLoggedRequestsEnabled?: boolean;
  };
}

/**
 * Builds a filter that excludes documents from existing buckets.
 */
export const buildBucketHistoryFilter = ({
  bucketHistory,
  primaryTimestamp,
  secondaryTimestamp,
  from,
}: {
  bucketHistory: BucketHistory[];
  primaryTimestamp: string;
  secondaryTimestamp: string | undefined;
  from: moment.Moment;
}): estypes.QueryDslQueryContainer[] | undefined => {
  if (bucketHistory.length === 0) {
    return undefined;
  }
  return [
    {
      bool: {
        must_not: bucketHistory.map((bucket) => ({
          bool: {
            must_not: Object.entries(bucket.key)
              .filter(([_, value]) => value == null)
              .map(([field, _]) => ({
                exists: {
                  field,
                },
              })),
            filter: [
              ...Object.entries(bucket.key)
                .filter(([_, value]) => value != null)
                .map(([field, value]) => ({
                  term: {
                    [field]: value,
                  },
                })),
              buildTimeRangeFilter({
                to: bucket.endDate,
                from: from.toISOString(),
                primaryTimestamp,
                secondaryTimestamp,
              }),
            ],
          },
        })),
      },
    },
  ];
};

export const filterBucketHistory = ({
  bucketHistory,
  fromDate,
}: {
  bucketHistory: BucketHistory[];
  fromDate: Date;
}) => {
  return bucketHistory.filter((bucket) => new Date(bucket.endDate) > fromDate);
};

export const groupAndBulkCreate = async ({
  sharedParams,
  services,
  filter,
  buildReasonMessage,
  bucketHistory,
  groupByFields,
  eventsTelemetry,
  isLoggedRequestsEnabled,
}: GroupAndBulkCreateParams): Promise<GroupAndBulkCreateReturnType> => {
  return withSecuritySpan('groupAndBulkCreate', async () => {
    const tuple = sharedParams.tuple;

    const filteredBucketHistory = filterBucketHistory({
      bucketHistory: bucketHistory ?? [],
      fromDate: tuple.from.toDate(),
    });

    let toReturn: GroupAndBulkCreateReturnType = {
      success: true,
      warning: false,
      searchAfterTimes: [],
      enrichmentTimes: [],
      bulkCreateTimes: [],
      createdSignalsCount: 0,
      createdSignals: [],
      errors: [],
      warningMessages: [],
      state: {
        isLoggedRequestsEnabled,
        suppressionGroupHistory: filteredBucketHistory,
      },
    };

    const exceptionsWarning = getUnprocessedExceptionsWarnings(sharedParams.unprocessedExceptions);
    if (exceptionsWarning) {
      toReturn.warningMessages.push(exceptionsWarning);
    }

    try {
      if (groupByFields.length === 0) {
        throw new Error('groupByFields length must be greater than 0');
      }

      const bucketHistoryFilter = buildBucketHistoryFilter({
        bucketHistory: filteredBucketHistory,
        primaryTimestamp: sharedParams.primaryTimestamp,
        secondaryTimestamp: sharedParams.secondaryTimestamp,
        from: tuple.from,
      });

      // if we do not suppress alerts for docs with missing values, we will create aggregation for null missing buckets
      const suppressOnMissingFields =
        (sharedParams.completeRule.ruleParams.alertSuppression?.missingFieldsStrategy ??
          DEFAULT_SUPPRESSION_MISSING_FIELDS_STRATEGY) ===
        AlertSuppressionMissingFieldsStrategyEnum.suppress;

      const groupingAggregation = buildGroupByFieldAggregation({
        groupByFields,
        maxSignals: tuple.maxSignals,
        aggregatableTimestampField: sharedParams.aggregatableTimestampField,
        missingBucket: suppressOnMissingFields,
      });

      const searchRequest = buildEventsSearchQuery({
        aggregations: groupingAggregation,
        searchAfterSortIds: undefined,
        index: sharedParams.inputIndex,
        from: tuple.from.toISOString(),
        to: tuple.to.toISOString(),
        filter,
        size: 0,
        primaryTimestamp: sharedParams.primaryTimestamp,
        secondaryTimestamp: sharedParams.secondaryTimestamp,
        runtimeMappings: sharedParams.runtimeMappings,
        additionalFilters: bucketHistoryFilter,
      });
      const { searchResult, searchDuration, searchErrors, loggedRequests } =
        await singleSearchAfter({
          searchRequest,
          services,
          ruleExecutionLogger: sharedParams.ruleExecutionLogger,
          loggedRequestsConfig: isLoggedRequestsEnabled
            ? {
                type: 'findDocuments',
                description: i18n.FIND_EVENTS_DESCRIPTION,
              }
            : undefined,
        });

      if (isLoggedRequestsEnabled) {
        toReturn.loggedRequests = loggedRequests;
      }
      toReturn.searchAfterTimes.push(searchDuration);
      toReturn.errors.push(...searchErrors);

      const eventsByGroupResponseWithAggs =
        searchResult as EventGroupingMultiBucketAggregationResult;
      if (!eventsByGroupResponseWithAggs.aggregations) {
        throw new Error('expected to find aggregations on search result');
      }

      const buckets = eventsByGroupResponseWithAggs.aggregations.eventGroups.buckets;

      // we can create only as many unsuppressed alerts, as total number of alerts(suppressed and unsuppressed) does not exceeds maxSignals
      const maxUnsuppressedCount = tuple.maxSignals - buckets.length;
      if (suppressOnMissingFields === false && maxUnsuppressedCount > 0) {
        const unsuppressedResult = await bulkCreateUnsuppressedAlerts({
          groupByFields,
          size: maxUnsuppressedCount,
          sharedParams,
          buildReasonMessage,
          eventsTelemetry,
          filter,
          services,
        });
        toReturn = { ...toReturn, ...mergeReturns([toReturn, unsuppressedResult]) };
      }

      if (buckets.length === 0) {
        return toReturn;
      }

      if (
        buckets.length > tuple.maxSignals &&
        !toReturn.warningMessages.includes(getMaxSignalsWarning()) // If the unsuppressed result didn't already hit max signals, we add the warning here
      ) {
        toReturn.warningMessages.push(getMaxSignalsWarning());
      }

      const suppressionBuckets: SuppressionBucket[] = buckets.map((bucket) => ({
        event: bucket.topHits.hits.hits[0],
        count: bucket.doc_count,
        start: bucket.min_timestamp.value_as_string
          ? new Date(bucket.min_timestamp.value_as_string)
          : tuple.from.toDate(),
        end: bucket.max_timestamp.value_as_string
          ? new Date(bucket.max_timestamp.value_as_string)
          : tuple.to.toDate(),
        terms: Object.entries(bucket.key).map(([key, value]) => ({ field: key, value })),
      }));

      const wrappedAlerts = wrapSuppressedAlerts({
        sharedParams,
        suppressionBuckets,
        buildReasonMessage,
      });

      const suppressionDuration = sharedParams.completeRule.ruleParams.alertSuppression?.duration;

      if (suppressionDuration) {
        const suppressionWindow = `now-${suppressionDuration.value}${suppressionDuration.unit}`;
        const bulkCreateResult = await bulkCreateWithSuppression({
          sharedParams,
          wrappedDocs: wrappedAlerts,
          services,
          suppressionWindow,
          ruleType: 'query',
        });
        addToSearchAfterReturn({ current: toReturn, next: bulkCreateResult });
        sharedParams.ruleExecutionLogger.debug(
          `created ${bulkCreateResult.createdItemsCount} signals`
        );
      } else {
        const bulkCreateResult = await bulkCreate({
          services,
          sharedParams,
          wrappedAlerts,
        });
        addToSearchAfterReturn({
          current: toReturn,
          next: {
            ...bulkCreateResult,
            suppressedItemsCount: getNumberOfSuppressedAlerts(bulkCreateResult.createdItems, []),
          },
        });
        sharedParams.ruleExecutionLogger.debug(
          `created ${bulkCreateResult.createdItemsCount} signals`
        );
      }

      const newBucketHistory: BucketHistory[] = buckets.map((bucket) => {
        return {
          key: bucket.key,
          endDate: bucket.max_timestamp.value_as_string
            ? bucket.max_timestamp.value_as_string
            : tuple.to.toISOString(),
        };
      });

      toReturn.state.suppressionGroupHistory.push(...newBucketHistory);
    } catch (exc) {
      toReturn.success = false;
      toReturn.errors.push(exc.message);
    }

    return toReturn;
  });
};

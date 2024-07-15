/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import moment from 'moment';
import React, { FunctionComponent } from 'react';

import {
  EuiCallOut,
  EuiDescriptionList,
  EuiDescriptionListProps,
  EuiSpacer,
  EuiTitle,
} from '@elastic/eui';
import { VisualReportingSoftDisabledError } from '@kbn/reporting-common/errors';

import { Job, useKibana } from '@kbn/reporting-public';
import { USES_HEADLESS_JOB_TYPES } from '../../../common/constants';
import { sharedI18nTexts } from '../../shared_i18n_texts';
import { infoPanel } from './i18n_texts';

interface Props {
  info: Job;
}

const { NA, UNKNOWN, formatMilliseconds } = infoPanel;

const createDateFormatter = (format: string, tz: string) => (date: string) => {
  const m = moment.tz(date, tz);
  return m.isValid() ? m.format(format) : NA;
};

export const ReportInfoFlyoutContent: FunctionComponent<Props> = ({ info }) => {
  const {
    services: { uiSettings, docLinks },
  } = useKibana();

  const timezone =
    uiSettings.get('dateFormat:tz') === 'Browser'
      ? moment.tz.guess()
      : uiSettings.get('dateFormat:tz');

  const formatDate = createDateFormatter(uiSettings.get('dateFormat'), timezone);

  const hasStarted = info.started_at != null;
  const hasCompleted = info.completed_at != null;
  const cpuInPercentage = info.metrics?.pdf?.cpuInPercentage ?? info.metrics?.png?.cpuInPercentage;
  const memoryInMegabytes =
    info.metrics?.pdf?.memoryInMegabytes ?? info.metrics?.png?.memoryInMegabytes;
  const hasCsvRows = info.metrics?.csv?.rows != null;
  const hasPagingStrategy = info.pagingStrategy != null;
  const hasScreenshot = USES_HEADLESS_JOB_TYPES.includes(info.jobtype);
  const hasPdfPagesMetric = info.metrics?.pdf?.pages != null;

  const outputInfo = [
    { title: infoPanel.status, description: info.prettyStatus },

    Boolean(info.version) && { title: infoPanel.version, description: info.version },

    Boolean(info.spaceId) && { title: infoPanel.space, description: info.spaceId },

    {
      title: infoPanel.attempts,
      description: info.max_attempts
        ? infoPanel.xAttemptsOfY(info.attempts, info.max_attempts)
        : info.attempts,
    },

    { title: infoPanel.contentType, description: info.content_type || NA },

    { title: infoPanel.size, description: info.size?.toString() || NA },

    hasCsvRows && {
      title: infoPanel.csv.rows,
      description: info.metrics?.csv?.rows?.toString() || NA,
    },

    hasPagingStrategy && {
      title: infoPanel.csv.searchStrategy,
      description: info.pagingStrategy || NA,
    },

    hasScreenshot && {
      title: infoPanel.screenshot.height,
      description:
        info.layout?.dimensions?.height != null
          ? Math.ceil(info.layout.dimensions.height)
          : UNKNOWN,
    },

    hasScreenshot && {
      title: infoPanel.screenshot.width,
      description:
        info.layout?.dimensions?.width != null ? Math.ceil(info.layout.dimensions.width) : UNKNOWN,
    },

    hasPdfPagesMetric && {
      title: infoPanel.screenshot.pages,
      description: info.metrics?.pdf?.pages,
    },

    { title: infoPanel.jobId, description: info.id },

    {
      title: infoPanel.processedBy,
      description:
        info.kibana_name && info.kibana_id ? `${info.kibana_name} (${info.kibana_id})` : NA,
    },

    { title: infoPanel.timeout, description: info.prettyTimeout },

    cpuInPercentage != null && { title: infoPanel.cpuUsage, description: `${cpuInPercentage}%` },

    memoryInMegabytes != null && {
      title: infoPanel.ramUsage,
      description: `${memoryInMegabytes}MB`,
    },
  ].filter(Boolean) as EuiDescriptionListProps['listItems'];

  const timestampsInfo = [
    { title: infoPanel.timezone, description: info.browserTimezone || NA },
    {
      title: infoPanel.timestamps.createdAt,
      description: info.created_at ? formatDate(info.created_at) : NA,
    },
    {
      title: infoPanel.timestamps.startedAt,
      description: info.started_at ? formatDate(info.started_at) : NA,
    },
    {
      title: infoPanel.timestamps.completedAt,
      description: info.completed_at ? formatDate(info.completed_at) : NA,
    },
    hasStarted && {
      title: infoPanel.timestamps.queueTime,
      description: info.queue_time_ms ? formatMilliseconds(info.queue_time_ms) : NA,
    },
    hasCompleted && {
      title: infoPanel.timestamps.executionTime,
      description: info.execution_time_ms ? formatMilliseconds(info.execution_time_ms) : NA,
    },
  ].filter(Boolean) as EuiDescriptionListProps['listItems'];

  const warnings = info.getWarnings();
  const errored =
    /*
     * We link the user to documentation if they hit this error case. Note: this
     * should only occur on cloud.
     */
    info.error_code === VisualReportingSoftDisabledError.code
      ? sharedI18nTexts.cloud.insufficientMemoryError(
          docLinks.links.reporting.cloudMinimumRequirements
        )
      : info.getError();

  return (
    <>
      {Boolean(errored) && (
        <>
          <EuiCallOut title={infoPanel.callout.noReportGenerated} color="danger">
            {errored}
          </EuiCallOut>
          <EuiSpacer />
        </>
      )}
      {Boolean(warnings) && (
        <>
          {Boolean(errored) && <EuiSpacer size="s" />}
          <EuiCallOut title={infoPanel.callout.warnings} color="warning">
            {warnings}
          </EuiCallOut>
        </>
      )}
      <EuiTitle size="s">
        <h3>{infoPanel.sectionTitle.output}</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiDescriptionList listItems={outputInfo} type="column" align="center" compressed />

      <EuiSpacer />
      <EuiTitle size="s">
        <h3>{infoPanel.sectionTitle.timestamps}</h3>
      </EuiTitle>
      <EuiSpacer size="s" />
      <EuiDescriptionList listItems={timestampsInfo} type="column" align="center" compressed />
    </>
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { i18n } from '@kbn/i18n';

export const infoPanel = {
  NA: i18n.translate('xpack.reporting.listing.infoPanel.notApplicableLabel', {
    defaultMessage: 'N/A',
  }),

  UNKNOWN: i18n.translate('xpack.reporting.listing.infoPanel.unknownLabel', {
    defaultMessage: 'unknown',
  }),
  status: i18n.translate('xpack.reporting.listing.infoPanel.statusInfo', {
    defaultMessage: 'Status',
  }),
  formatMilliseconds: (millis: number) =>
    i18n.translate('xpack.reporting.listing.infoPanel.msToSeconds', {
      defaultMessage: '{seconds} seconds',
      values: { seconds: (millis / 1000).toFixed(3) },
    }),
  version: i18n.translate('xpack.reporting.listing.infoPanel.kibanaVersion', {
    defaultMessage: 'Kibana version',
  }),
  space: i18n.translate('xpack.reporting.listing.infoPanel.space', {
    defaultMessage: 'Kibana space',
  }),
  attempts: i18n.translate('xpack.reporting.listing.infoPanel.attemptsInfo', {
    defaultMessage: 'Attempts',
  }),
  xAttemptsOfY: (attempts: number, maxAttempts: number) =>
    i18n.translate('xpack.reporting.listing.infoPanel.attempts', {
      defaultMessage: '{attempts} of {maxAttempts}',
      values: { attempts, maxAttempts },
    }),
  contentType: i18n.translate('xpack.reporting.listing.infoPanel.contentTypeInfo', {
    defaultMessage: 'Content type',
  }),
  size: i18n.translate('xpack.reporting.listing.infoPanel.sizeInfo', {
    defaultMessage: 'Size in bytes',
  }),
  csv: {
    rows: i18n.translate('xpack.reporting.listing.infoPanel.csvRows', {
      defaultMessage: 'CSV rows',
    }),
    searchStrategy: i18n.translate('xpack.reporting.listing.infoPanel.csvSearchStrategy', {
      defaultMessage: 'Search strategy',
    }),
  },
  screenshot: {
    height: i18n.translate('xpack.reporting.listing.infoPanel.dimensionsInfoHeight', {
      defaultMessage: 'Height in pixels',
    }),
    width: i18n.translate('xpack.reporting.listing.infoPanel.dimensionsInfoWidth', {
      defaultMessage: 'Width in pixels',
    }),
    pages: i18n.translate('xpack.reporting.listing.infoPanel.pdfPagesInfo', {
      defaultMessage: 'Pages count',
    }),
  },
  jobId: i18n.translate('xpack.reporting.listing.infoPanel.jobId', {
    defaultMessage: 'Report job ID',
  }),
  processedBy: i18n.translate('xpack.reporting.listing.infoPanel.processedByInfo', {
    defaultMessage: 'Processed by',
  }),
  timeout: i18n.translate('xpack.reporting.listing.infoPanel.timeoutInfo', {
    defaultMessage: 'Timeout',
  }),
  cpuUsage: i18n.translate('xpack.reporting.listing.infoPanel.cpuInfo', {
    defaultMessage: 'CPU usage',
  }),
  ramUsage: i18n.translate('xpack.reporting.listing.infoPanel.memoryInfo', {
    defaultMessage: 'RAM usage',
  }),
  timezone: i18n.translate('xpack.reporting.listing.infoPanel.tzInfo', {
    defaultMessage: 'Time zone',
  }),
  timestamps: {
    createdAt: i18n.translate('xpack.reporting.listing.infoPanel.createdAtInfo', {
      defaultMessage: 'Created at',
    }),
    startedAt: i18n.translate('xpack.reporting.listing.infoPanel.startedAtInfo', {
      defaultMessage: 'Started at',
    }),
    completedAt: i18n.translate('xpack.reporting.listing.infoPanel.completedAtInfo', {
      defaultMessage: 'Completed at',
    }),
    queueTime: i18n.translate('xpack.reporting.listing.infoPanel.queueTime', {
      defaultMessage: 'Queue time',
    }),
    executionTime: i18n.translate('xpack.reporting.listing.infoPanel.executionTime', {
      defaultMessage: 'Execution time',
    }),
  },
  callout: {
    noReportGenerated: i18n.translate(
      'xpack.reporting.listing.infoPanel.callout.failedReportTitle',
      {
        defaultMessage: 'No report generated',
      }
    ),
    warnings: i18n.translate('xpack.reporting.listing.infoPanel.callout.warningsTitle', {
      defaultMessage: 'Report contains warnings',
    }),
  },
  sectionTitle: {
    output: i18n.translate('xpack.reporting.listing.infoPanel.outputSectionTitle', {
      defaultMessage: 'Output',
    }),
    timestamps: i18n.translate('xpack.reporting.listing.infoPanel.timestampSectionTitle', {
      defaultMessage: 'Timestamps',
    }),
  },
};

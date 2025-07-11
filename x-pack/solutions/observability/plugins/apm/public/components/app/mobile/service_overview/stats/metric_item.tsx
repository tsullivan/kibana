/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import type { MetricDatum } from '@elastic/charts';
import { Chart, Metric, Settings } from '@elastic/charts';
import { useElasticChartsTheme } from '@kbn/charts-theme';
import { EuiSkeletonText, EuiPanel } from '@elastic/eui';
import { isEmpty } from 'lodash';
import { KibanaErrorBoundary } from '@kbn/shared-ux-error-boundary';

export function MetricItem({
  data,
  id,
  isLoading,
  height = '124px',
}: {
  data: MetricDatum[];
  id: number;
  isLoading: boolean;
  height?: string;
}) {
  const chartBaseTheme = useElasticChartsTheme();
  const hasData = !isEmpty(data);
  return (
    <div
      style={{
        resize: 'none',
        padding: '0px',
        overflow: 'auto',
        height,
        borderRadius: '6px',
      }}
    >
      {!hasData && isLoading ? (
        <EuiPanel hasBorder={true}>
          <EuiSkeletonText lines={3} />
        </EuiPanel>
      ) : (
        <KibanaErrorBoundary>
          <Chart>
            <Settings baseTheme={chartBaseTheme} />
            <Metric id={`metric_${id}`} data={[data]} />
          </Chart>
        </KibanaErrorBoundary>
      )}
    </div>
  );
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { DataViewField } from '@kbn/data-views-plugin/common';
import {
  BaseColumn,
  Operation,
  DataType,
  GenericColumnWithMeta,
  FormatParams,
} from '@kbn/visualizations-plugin/common/convert_to_lens';
import { v4 as uuidv4 } from 'uuid';
import {
  getDurationParams,
  inputFormats,
  isDuration,
  outputFormats,
} from '../../../application/components/lib/durations';
import type { Metric, Series } from '../../../../common/types';
import { DATA_FORMATTERS } from '../../../../common/enums';
import { getTimeScale } from '../metrics';
import { ColumnWithMeta, Meta, Column } from './types';

type GeneralColumn = Omit<BaseColumn<Operation, unknown>, 'operationType' | 'params'>;
type GeneralColumnWithMeta = GenericColumnWithMeta<GeneralColumn, Meta>;
interface ExtraColumnFields {
  isBucketed?: boolean;
  isSplit?: boolean;
  reducedTimeRange?: string;
  timeShift?: string;
  isAssignTimeScale?: boolean;
}

const isSupportedFormat = (format: string) =>
  ['bytes', 'number', 'percent'].includes(format) || isDuration(format);

export const getFormat = (series: Pick<Series, 'formatter' | 'value_template'>): FormatParams => {
  let suffix;

  if (!series.formatter || series.formatter === 'default') {
    return {};
  }

  if (series.value_template) {
    suffix = series.value_template.split('}}')[1];
  }

  // not supported formatters should be converted to number
  if (!isSupportedFormat(series.formatter)) {
    return {
      format: { id: DATA_FORMATTERS.NUMBER, ...(suffix && { params: { suffix, decimals: 2 } }) },
    };
  }

  if (isDuration(series.formatter)) {
    const { from, to, decimals } = getDurationParams(series.formatter);
    return {
      format: {
        id: DATA_FORMATTERS.DURATION,
        params: {
          fromUnit: inputFormats[from] || from,
          toUnit: outputFormats[to] || to,
          decimals: decimals ? parseInt(decimals, 10) : 2,
          suffix,
        },
      },
    };
  }

  return { format: { id: series.formatter, ...(suffix && { params: { suffix, decimals: 2 } }) } };
};

export const createColumn = (
  series: Series,
  metric: Metric,
  field?: DataViewField,
  {
    isBucketed = false,
    isSplit = false,
    reducedTimeRange,
    timeShift,
    isAssignTimeScale = true,
  }: ExtraColumnFields = {}
): GeneralColumnWithMeta => ({
  columnId: uuidv4(),
  dataType: (field?.type as DataType) ?? undefined,
  label: series.label,
  isBucketed,
  isSplit,
  reducedTimeRange,
  filter: series.filter,
  timeShift,
  timeScale: isAssignTimeScale ? getTimeScale(metric) : undefined,
  meta: { metricId: metric.id },
});

export const isColumnWithMeta = (column: Column): column is ColumnWithMeta => {
  if ((column as ColumnWithMeta).meta) {
    return true;
  }
  return false;
};

export const excludeMetaFromColumn = (column: Column) => {
  if (isColumnWithMeta(column)) {
    const { meta, ...rest } = column;
    return rest;
  }
  return column;
};

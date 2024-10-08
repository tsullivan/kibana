/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { Observable } from 'rxjs';
import { IUiSettingsClient } from '@kbn/core/public';
import type { DataView } from '@kbn/data-views-plugin/public';
import type { TimeseriesVisData } from '../../../../common/types';
import { TimeseriesVisParams } from '../../../types';
import { VisFields } from '../../lib/fetch_fields';

export interface PanelConfigProps {
  fields: VisFields;
  model: TimeseriesVisParams;
  visData$: Observable<TimeseriesVisData | undefined>;
  getConfig: IUiSettingsClient['get'];
  onChange: (partialModel: Partial<TimeseriesVisParams>) => void;
  defaultIndexPattern?: DataView;
}

export enum PANEL_CONFIG_TABS {
  DATA = 'data',
  OPTIONS = 'options',
  ANNOTATIONS = 'annotations',
  MARKDOWN = 'markdown',
}

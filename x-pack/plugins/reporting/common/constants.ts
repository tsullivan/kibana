/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PDF_JOB_TYPE_V2 } from '@kbn/reporting-export-types-pdf-common';
import { PNG_JOB_TYPE_V2 } from '@kbn/reporting-export-types-png-common';

export const USES_HEADLESS_JOB_TYPES = [PDF_JOB_TYPE_V2, PNG_JOB_TYPE_V2];

export const DEPRECATED_JOB_TYPES = [
  'csv', // Replaced with csv_searchsource / csv_v2
  'PNG', // replaced with PNGV2
  'printable_pdf', // replaced with printable_pdf_v2
];

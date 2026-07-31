/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { defineAssembly } from '@kbn/content-list-assembly';

export { defineAssembly };

/** Parses top-level `FlyoutTemplate` zones. */
export const flyoutAssembly = defineAssembly({ name: 'FlyoutTemplate' });

/** Parses `FlyoutTemplate.Header` parts. */
export const headerAssembly = defineAssembly({ name: 'FlyoutTemplateHeader' });

/** Parses `FlyoutTemplate.Body` parts and passthrough children. */
export const bodyAssembly = defineAssembly({ name: 'FlyoutTemplateBody' });

/** Parses `FlyoutTemplate.Body.Section` / `.Accordion` content. */
export const sectionAssembly = defineAssembly({ name: 'FlyoutTemplateSection' });

/** Parses `FlyoutTemplate.Footer` action parts. */
export const footerAssembly = defineAssembly({ name: 'FlyoutTemplateFooter' });

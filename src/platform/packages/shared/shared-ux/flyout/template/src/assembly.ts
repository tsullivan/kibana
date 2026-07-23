/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

/**
 * Declarative component assembly definitions for the flyout template.
 *
 * The factory is imported from `@kbn/content-list-assembly` (Option A in the
 * package plan). All assembly imports are centralized here so a future rename
 * to a neutral, general-purpose package is a single-file change.
 */
import { defineAssembly } from '@kbn/content-list-assembly';

export { defineAssembly };

/**
 * Root assembly. Parses the top-level zone parts (`header`, `body`, `footer`)
 * declared as children of `FlyoutTemplate`.
 */
export const flyoutAssembly = defineAssembly({ name: 'FlyoutTemplate' });

/**
 * Body assembly. Parses `Body.Section` parts (and passthrough children) declared
 * inside `FlyoutTemplate.Body`.
 */
export const bodyAssembly = defineAssembly({ name: 'FlyoutTemplateBody' });

/**
 * Footer assembly. Parses `Footer.PrimaryAction` / `Footer.SecondaryAction`
 * parts declared inside `FlyoutTemplate.Footer`.
 */
export const footerAssembly = defineAssembly({ name: 'FlyoutTemplateFooter' });

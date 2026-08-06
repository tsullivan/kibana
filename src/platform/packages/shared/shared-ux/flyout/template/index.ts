/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

export { FlyoutTemplate } from './src/flyout_template';

// The prop types live in `@kbn/shared-ux-flyout-common`, shared with the standalone
// `MetadataPairs` and `InfoBlocks` packages. Re-exported here so consumers of the template
// need only one import.
export type {
  FlyoutTemplateProps,
  FlyoutHeaderProps,
  FlyoutHeaderBadgeProps,
  FlyoutHeaderInfoBlockProps,
  FlyoutHeaderMetadataProps,
  FlyoutHeaderTabProps,
  FlyoutBodyProps,
  FlyoutBodyTabPanelProps,
  FlyoutBodySectionProps,
  FlyoutBodySectionAction,
  FlyoutBodySubsectionProps,
  FlyoutBodyAccordionProps,
  FlyoutFooterProps,
  FlyoutFooterPrimaryActionProps,
  FlyoutFooterSecondaryActionProps,
} from '@kbn/shared-ux-flyout-common';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { ComponentType } from 'react';
import type {
  FlyoutBodyAccordionProps,
  FlyoutBodySectionProps,
  FlyoutBodySubsectionProps,
  FlyoutFooterPrimaryActionProps,
  FlyoutFooterSecondaryActionProps,
  FlyoutHeaderBadgeProps,
  FlyoutHeaderInfoBlockProps,
  FlyoutHeaderMetaBlockProps,
  FlyoutHeaderProps,
  FlyoutHeaderTabProps,
  FlyoutTemplateProps,
} from '../types';

/**
 * A content slot. Rendered as `<Content />`, so it is a real component: it owns
 * its hooks, re-renders independently of the flyout chrome, and is isolated by the
 * template's error boundary. Bind props with a closure at the call site.
 */
export interface ContentSlot {
  Content: ComponentType;
}

/** `Body.Section.Subsection` / `Body.Accordion.Subsection` (the same component, both namespaces). */
export type FlyoutTemplateSectionItem =
  | ({ kind: 'content' } & ContentSlot)
  | ({ kind: 'subsection' } & Omit<FlyoutBodySubsectionProps, 'children'> & ContentSlot);

/**
 * One ordered list, so sections, accordions, and loose content interleave in source
 * order. Mixing `kind: 'section'` and `kind: 'accordion'` in the same list is still
 * only a template dev warning (`body/body.tsx`) — array homogeneity is awkward to
 * encode, so do not represent it here; do not demo the mix.
 */
export type FlyoutTemplateBodyItem =
  | ({ kind: 'content' } & ContentSlot)
  | ({ kind: 'section' } & Omit<FlyoutBodySectionProps, 'children'> & {
        items: FlyoutTemplateSectionItem[];
      })
  | ({ kind: 'accordion' } & Omit<FlyoutBodyAccordionProps, 'children'> & {
        items: FlyoutTemplateSectionItem[];
      });

/** A `Header.Tab` and the `Body.TabPanel` it selects, declared together. */
export type FlyoutTemplateTabOptions = FlyoutHeaderTabProps & {
  items: FlyoutTemplateBodyItem[];
  /** `data-test-subj` for the panel; the tab's own goes on `FlyoutHeaderTabProps`. */
  panelTestSubj?: string;
};

/** Everything `FlyoutTemplate.Header` can express. */
export type FlyoutTemplateHeaderOptions = Omit<FlyoutHeaderProps, 'title' | 'children'> & {
  badges?: FlyoutHeaderBadgeProps[];
  metaBlocks?: Array<Omit<FlyoutHeaderMetaBlockProps, 'children'> & ContentSlot>;
  infoBlocks?: Array<Omit<FlyoutHeaderInfoBlockProps, 'children'> & ContentSlot>;
};

/**
 * Tabbed vs untabbed. `tabs` is a non-empty tuple: an empty array is truthy, and
 * `tabs ? … : renderBodyItems(body)` would render no panels and never use `body`.
 *
 * No `selectedTabId`. The descriptor is a snapshot; passing it would put the
 * template in controlled mode, `onTabChange` would fire, and the panel would
 * never switch. Uncontrolled `defaultSelectedTabId` plus an optional analytics
 * `onTabChange` are the snapshot-safe surface.
 *
 * The untabbed branch declares `defaultSelectedTabId?: never` / `onTabChange?: never`
 * so tab state cannot ride along with `body`, and so both are destructurable from the
 * union in one statement (see `described_flyout_template.tsx`).
 */
export type FlyoutTemplateBodyOptions =
  | {
      body: FlyoutTemplateBodyItem[];
      tabs?: never;
      defaultSelectedTabId?: never;
      onTabChange?: never;
    }
  | {
      tabs: [FlyoutTemplateTabOptions, ...FlyoutTemplateTabOptions[]];
      body?: never;
      defaultSelectedTabId?: string;
      onTabChange?: (id: string) => void;
    };

/**
 * Every zone except the body/tabs split. Module-internal; the descriptor is the public name.
 *
 * Tab state is omitted here so `FlyoutTemplateBodyOptions` is its sole source: leaving it in
 * would let a caller set a tab id on the untabbed branch, where nothing renders panels.
 */
type FlyoutTemplateDescriptorBase = Omit<
  FlyoutTemplateProps,
  'children' | 'selectedTabId' | 'defaultSelectedTabId' | 'onTabChange'
> & {
  /** Header title. Required: it names the dialog and seeds the flyout menu's history entry. */
  title: string;
  header?: FlyoutTemplateHeaderOptions;
  /** Footer actions. `FlyoutTemplate.Footer` renders at most one of each. */
  footer?: {
    primaryAction?: FlyoutFooterPrimaryActionProps;
    secondaryAction?: FlyoutFooterSecondaryActionProps;
  };
};

/**
 * Distributes the base over each body branch, keeping the union at the top level.
 * Exported only because a non-exported alias cannot appear in the declaration emit of
 * `FlyoutTemplateDescriptor`; it is deliberately not re-exported from `template/index.ts`.
 */
export type WithBodyOptions<T> = T extends unknown ? FlyoutTemplateDescriptorBase & T : never;

/** The whole flyout as data. JSX titles (`ReactNode`) are out: the menu seed needs a string. */
export type FlyoutTemplateDescriptor = WithBodyOptions<FlyoutTemplateBodyOptions>;

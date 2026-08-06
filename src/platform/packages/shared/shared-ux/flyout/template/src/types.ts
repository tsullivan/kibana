/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { MouseEventHandler, ReactNode } from 'react';
import type { EuiBadgeProps, EuiButtonProps, EuiFlyoutProps, EuiIconProps } from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-flyout-info-blocks';

/** Props for the declarative `FlyoutTemplate.Header.Tab` part. */
export interface FlyoutHeaderTabProps {
  /** Stable identifier, used to link the tab to its `Body.TabPanel`. */
  id: string;
  /** Tab label rendered inside `EuiTab`. */
  label: ReactNode;
  disabled?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Body.TabPanel` part. */
export interface FlyoutBodyTabPanelProps {
  /** Must match the `id` of a `Header.Tab`. */
  tabId: string;
  children?: ReactNode;
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Header` zone. */
export interface FlyoutHeaderProps {
  /** Title rendered by the header. Rendered as an H3 (heading level is owned by the template). */
  title: ReactNode;
  'data-test-subj'?: string;
  /** `Header.Metablock`, `Header.Badge`, `Header.InfoBlock`, and `Header.Tab` parts. */
  children?: ReactNode;
  /** Icon beside the title; defaults to `info` when `titleTooltip` is set. */
  titleIcon?: EuiIconProps['type'];
  /** Tooltip shown from the title icon. */
  titleTooltip?: ReactNode;
  /** Subdued text below the title (e.g. a timestamp or short context string). */
  description?: ReactNode;
  /** Initial selected tab id (uncontrolled); ignored when `selectedTabId` is provided. */
  defaultSelectedTabId?: string;
  /** Currently selected tab id (controlled); `onTabChange` fires on every click. */
  selectedTabId?: string;
  /** Called when the user clicks a tab. */
  onTabChange?: (id: string) => void;
}

/** Props for the declarative `FlyoutTemplate.Header.MetaBlock` part. */
export interface FlyoutHeaderMetaBlockProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** The pair's key, rendered bold ahead of the value. */
  title: ReactNode;
  /** The pair's value; accepts rich content such as links. */
  children: ReactNode;
  'data-test-subj'?: string;
}

/**
 * Props for the declarative `FlyoutTemplate.Header.Badge` part.
 *
 * The template composes the `EuiBadge` itself, so only presentational options are
 * exposed. Badges in a flyout header label the subject; they are not controls.
 */
export interface FlyoutHeaderBadgeProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Badge label. */
  children: ReactNode;
  /** Palette color name or hex value. */
  color?: EuiBadgeProps['color'];
  /** Icon shown inside the badge. */
  iconType?: EuiBadgeProps['iconType'];
  /** Which side of the label the icon sits on. */
  iconSide?: EuiBadgeProps['iconSide'];
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Header.InfoBlock` part. */
export interface FlyoutHeaderInfoBlockProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Fixed-style text label rendered above the value. */
  title: string;
  /** The block's value content. */
  children: ReactNode;
  size?: InfoBlockItem['size'];
  color?: InfoBlockItem['color'];
  'data-test-subj'?: string;
}

/** Action link rendered right-aligned on a section or accordion title row. */
export interface FlyoutBodySectionAction {
  /** Link text. */
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  href?: string;
  'data-test-subj'?: string;
}

export interface FlyoutBodySectionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Section title rendered as an H4. */
  title: ReactNode;
  /** Icon beside the title; defaults to `info` when `tooltip` is set. */
  icon?: EuiIconProps['type'];
  /** Tooltip shown from an icon to the right of the title. */
  tooltip?: ReactNode;
  /** Action link aligned to the right on the title row. */
  action?: FlyoutBodySectionAction;
  /** Wrap the section content (not the title) in an outlined box. Defaults to `false`. */
  hasBorder?: boolean;
  'data-test-subj'?: string;
  children?: ReactNode;
}

/** Props for the declarative body subsection part. */
export interface FlyoutBodySubsectionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Subsection title rendered as an H5. */
  title: ReactNode;
  'data-test-subj'?: string;
  children?: ReactNode;
}

/** Props for the declarative `FlyoutTemplate.Body.Accordion` part. */
export interface FlyoutBodyAccordionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Accordion title, styled to match a section title. */
  title: ReactNode;
  /** Icon beside the title; defaults to `info` when `tooltip` is set. */
  icon?: EuiIconProps['type'];
  /** Tooltip shown from an icon to the right of the title. */
  tooltip?: ReactNode;
  /** Action link aligned to the right on the title row (the accordion's extra action). */
  action?: FlyoutBodySectionAction;
  /** Whether the accordion is expanded on first render. Defaults to `false`. */
  initialIsOpen?: boolean;
  'data-test-subj'?: string;
  children?: ReactNode;
}

/** Props for the declarative `FlyoutTemplate.Body` zone. */
export interface FlyoutBodyProps {
  'data-test-subj'?: string;
  /**
   * `Body.Section`, `Body.Accordion`, or `Body.TabPanel` parts, and/or arbitrary
   * content (callouts, search bars, data grids) rendered as-is in source order.
   */
  children?: ReactNode;
}

/** Props shared by the declarative footer action parts. */
export interface FlyoutFooterActionBaseProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Button label. */
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  iconType?: EuiButtonProps['iconType'];
  color?: EuiButtonProps['color'];
  isLoading?: boolean;
  isDisabled?: boolean;
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Footer.PrimaryAction` part. */
export interface FlyoutFooterPrimaryActionProps extends FlyoutFooterActionBaseProps {
  /** Whether to render the primary button as filled. Defaults to `true`. */
  fill?: boolean;
}

/** Props for the declarative `FlyoutTemplate.Footer.SecondaryAction` part. */
export type FlyoutFooterSecondaryActionProps = FlyoutFooterActionBaseProps;

/** Props for the declarative `FlyoutTemplate.Footer` zone. */
export interface FlyoutFooterProps {
  'data-test-subj'?: string;
  /** `Footer.PrimaryAction` / `Footer.SecondaryAction` parts. */
  children?: ReactNode;
}

/** Props for the root `FlyoutTemplate` component. */
export type FlyoutTemplateProps = Pick<
  EuiFlyoutProps,
  | 'onClose'
  | 'size'
  | 'minWidth'
  | 'type'
  | 'maxWidth'
  | 'paddingSize'
  | 'ownFocus'
  | 'resizable'
  | 'onResize'
  | 'session'
  | 'historyKey'
  | 'onActive'
  | 'flyoutMenuProps'
  | 'flyoutMenuDisplayMode'
> & {
  'aria-label'?: EuiFlyoutProps['aria-label'];
  'aria-labelledby'?: EuiFlyoutProps['aria-labelledby'];
  'data-test-subj'?: string;
  /** Declarative zone children: `FlyoutTemplate.Header`, `.Body`, `.Footer`. */
  children?: ReactNode;
};

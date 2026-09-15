/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type {
  EuiBadgeProps,
  EuiButtonProps,
  EuiContextMenuPanelDescriptor,
  EuiContextMenuPanelItemDescriptor,
  EuiContextMenuProps,
  EuiFlyoutProps,
  EuiIconProps,
} from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/flyout-info-blocks';
import type {
  FlyoutSectionAction,
  FlyoutSectionProps,
  FlyoutSubsectionProps,
  FlyoutAccordionProps,
} from '@kbn/flyout-sections';

/** Props for a single tab entry in the root `tabs` array. */
export interface FlyoutTabProps {
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
  /** The `id` of the root `tabs` entry this panel belongs to. Non-matching ids are silently ignored in tabbed mode. */
  tabId: string;
  children?: ReactNode;
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Header` zone. */
export interface FlyoutHeaderProps {
  /** Title rendered by the header. Rendered as an `<h3>` (heading level is owned by the template). */
  title: ReactNode;
  'data-test-subj'?: string;
  /**
   * `Header.MetaBlock`, `Header.Badge`, and `Header.InfoBlock` parts.
   * Free-form content is not rendered.
   */
  children?: ReactNode;
  /** Icon beside the title; defaults to `info` when `titleTooltip` is set. */
  titleIcon?: EuiIconProps['type'];
  /** Tooltip shown from the title icon. */
  titleTooltip?: ReactNode;
  /** Subdued text below the title. */
  description?: ReactNode;
  /**
   * When true, the header is permanently rendered in its compact collapsed layout regardless of
   * scroll position. The description, meta blocks, badges, and info blocks are not shown.
   */
  collapsed?: boolean;
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
export type FlyoutBodySectionAction = FlyoutSectionAction;

/** Props for the declarative `FlyoutTemplate.Body.Section` part. `borderOnChildren` is derived from the children, not authored. */
export type FlyoutBodySectionProps = Omit<FlyoutSectionProps, 'borderOnChildren'>;

/** Props for the declarative body subsection part. `hasBorder` is inherited from the parent, not authored. */
export type FlyoutBodySubsectionProps = Omit<FlyoutSubsectionProps, 'hasBorder'>;

/** Props for the declarative `FlyoutTemplate.Body.Accordion` part. */
export type FlyoutBodyAccordionProps = Omit<FlyoutAccordionProps, 'hasBorder'>;

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
  /** HTML id forwarded to the button element. */
  id?: string;
  /** Button label. */
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  iconType?: EuiButtonProps['iconType'];
  isLoading?: boolean;
  isDisabled?: boolean;
  'data-test-subj'?: string;
}

/** Props for the declarative `FlyoutTemplate.Footer.PrimaryAction` part. */
export type FlyoutFooterPrimaryActionProps = FlyoutFooterActionBaseProps;

/** Props for the declarative `FlyoutTemplate.Footer.SecondaryAction` part. */
export type FlyoutFooterSecondaryActionProps = FlyoutFooterActionBaseProps;

/**
 * A row in a footer action menu: an action, or a separator between groups.
 *
 * `renderItem` is rejected because a custom row renders inside the panel's `role="menu"`,
 * where arbitrary content — a form control, a link — misrepresents itself to assistive
 * tech. Content that is not an action belongs in the body or in a child flyout.
 *
 * Narrowing by `Extract` rather than rebuilding the union keeps EUI's own disambiguation,
 * which makes an entry and a separator mutually exclusive. `WithStringName` then rewrites
 * `name` on the entry branch only; a separator has no name to narrow.
 */
type WithStringName<T> = T extends { name: ReactNode } ? Omit<T, 'name'> & { name: string } : T;

export type FlyoutFooterMenuItem = WithStringName<
  Extract<EuiContextMenuPanelItemDescriptor, { renderItem?: never }>
>;

/**
 * A panel in a footer action menu.
 *
 * `content` is rejected for the same reason as `renderItem`: a content panel drops the
 * menu role entirely and becomes a dialog wearing a menu's chrome. With it gone, a
 * panel always has items, so `items` is required.
 */
export type FlyoutFooterMenuPanel = Omit<
  EuiContextMenuPanelDescriptor,
  'content' | 'items' | 'title'
> & {
  items: FlyoutFooterMenuItem[];
  /**
   * Panel heading. Required on any panel another panel navigates into: it is what
   * draws the back button, and EUI builds that button's accessible name from it.
   */
  title?: string;
  content?: never;
};

/**
 * Props for the declarative `FlyoutTemplate.Footer.PrimaryActionMenu` part.
 *
 * Rendered as a filled `EuiButton` that opens an `EuiContextMenu` in a popover above
 * the footer. Every behavioral `EuiContextMenu` prop is forwarded; its styling surface
 * is not. Panels pass through unmodified apart from the auto-close wrapper described
 * by `closeOnItemClick`.
 */
export interface FlyoutFooterPrimaryActionMenuProps
  extends Pick<EuiContextMenuProps, 'onPanelChange' | 'height'> {
  /** HTML id forwarded to the trigger button. */
  id?: string;
  /** Trigger button label, e.g. "Take action". The chevron is supplied by the template. */
  label: string;
  /** Menu contents. Memoize this: a new array identity on every render resets EUI's keyboard navigation. */
  panels: FlyoutFooterMenuPanel[];
  /** Panel the menu opens on. Defaults to the first entry in `panels`. */
  initialPanelId?: string | number;
  isLoading?: boolean;
  isDisabled?: boolean;
  /**
   * Whether picking an item closes the menu. Defaults to `true`. Separators and items
   * that open a nested panel are never auto-closed.
   */
  closeOnItemClick?: boolean;
  /** Overrides the popover dialog's name, which otherwise derives from `label`. */
  'aria-label'?: string;
  /** Forwarded to the trigger button; the popover panel gets `${value}Panel`. */
  'data-test-subj'?: string;
  /** Forwarded unchanged to `EuiContextMenu`; gives the menu a fixed height with internal scrolling. */
  height?: CSSProperties['height'];
}

/** Props for the declarative `FlyoutTemplate.Footer` zone. */
export interface FlyoutFooterProps {
  'data-test-subj'?: string;
  /** `Footer.PrimaryAction`, `Footer.PrimaryActionMenu`, and `Footer.SecondaryAction` parts. */
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
  | 'id'
  | 'hasChildBackground'
  | 'outsideClickCloses'
  | 'focusTrapProps'
  | 'closeButtonProps'
> & {
  'aria-label'?: EuiFlyoutProps['aria-label'];
  'aria-labelledby'?: EuiFlyoutProps['aria-labelledby'];
  'data-test-subj'?: string;
  /** Declarative zone children: `FlyoutTemplate.Header`, `.Body`, `.Footer`. */
  children?: ReactNode;
  /** Tabs rendered in the header bar. Omit for a flyout with no tabs. */
  tabs?: FlyoutTabProps[];
  /** Initial selected tab id (uncontrolled); ignored when `selectedTabId` is provided. */
  defaultSelectedTabId?: string;
  /** Currently selected tab id (controlled); `onTabChange` fires on every click either way. */
  selectedTabId?: string;
  /** Called when the user clicks a tab. */
  onTabChange?: (id: string) => void;
};

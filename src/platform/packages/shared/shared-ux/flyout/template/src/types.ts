/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { MouseEventHandler, ReactNode } from 'react';
import type { EuiButtonProps, EuiFlyoutProps, EuiIconProps } from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';

/**
 * Descriptor produced by resolving a `Header.Tab` part. Consumed by the header
 * zone to render `EuiTabs`/`EuiTab` and by `FlyoutTabsProvider` to publish the
 * ordered tab list.
 */
export interface TabDescriptor {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  prepend?: ReactNode;
  append?: ReactNode;
  'data-test-subj'?: string;
}

/**
 * Props for the declarative `FlyoutTemplate.Header.Tab` part.
 */
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

/**
 * Props for the declarative `FlyoutTemplate.Body.TabPanel` part.
 */
export interface FlyoutBodyTabPanelProps {
  /** Must match the `id` of a `Header.Tab`. */
  tabId: string;
  children?: ReactNode;
  'data-test-subj'?: string;
}

/**
 * Props for the declarative `FlyoutTemplate.Header` zone.
 */
export interface FlyoutHeaderProps {
  /** Title rendered by the header. Rendered as an H3 (heading level is owned by the template). */
  title: ReactNode;
  'data-test-subj'?: string;
  /** `Header.InfoBlock` and `Header.Tab` parts. */
  children?: ReactNode;
  /**
   * Initial selected tab id (uncontrolled). Defaults to the first tab's id when
   * omitted. Ignored when `selectedTabId` is provided.
   */
  defaultSelectedTabId?: string;
  /**
   * Currently selected tab id (controlled). When provided the consumer drives
   * selection; `onTabChange` fires on every click.
   */
  selectedTabId?: string;
  /** Called when the user clicks a tab. */
  onTabChange?: (id: string) => void;
}

/**
 * Props for the declarative `FlyoutTemplate.Header.InfoBlock` part.
 *
 * Resolves into an `InfoBlockItem` rendered by `@kbn/shared-ux-info-blocks`;
 * `children` supplies the block's value, mirroring `Body.Section`'s content
 * children.
 */
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

/**
 * Props for the declarative `FlyoutTemplate.Body.Section` part.
 */
/**
 * A single action link rendered right-aligned on the section title row
 * (`FlyoutTemplate.Body.Section`'s `action`).
 */
export interface FlyoutSectionAction {
  /** Link text. */
  label: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>;
  href?: string;
  'data-test-subj'?: string;
}

export interface FlyoutSectionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Section title rendered as an H4. */
  title: ReactNode;
  /**
   * Icon rendered immediately to the right of the title. When `tooltip` is set
   * the icon becomes the tooltip anchor; defaults to an info icon if omitted.
   */
  icon?: EuiIconProps['type'];
  /** Tooltip shown from an icon to the right of the title. */
  tooltip?: ReactNode;
  /** Action link aligned to the right on the title row. */
  action?: FlyoutSectionAction;
  /** Wrap the section content (not the title) in an outlined box. Defaults to `false`. */
  hasBorder?: boolean;
  'data-test-subj'?: string;
  children?: ReactNode;
}

/**
 * Props for the declarative `FlyoutTemplate.Body.Accordion` part.
 *
 * The title row mirrors `Body.Section` (title, optional `icon`/`tooltip`, and a
 * right-aligned `action`). Accordion content is always wrapped in an outlined
 * box, so there is no `hasBorder` option. A body uses either `Section` or
 * `Accordion` parts, not both.
 */
export interface FlyoutAccordionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Accordion title, styled to match a section title. */
  title: ReactNode;
  /**
   * Icon rendered immediately to the right of the title. When `tooltip` is set
   * the icon becomes the tooltip anchor; defaults to an info icon if omitted.
   */
  icon?: EuiIconProps['type'];
  /** Tooltip shown from an icon to the right of the title. */
  tooltip?: ReactNode;
  /** Action link aligned to the right on the title row (the accordion's extra action). */
  action?: FlyoutSectionAction;
  /** Whether the accordion is expanded on first render. Defaults to `false`. */
  initialIsOpen?: boolean;
  'data-test-subj'?: string;
  children?: ReactNode;
}

/**
 * Props for the declarative `FlyoutTemplate.Body` zone.
 */
export interface FlyoutBodyProps {
  'data-test-subj'?: string;
  /** `Body.Section` parts and/or passthrough content (callouts, search, etc.). */
  children?: ReactNode;
}

/**
 * Props shared by the declarative footer action parts
 * (`Footer.PrimaryAction` and `Footer.SecondaryAction`).
 */
export interface FlyoutFooterActionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Button label. */
  label: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  iconType?: EuiButtonProps['iconType'];
  color?: EuiButtonProps['color'];
  isLoading?: boolean;
  isDisabled?: boolean;
  /** Only honored by the primary action; defaults to `true`. */
  fill?: boolean;
  'data-test-subj'?: string;
}

/**
 * Props for the declarative `FlyoutTemplate.Footer` zone.
 */
export interface FlyoutFooterProps {
  'data-test-subj'?: string;
  /** `Footer.PrimaryAction` / `Footer.SecondaryAction` parts. */
  children?: ReactNode;
}

/**
 * Props for the root `FlyoutTemplate` component.
 *
 * Structural EUI flyout concerns are passed through to the underlying
 * `EuiFlyout`. `session` defaults to `'start'`, making these managed flyouts so
 * the menu bar is auto-provided by EUI.
 */
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
  'aria-label'?: string;
  'data-test-subj'?: string;
  /** Declarative zone children: `FlyoutTemplate.Header`, `.Body`, `.Footer`. */
  children?: ReactNode;
};

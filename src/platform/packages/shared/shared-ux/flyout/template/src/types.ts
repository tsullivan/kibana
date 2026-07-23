/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { MouseEventHandler, ReactNode } from 'react';
import type { EuiButtonProps, EuiFlyoutProps } from '@elastic/eui';
import type { InfoBlockItem } from '@kbn/shared-ux-info-blocks';

/**
 * Props for the declarative `FlyoutTemplate.Header` zone.
 *
 * `title` and `Header.InfoBlock` are supported in this slice; metadata, badges,
 * and tabs are added as declarative parts in a follow-up.
 */
export interface FlyoutHeaderProps {
  /** Title rendered by the header. Rendered as an H3 (heading level is owned by the template). */
  title: ReactNode;
  'data-test-subj'?: string;
  /** `Header.InfoBlock` parts (Metadata, Badge, and Tab parts land in a follow-up). */
  children?: ReactNode;
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
export interface FlyoutSectionProps {
  /** Optional explicit instance id; auto-generated when omitted. */
  id?: string;
  /** Section title rendered as an H4. */
  title: ReactNode;
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
  | 'type'
  | 'maxWidth'
  | 'paddingSize'
  | 'session'
  | 'historyKey'
  | 'flyoutMenuProps'
  | 'flyoutMenuDisplayMode'
> & {
  'aria-label'?: string;
  'data-test-subj'?: string;
  /** Declarative zone children: `FlyoutTemplate.Header`, `.Body`, `.Footer`. */
  children?: ReactNode;
};

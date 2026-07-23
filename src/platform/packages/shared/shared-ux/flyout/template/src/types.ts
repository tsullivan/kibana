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

/**
 * Props for the declarative `FlyoutTemplate.Header` zone.
 *
 * Only `title` is supported in this slice; metadata, badges, info blocks, and
 * tabs are added as declarative parts in a follow-up.
 */
export interface FlyoutHeaderProps {
  /** Title rendered by the header. Rendered as an H3 (heading level is owned by the template). */
  title: ReactNode;
  'data-test-subj'?: string;
  /** Reserved for future header parts (Metadata, Badge, InfoBlock, Tab). */
  children?: ReactNode;
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

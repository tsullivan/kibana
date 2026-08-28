/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import type { OverlayRef } from '@kbn/core-mount-utils-browser';
import type { EuiFlyoutProps } from '@elastic/eui';
import type { FlyoutTemplateDescriptor } from '@kbn/flyout-template';
import type { OverlayFlyoutOpenOptions } from './flyout';

/**
 * Options for opening a system flyout.
 *
 * @deprecated Use {@link OverlayFlyoutTemplateOpenOptions} with `openFlyoutTemplate` instead.
 */
export type OverlaySystemFlyoutOpenOptions = Omit<OverlayFlyoutOpenOptions, 'session'> & {
  /**
   * Control the flyout session behavior. See {@link EuiFlyoutProps.session}
   * @default "start"
   */
  session?: EuiFlyoutProps['session'];
  /**
   * Title for the flyout (for flyout system managed history).
   */
  title?: string;
  /**
   * Props for the flyout menu.
   * If `title` is provided here, it takes precedence over the top-level `title`.
   */
  flyoutMenuProps?: EuiFlyoutProps['flyoutMenuProps'];
};

/**
 * APIs to open and manage fly-out dialogs.
 *
 * @deprecated Use {@link OverlayFlyoutTemplateStart} via `openFlyoutTemplate` instead.
 * @public
 */
export interface OverlaySystemFlyoutStart {
  /**
   * Opens a flyout panel with given React element inside. Calling `open` for multiple flyouts allows history navigation.
   * You can use `close()` on the returned FlyoutRef to close the flyout.
   *
   * @param content React.ReactElement - Renders the content inside a flyout panel
   * @param options {@link EuiFlyoutProps} - options for the flyout
   * @return {@link OverlayRef} A reference to the opened flyout panel.
   *
   * @deprecated Use `openFlyoutTemplate` instead.
   */
  open(content: React.ReactElement, options?: OverlaySystemFlyoutOpenOptions): OverlayRef;
}

/**
 * Swaps the template's EUI `onClose` for the overlay one, distributively: a plain
 * `Omit` over `FlyoutTemplateDescriptor` would flatten its tabbed/untabbed union,
 * silently dropping `defaultSelectedTabId` / `onTabChange` and allowing `body` and
 * `tabs` together. See the note in `@kbn/flyout-template`'s descriptor types.
 */
type WithOverlayOnClose<T> = T extends unknown
  ? Omit<T, 'onClose'> & {
      /** If provided the consumer is responsible for calling `flyout.close()`. */
      onClose?: (flyout: OverlayRef) => void;
    }
  : never;

/**
 * Options for opening a system flyout rendered as a `FlyoutTemplate`. Describes every
 * zone (header, body, footer) as data; see `@kbn/flyout-template` for the full
 * descriptor reference.
 *
 * @public
 */
export type OverlayFlyoutTemplateOpenOptions = WithOverlayOnClose<FlyoutTemplateDescriptor>;

/**
 * APIs to open and manage `FlyoutTemplate`-based fly-out dialogs.
 *
 * @public
 */
export interface OverlayFlyoutTemplateStart {
  /**
   * Opens a flyout panel rendered as a `FlyoutTemplate` from the given descriptor. Calling
   * `open` for multiple flyouts allows history navigation. You can use `close()` on the
   * returned FlyoutRef to close the flyout.
   *
   * @param options {@link OverlayFlyoutTemplateOpenOptions} - the flyout descriptor
   * @return {@link OverlayRef} A reference to the opened flyout panel.
   */
  open(options: OverlayFlyoutTemplateOpenOptions): OverlayRef;
}

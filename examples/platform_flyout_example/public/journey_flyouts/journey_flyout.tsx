/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { euiAnimFadeIn, transparentize, useEuiTheme } from '@elastic/eui';
import { css } from '@emotion/react';
import type { ManagedFlyoutImperativeHandle, ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import React, { forwardRef, useImperativeHandle, useState } from 'react';

export const JourneyFlyout = forwardRef<ManagedFlyoutImperativeHandle | null>(({}, ref) => {
  const [flyout, setFlyout] = useState<ManagedFlyoutEntry | null>(null);

  useImperativeHandle(ref, () => ({
    // send back an imperative method that opens the INITIAL flyout
    openFlyout: (flyoutEntry) => {
      setFlyout(flyoutEntry);
    },
  }));

  if (!flyout) return null;

  return (
    <>
      <JourneyFlyoutFade />
      {flyout && (
        <div data-test-subj="active-flyout">
          <flyout.Component />
        </div>
      )}
    </>
  );
});

export const JourneyFlyoutFade = () => {
  const { euiTheme } = useEuiTheme();
  return (
    <div
      className="journey-flyout-fade"
      css={css`
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        position: fixed;
        z-index: ${euiTheme.levels.maskBelowHeader};
        animation: ${euiAnimFadeIn} ${euiTheme.animation.fast} ease-in;
        background-color: ${transparentize(euiTheme.colors.plainDark, 0.5)};
      `}
    />
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UseManagedFlyoutApi, ManagedFlyoutEntry } from '@kbn/core-overlays-browser';
import useObservable from 'react-use/lib/useObservable';
import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  type EuiFlyoutProps,
  EuiSpacer,
} from '@elastic/eui';
import { managedFlyoutService } from './managed_flyout_service'; // Use generic ManagedFlyoutEntry

interface FlyoutContainerProps {
  managedFlyoutApi: UseManagedFlyoutApi;
}

interface FlyoutPanelProps {
  entry: ManagedFlyoutEntry | null;
  level: 'main' | 'child';
  positionRight: number;
  showMainControls?: boolean;
  canGoBack?: boolean;
  managedFlyoutApi: UseManagedFlyoutApi;
}

const FlyoutPanel = React.memo(
  ({
    entry,
    level,
    positionRight,
    showMainControls,
    canGoBack,
    managedFlyoutApi,
  }: FlyoutPanelProps) => {
    const [isOpen, setIsOpen] = useState(!!entry);

    useEffect(() => {
      setIsOpen(!!entry);
    }, [entry]);

    const handleCloseFlyout = useCallback(() => managedFlyoutApi.closeFlyout(), [managedFlyoutApi]);
    const handleGoBack = useCallback(() => managedFlyoutApi.goBack(), [managedFlyoutApi]);

    const bodyToRender = useMemo(
      () => (entry && entry.renderBody ? entry.renderBody(managedFlyoutApi) : null),
      [entry, managedFlyoutApi]
    );
    const headerToRender = useMemo(
      () => (entry && entry.renderHeader ? entry.renderHeader(managedFlyoutApi) : null),
      [entry, managedFlyoutApi]
    );
    const flyoutProps = useMemo(
      () => (entry && entry.flyoutProps ? entry.flyoutProps : {}),
      [entry]
    );

    if (!isOpen) {
      return;
    }

    return (
      <EuiFlyout
        {...flyoutProps}
        onClose={handleCloseFlyout}
        hideCloseButton
        css={({ euiTheme }) => ({
          right: positionRight + 'px',
          backgroundColor: level === 'child' ? euiTheme.colors.backgroundBaseSubdued : undefined,
        })}
        size={level === 'child' ? 's' : flyoutProps.size || 'm'}
        type={level === 'child' ? 'overlay' : flyoutProps.type}
        ownFocus={level === 'child' ? false : flyoutProps.ownFocus}
      >
        {headerToRender && (
          <EuiFlyoutHeader hasBorder>
            {headerToRender}
            <EuiSpacer size="s" />
          </EuiFlyoutHeader>
        )}
        <EuiFlyoutBody>{bodyToRender}</EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty iconType="cross" onClick={handleCloseFlyout} flush="left">
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
            {showMainControls && canGoBack && (
              <EuiButtonEmpty onClick={handleGoBack}>Back</EuiButtonEmpty>
            )}
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    );
  }
);

const calculateMainFlyoutWidth = (flyoutSize: EuiFlyoutProps['size'] = 'm') => {
  if (flyoutSize && typeof flyoutSize === 'number') {
    return flyoutSize;
  }
  switch (flyoutSize) {
    case 'l':
      return 1300;
    case 'm':
      return 870;
    default:
      return 435;
  }
};

export const FlyoutContainer: React.FC<FlyoutContainerProps> = ({ managedFlyoutApi }) => {
  const flyout$ = managedFlyoutService.getFlyout$();
  const flyoutState = useObservable(flyout$, { main: null, child: null });

  const mainFlyoutWidth = calculateMainFlyoutWidth(flyoutState.main?.flyoutProps?.size);
  const childPanelRight = mainFlyoutWidth;
  const canGoBack = managedFlyoutService.canGoBack();

  return (
    <>
      <FlyoutPanel
        entry={flyoutState.main}
        positionRight={0}
        level="main"
        showMainControls={true}
        canGoBack={canGoBack}
        managedFlyoutApi={managedFlyoutApi}
      />

      {flyoutState.main && (
        <FlyoutPanel
          entry={flyoutState.child}
          positionRight={childPanelRight}
          level="child"
          showMainControls={false}
          managedFlyoutApi={managedFlyoutApi}
        />
      )}
    </>
  );
};

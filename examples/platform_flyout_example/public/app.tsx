/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EuiPageHeader, EuiPageSection } from '@elastic/eui';
import { AppMountParameters, CoreStart } from '@kbn/core/public';
import React from 'react';
import ReactDOM from 'react-dom';
import { GreyboxExample } from './examples/greybox_example';
import { StartDeps } from './plugin';
import { FlyoutApiProvider } from './context';

export const renderApp = (core: CoreStart, deps: StartDeps, mountParams: AppMountParameters) => {
  core.chrome.docTitle.change('Flyout examples');

  ReactDOM.render(
    core.rendering.addContext(
      <FlyoutApiProvider core={core}>
        <EuiPageHeader
          paddingSize="m"
          pageTitle="Platform flyouts"
          description="This example app demonstrates how to use the Platform Flyouts API for flyout-to-flyout interactions, and for showing detail content side by side with main content."
        />
        <EuiPageSection paddingSize="m" alignment="top">
          <GreyboxExample />
        </EuiPageSection>
      </FlyoutApiProvider>
    ),
    mountParams.element
  );

  return () => ReactDOM.unmountComponentAtNode(mountParams.element);
};

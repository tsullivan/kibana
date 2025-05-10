/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { type FC, type ReactNode } from 'react';
import { KibanaPageTemplate } from '@kbn/shared-ux-page-kibana-template';
import { EuiListGroup, EuiListGroupItemProps, EuiProvider, EuiText } from '@elastic/eui';

export const PageTemplate: FC<{ title: string; button: ReactNode[] }> = ({ title, button }) => {
  const sidebarListGroup: EuiListGroupItemProps[] = [
    {
      label: 'Discover',
      isActive: true,
      iconType: 'discoverApp',
    },
    {
      label: 'Dashboard',
      iconType: 'dashboardApp',
    },
    {
      label: 'Visualize',
      iconType: 'visualizeApp',
    },
    {
      label: 'Settings',
      iconType: 'gear',
    },
  ];
  return (
    <EuiProvider>
      <KibanaPageTemplate>
        <KibanaPageTemplate.Sidebar>
          <EuiListGroup listItems={sidebarListGroup} color="primary" size="s" />
        </KibanaPageTemplate.Sidebar>
        <KibanaPageTemplate.Header pageTitle={title} rightSideItems={button} />
        <KibanaPageTemplate.Section>
          <EuiText>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae
              vestibulum vestibulum. Cras venenatis euismod malesuada. Curabitur sit amet magna quis
              arcu vehicula fermentum. Integer nec odio. Praesent libero. Sed cursus ante dapibus
              diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum.
              Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum
              lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos.
            </p>
          </EuiText>
        </KibanaPageTemplate.Section>
      </KibanaPageTemplate>
    </EuiProvider>
  );
};

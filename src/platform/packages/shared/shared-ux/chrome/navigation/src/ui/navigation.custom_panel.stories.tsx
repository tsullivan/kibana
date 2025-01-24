/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { ComponentMeta } from '@storybook/react';
import React from 'react';
import { of } from 'rxjs';

import { EuiButton, EuiText } from '@elastic/eui';

import type { NavigationTreeDefinitionUI } from '@kbn/core-chrome-browser';
import { NavigationStorybookMock, NavigationWrapper } from '../../mocks';
import mdx from '../../README.mdx';
import type { NavigationServices } from '../types';
import { NavigationProvider } from '../services';
import { Navigation } from './navigation';
import { ContentProvider } from './components/panel';

const storybookMock = new NavigationStorybookMock();

const panelContentProvider: ContentProvider = (id: string) => {
  if (id === 'example_projet.group.openpanel1') {
    return; // Use default title & content
  }

  if (id === 'example_projet.group.openpanel2') {
    // Custom content
    return {
      content: ({ closePanel }) => {
        return (
          <div>
            <EuiText>This is a custom component to render in the panel.</EuiText>
            <EuiButton onClick={() => closePanel()}>Close panel</EuiButton>
          </div>
        );
      },
    };
  }

  if (id === 'example_projet.group.openpanel3') {
    return {
      title: <div style={{ backgroundColor: 'yellow', fontWeight: 600 }}>Custom title</div>,
    };
  }
};

const navigationTreeWithPanels: NavigationTreeDefinitionUI = {
  id: 'es',
  body: [
    // My custom project
    {
      id: 'example_projet',
      title: 'Example project',
      icon: 'logoObservability',
      defaultIsCollapsed: false,
      isCollapsible: false,
      path: 'example_projet',
      children: [
        {
          id: 'item1',
          href: '/app/kibana',
          path: 'example_projet.item1',
          title: 'Get started',
        },
        {
          id: 'item2',
          href: '/app/kibana',
          path: 'example_projet.item2',
          title: 'Alerts',
        },
        {
          // Panel with default content
          // Groups with title
          id: 'group.openpanel1',
          title: 'Open panel (1)',
          renderAs: 'panelOpener',
          href: '/app/kibana',
          path: 'example_projet.group.openpanel1',
          children: [
            {
              id: 'group1',
              title: 'Group 1',
              path: 'example_projet.group.openpanel1.group1',
              children: [
                {
                  id: 'item1',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group1.item1',
                  title: 'Logs',
                  icon: 'logoObservability',
                },
                {
                  id: 'item2',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group1.item2',
                  title: 'Signals xxxxxx',
                  openInNewTab: true,
                },
                {
                  id: 'item3',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group1.item3',
                  title: 'Tracing',
                  withBadge: true, // Default to "Beta" badge
                },
              ],
            },
            {
              id: 'group2',
              path: 'example_projet.group.openpanel1.group2',
              title: 'Group 2',
              children: [
                {
                  id: 'group2:settings.logs',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group2.group2:settings.logs',
                  title: 'Logs',
                },
                {
                  id: 'group2:settings.signals',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group2.group2:settings.signals',
                  title: 'Signals',
                },
                {
                  id: 'group2:settings.tracing',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel1.group2.group2:settings.tracing',
                  title: 'Tracing',
                },
              ],
            },
          ],
        },
        {
          // Panel with default content
          // Groups with **not** title
          id: 'group.openpanel2',
          title: 'Open panel (2)',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel2',
          children: [
            {
              id: 'group1',
              path: 'example_projet.group.openpanel2.group1',
              title: '',
              appendHorizontalRule: true, // Add a separator after the group
              children: [
                {
                  id: 'logs',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group1.logs',
                  title: 'Logs',
                },
                {
                  id: 'signals',
                  title: 'Signals',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group1.signals',
                },
                {
                  id: 'tracing',
                  title: 'Tracing',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group1.tracing',
                  withBadge: true, // Default to "Beta" badge
                },
              ],
            },
            {
              id: 'group2',
              path: 'example_projet.group.openpanel2.group2',
              title: '',
              children: [
                {
                  id: 'logs',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group2.logs',
                  title: 'Logs',
                },
                {
                  id: 'signals',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group2.signals',
                  title: 'Signals',
                },
                {
                  id: 'tracing',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel2.group2.tracing',
                  title: 'Tracing',
                },
              ],
            },
          ],
        },
        {
          // Panel with default content
          // Accordion to wrap groups
          id: 'group.openpanel3',
          title: 'Open panel (3)',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel3',
          children: [
            {
              id: 'group1',
              title: '',
              path: 'example_projet.group.openpanel3.group1',
              appendHorizontalRule: true,
              children: [
                {
                  id: 'logs',
                  title: 'Logs',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel3.group1.logs',
                },
                {
                  id: 'signals',
                  title: 'Signals',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel3.group1.signals',
                },
                {
                  id: 'tracing',
                  title: 'Tracing',
                  withBadge: true, // Default to "Beta" badge
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel3.group1.tracing',
                },
              ],
            },
            // Groups with accordion
            {
              id: 'group2',
              title: 'MANAGEMENT',
              renderAs: 'accordion',
              path: 'example_projet.group.openpanel3.group2',
              children: [
                {
                  id: 'group2-A',
                  title: 'Group 1',
                  path: 'example_projet.group.openpanel3.group2.group2-A',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-A.logs',
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-A.signals',
                    },
                    {
                      id: 'tracing',
                      title: 'Tracing',
                      withBadge: true, // Default to "Beta" badge
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-A.tracing',
                    },
                  ],
                },
                {
                  id: 'group2-B',
                  title: 'Group 2 (marked as collapsible)',
                  renderAs: 'accordion',
                  path: 'example_projet.group.openpanel3.group2.group2-B',
                  children: [
                    {
                      id: 'logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-B.logs',
                      title: 'Logs',
                    },
                    {
                      id: 'signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-B.signals',
                      title: 'Signals',
                    },
                    {
                      id: 'tracing',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-B.tracing',
                      title: 'Tracing',
                    },
                  ],
                },
                {
                  id: 'group2-C',
                  title: 'Group 3',
                  path: 'example_projet.group.openpanel3.group2.group2-C',
                  children: [
                    {
                      id: 'logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-C.logs',
                      title: 'Logs',
                    },
                    {
                      id: 'signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-C.signals',
                      title: 'Signals',
                    },
                    {
                      id: 'tracing',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel3.group2.group2-C.tracing',
                      title: 'Tracing',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // Panel with nav group title that acts like nav items
          id: 'group.openpanel4',
          title: 'Open panel (4) - sideNavStatus',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel4',
          children: [
            {
              id: 'root',
              path: 'example_projet.group.openpanel4.root',
              title: 'Hidden items',
              children: [
                {
                  id: 'groupAsItem1',
                  title: 'Group renders as "item" (1)',
                  renderAs: 'item',
                  path: 'example_projet.group.openpanel4.root.groupAsItem1',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.groupAsItem1.logs',
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.groupAsItem1.signals',
                    },
                  ],
                },
                {
                  id: 'logs',
                  title: 'Item 2',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel4.root.logs',
                },
                {
                  id: 'logs2',
                  title: 'Item should NOT appear!', // Should not appear
                  sideNavStatus: 'hidden',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel4.root.logs2',
                },
                {
                  title: 'Group should NOT appear!',
                  id: 'logs3',
                  sideNavStatus: 'hidden', // This group should not appear
                  path: 'example_projet.group.openpanel4.root.logs3',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.logs3.logs',
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.logs3.signals',
                    },
                  ],
                },
                {
                  title: 'Group renders as "item" (2)',
                  id: 'group2.renderAsItem',
                  renderAs: 'item',
                  path: 'example_projet.group.openpanel4.root.group2.renderAsItem',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      sideNavStatus: 'hidden',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.group2.renderAsItem.logs',
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      sideNavStatus: 'hidden',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.group2.renderAsItem.signals',
                    },
                    {
                      id: 'tracing',
                      title: 'Tracing',
                      sideNavStatus: 'hidden',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.root.group2.renderAsItem.tracing',
                    },
                  ],
                },
              ],
            },
            // Groups with accordion
            {
              id: 'group2',
              title: 'MANAGEMENT',
              renderAs: 'accordion',
              path: 'example_projet.group.openpanel4.group2',
              children: [
                {
                  id: 'group2-A',
                  title: 'Group 1',
                  path: 'example_projet.group.openpanel4.group2.group2-A',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.group2.group2-A.logs',
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.group2.group2-A.signals',
                    },
                    {
                      id: 'tracing',
                      title: 'Tracing',
                      withBadge: true, // Default to "Beta" badge
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.group2.group2-A.tracing',
                    },
                  ],
                },
                {
                  id: 'root-groupB',
                  path: 'example_projet.group.openpanel4.group2.root-groupB',
                  title: '',
                  children: [
                    {
                      id: 'group2-B',
                      title: 'Group renders as "item" (3)',
                      renderAs: 'item', // This group renders as a normal item
                      path: 'example_projet.group.openpanel4.group2.root-groupB.group2-B',
                      children: [
                        {
                          id: 'logs',
                          title: 'Logs',
                          href: '/app/kibana',
                          path: 'example_projet.group.openpanel4.group2.root-groupB.group2-B.logs',
                        },
                        {
                          id: 'signals',
                          title: 'Signals',
                          href: '/app/kibana',
                          path: 'example_projet.group.openpanel4.group2.root-groupB.group2-B.signals',
                        },
                        {
                          id: 'tracing',
                          title: 'Tracing',
                          href: '/app/kibana',
                          path: 'example_projet.group.openpanel4.group2.root-groupB.group2-B.tracing',
                        },
                      ],
                    },
                  ],
                },
                {
                  id: 'group2-C',
                  title: 'Group 3',
                  path: 'example_projet.group.openpanel4.group2.group2-C',
                  children: [
                    {
                      id: 'logs',
                      title: 'Logs',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.group2.group2-C.logs',
                    },
                    {
                      id: 'groupAsItem',
                      title: 'Yet another group as item',
                      renderAs: 'item',
                      path: 'example_projet.group.openpanel4.group2.group2-C.groupAsItem',
                      children: [
                        {
                          id: 'logs',
                          title: 'Logs',
                          href: '/app/kibana',
                          path: 'example_projet.group.openpanel4.group2.group2-C.groupAsItem.logs',
                        },
                        {
                          id: 'signals',
                          title: 'Signals',
                          href: '/app/kibana',
                          path: 'example_projet.group.openpanel4.group2.group2-C.groupAsItem.signals',
                        },
                      ],
                    },
                    {
                      id: 'signals',
                      title: 'Signals',
                      href: '/app/kibana',
                      path: 'example_projet.group.openpanel4.group2.group2-C.signals',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          // Panel where all children are hidden. The "open panel" icon should NOT
          // appear next to the node title
          id: 'group.openpanel5',
          title: 'Open panel (5) - all children hidden',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel5',
          children: [
            {
              id: 'test1',
              title: 'Test 1',
              sideNavStatus: 'hidden',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel5.test1',
            },
            {
              id: 'test2',
              title: 'Some group',
              path: '',
              children: [
                {
                  id: 'item1',
                  title: 'My first group item',
                  sideNavStatus: 'hidden',
                  href: '/app/kibana',
                  path: 'example_projet.group.openpanel5.test2.item1',
                },
              ],
            },
          ],
        },
        {
          id: 'group.openpanel6',
          title: 'Open panel (custom content)',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel6',
          children: [
            {
              id: 'logs',
              title: 'Logs',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel6.logs',
            },
            {
              id: 'signals',
              title: 'Signals',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel6.signals',
            },
            {
              id: 'tracing',
              title: 'Tracing',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel6.tracing',
            },
          ],
        },
        {
          id: 'group.openpanel7',
          title: 'Open panel (custom title)',
          renderAs: 'panelOpener',
          path: 'example_projet.group.openpanel7',
          children: [
            {
              id: 'logs',
              title: 'Those links',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel7.logs',
            },
            {
              id: 'signals',
              title: 'are automatically',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel7.signals',
            },
            {
              id: 'tracing',
              title: 'generated',
              href: '/app/kibana',
              path: 'example_projet.group.openpanel7.tracing',
            },
          ],
        },
      ],
    },
  ],
};

export const CustomPanelsExample = (args: NavigationServices) => {
  const services = storybookMock.getServices({
    ...args,
    recentlyAccessed$: of([
      { label: 'This is an example', link: '/app/example/39859', id: '39850' },
      { label: 'Another example', link: '/app/example/5235', id: '5235' },
    ]),
  });

  return (
    <NavigationWrapper>
      {({ isCollapsed }) => (
        <NavigationProvider {...services} isSideNavCollapsed={isCollapsed}>
          <Navigation
            navigationTree$={of(navigationTreeWithPanels)}
            panelContentProvider={panelContentProvider}
          />
        </NavigationProvider>
      )}
    </NavigationWrapper>
  );
};

export default {
  title: 'Chrome/Navigation',
  description: 'Navigation container to render items for cross-app linking',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  component: CustomPanelsExample,
} as ComponentMeta<typeof CustomPanelsExample>;

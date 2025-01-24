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

import type { NavigationTreeDefinitionUI } from '@kbn/core-chrome-browser';
import { NavigationWrapper, NavigationStorybookMock } from '../../mocks';
import mdx from '../../README.mdx';
import type { NavigationServices } from '../types';
import { NavigationProvider } from '../services';
import { Navigation } from './navigation';

const storybookMock = new NavigationStorybookMock();

const navigationTreeWithGroups: NavigationTreeDefinitionUI = {
  id: 'es',
  body: [
    // My custom project
    {
      id: 'example_projet',
      title: 'Example project',
      icon: 'logoObservability',
      defaultIsCollapsed: false,
      path: 'example_projet',
      children: [
        {
          id: 'blockGroup',
          path: 'example_projet.blockGroup',
          title: 'Block group',
          children: [
            {
              id: 'item1',
              title: 'Item 1',
              href: '/app/kibana',
              path: 'group1.item1',
            },
            {
              id: 'item2',
              title: 'Item 2',
              href: '/app/kibana',
              path: 'group1.item2',
            },
            {
              id: 'item3',

              title: 'Item 3',
              href: '/app/kibana',
              path: 'group1.item3',
            },
          ],
        },
        {
          id: 'accordionGroup',
          path: 'example_projet.accordionGroup',
          title: 'Accordion group',
          renderAs: 'accordion',
          children: [
            {
              id: 'item1',
              title: 'Item 1',
              href: '/app/kibana',
              path: 'group1.item1',
            },
            {
              id: 'item2',
              title: 'Item 2',
              href: '/app/kibana',
              path: 'group1.item1',
            },
            {
              id: 'item3',
              title: 'Item 3',
              href: '/app/kibana',
              path: 'group1.item1',
            },
          ],
        },
        {
          id: 'groupWithouTitle',
          path: 'example_projet.groupWithouTitle',
          title: '',
          children: [
            {
              id: 'item1',
              title: 'Block group',
              href: '/app/kibana',
              path: 'group1.item1',
            },
            {
              id: 'item2',
              title: 'without',
              href: '/app/kibana',
              path: 'group1.item1',
            },
            {
              id: 'item3',
              title: 'title',
              href: '/app/kibana',
              path: 'group1.item1',
            },
          ],
        },
        {
          id: 'panelGroup',
          href: '/app/kibana',
          title: 'Panel group',
          path: 'example_projet.panelGroup',
          renderAs: 'panelOpener',
          children: [
            {
              id: 'group1',
              title: 'Group 1',
              path: 'panelGroup.group1',
              children: [
                {
                  id: 'logs',
                  href: '/app/kibana',
                  path: 'group1.item1',
                  title: 'Logs',
                },
                {
                  id: 'signals',
                  title: 'Signals',
                  href: '/app/kibana',
                  path: 'group1.item1',
                },
                {
                  id: 'signals-2',
                  title: 'Signals - should NOT appear',
                  href: '/app/kibana',
                  path: 'group1.item1',
                  sideNavStatus: 'hidden', // Should not appear
                },
                {
                  id: 'tracing',
                  title: 'Tracing',
                  href: '/app/kibana',
                  path: 'group1.item1',
                },
              ],
            },
            {
              id: 'group2',
              title: 'Group 2',
              path: 'panelGroup.group2',
              children: [
                {
                  id: 'item1',
                  path: 'panelGroup.group2.item1',
                  href: '/app/kibana',
                  title: 'Some link title',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const GroupsExamples = (args: NavigationServices) => {
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
          <Navigation navigationTree$={of(navigationTreeWithGroups)} />
        </NavigationProvider>
      )}
    </NavigationWrapper>
  );
};

const navigationTreeWithComplexDefinition: NavigationTreeDefinitionUI = {
  id: 'es',
  body: [
    // My custom project
    {
      type: 'recentlyAccessed',
      defaultIsCollapsed: true,
      // Override the default recently accessed items with our own
      recentlyAccessed$: of([
        {
          label: 'My own recent item',
          id: '1234',
          link: '/app/example/39859',
        },
        {
          label: 'I also own this',
          id: '4567',
          link: '/app/example/39859',
        },
      ]),
    },
    {
      id: 'example_projet',
      title: 'Example project',
      icon: 'logoObservability',
      defaultIsCollapsed: false,
      path: 'example_projet',
      children: [
        {
          id: 'item1',
          href: '/app/kibana',
          path: 'example_projet.item1',
          title: 'Get started',
        },
        {
          title: 'Group 1',
          id: 'group1',
          path: 'example_projet.group1',
          children: [
            {
              id: 'item1',
              title: 'Item 1',
              href: '/app/kibana',
              path: 'example_projet.group1.item1',
            },
            {
              id: 'item2',
              title: 'Item 2',
              href: '/app/kibana',
              path: 'example_projet.group1.item1',
            },
            {
              id: 'item3',
              title: 'Item 3',
              href: '/app/kibana',
              path: 'example_projet.group1.item1',
            },
          ],
        },
        {
          id: 'item2',
          title: 'Alerts',
          href: '/app/kibana',
          path: 'example_projet.item2',
        },
        {
          id: 'item2-2',
          title: 'Item should NOT appear!!',
          sideNavStatus: 'hidden', // Should not appear
          href: '/app/kibana',
          path: 'example_projet.item2-2',
        },
        {
          id: 'item3',
          title: 'Some other node',
          href: '/app/kibana',
          path: 'example_projet.item3',
        },
        {
          id: 'group:settingsAsNavItem',
          title: 'Settings as nav Item',
          href: '/app/kibana',
          path: 'example_projet.group:settingsAsNavItem',
          renderAs: 'item', // Render just like any other item, even if it has children
          children: [
            {
              id: 'logs',
              title: 'Logs',
              href: '/app/kibana',
              path: 'example_projet.group:settingsAsNavItem.logs',
            },
            {
              id: 'signals',
              title: 'Signals',
              href: '/app/kibana',
              path: 'example_projet.group:settingsAsNavItem.signals',
            },
            {
              id: 'signalsHidden',
              title: 'Signals - should NOT appear',
              sideNavStatus: 'hidden', // Should not appear
              href: '/app/kibana',
              path: 'example_projet.group:settingsAsNavItem.signalsHidden',
            },
            {
              id: 'tracing',
              title: 'Tracing',
              href: '/app/kibana',
              path: 'example_projet.group:settingsAsNavItem.tracing',
            },
          ],
        },
        {
          id: 'group:settingsAsPanelOpener',
          title: 'Settings panel opener',
          path: 'example_projet.group:settingsAsPanelOpener',
          renderAs: 'panelOpener',
          children: [
            {
              id: 'group1',
              title: 'Group 1',
              path: 'example_projet.group:settingsAsPanelOpener.group1',
              children: [
                {
                  id: 'logs',
                  title: 'Logs',
                  href: '/app/kibana',
                  path: 'example_projet.group:settingsAsPanelOpener.group1.logs',
                },
                {
                  id: 'signals',
                  title: 'Signals',
                  href: '/app/kibana',
                  path: 'example_projet.group:settingsAsPanelOpener.group1.signals',
                },
                {
                  id: 'signals-2',
                  title: 'Signals - should NOT appear',
                  sideNavStatus: 'hidden', // Should not appear
                  href: '/app/kibana',
                  path: 'example_projet.group:settingsAsPanelOpener.group1.signals',
                },
                {
                  id: 'tracing',
                  title: 'Tracing',
                  href: '/app/kibana',
                  path: 'example_projet.group:settingsAsPanelOpener.group1.tracing',
                },
              ],
            },
            {
              id: 'group2',
              title: 'Group 2',
              path: 'example_projet.group:settingsAsPanelOpener.group2',
              children: [
                {
                  id: 'nestedGroup',
                  title: 'Nested group',
                  renderAs: 'item',
                  path: 'example_projet.group:settingsAsPanelOpener.group2.nestedGroup',
                  href: '/app/kibana',
                  children: [
                    {
                      id: 'item1',
                      path: 'example_projet.group:settingsAsPanelOpener.group2.nestedGroup.item1',
                      title: 'Hidden - should NOT appear',
                    },
                  ],
                },
              ],
            },
            {
              id: 'group3',
              title: '',
              path: 'example_projet.group:settingsAsPanelOpener.group3',
              children: [
                {
                  id: 'nestedGroup',
                  title: 'Just an item in a group',
                  path: 'example_projet.group:settingsAsPanelOpener.group3.nestedGroup',
                  href: '/app/kibana',
                },
              ],
            },
          ],
        },
        {
          id: 'group:settingsIsHidden',
          title: 'Settings - should NOT appear', // sideNavStatus is 'hidden'
          sideNavStatus: 'hidden',
          path: 'example_projet.group:settingsIsHidden',
          children: [
            {
              id: 'logs',
              title: 'Logs',
              href: '/app/kibana',
              path: 'example_projet.group:settingsIsHidden.logs',
            },
          ],
        },
        {
          id: 'group:settingsWithChildrenHidden',
          title: 'Settings - should NOT appear', // All children are hidden
          path: 'example_projet.group:settingsWithChildrenHidden',
          children: [
            {
              id: 'logs',
              title: 'Logs',
              sideNavStatus: 'hidden',
              href: '/app/kibana',
              path: 'example_projet.group:settingsWithChildrenHidden.logs',
            },
          ],
        },
      ],
    },
    {
      id: 'linkAtRootLevel',
      title: 'Custom link at root level',
      href: '/app/kibana',
      path: 'linkAtRootLevel',
    },
    {
      id: 'groupRenderAsItem',
      title: 'Test group render as Item',
      renderAs: 'item',
      href: '/app/kibana',
      path: 'groupRenderAsItem',
      children: [
        {
          id: 'item1',
          title: 'Item 1',
          href: '/app/kibana',
          path: 'groupRenderAsItem.item1',
        },
      ],
    },
    {
      id: 'linkAtRootLevelWithIcon',
      icon: 'logoElastic',
      title: 'Link at root level + icon',
      href: '/app/kibana',
      path: 'linkAtRootLevelWithIcon',
    },
  ],
  footer: [
    {
      type: 'recentlyAccessed',
      defaultIsCollapsed: true,
      // Override the default recently accessed items with our own
      recentlyAccessed$: of([
        {
          label: 'My own recent item',
          id: '1234',
          link: '/app/example/39859',
        },
        {
          label: 'I also own this',
          id: '4567',
          link: '/app/example/39859',
        },
      ]),
    },
  ],
};

export const ComplexObjectDefinition = (args: NavigationServices) => {
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
          <Navigation navigationTree$={of(navigationTreeWithComplexDefinition)} />
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
  component: ComplexObjectDefinition,
} as ComponentMeta<typeof ComplexObjectDefinition>;

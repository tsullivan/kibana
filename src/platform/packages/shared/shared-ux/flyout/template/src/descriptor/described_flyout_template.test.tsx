/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FlyoutTemplate } from '../flyout_template';
import { DescribedFlyoutTemplate } from './described_flyout_template';
import type { FlyoutTemplateBodyItem, FlyoutTemplateDescriptor } from './types';

const noop = () => {};

const renderDescribed = (descriptor: FlyoutTemplateDescriptor) =>
  render(<DescribedFlyoutTemplate {...descriptor} />);

describe('DescribedFlyoutTemplate', () => {
  it('renders a body with interleaved content and sections in source order', () => {
    renderDescribed({
      title: 'Interleaved body',
      onClose: noop,
      session: 'never',
      body: [
        { kind: 'content', Content: () => <div>first content</div> },
        {
          kind: 'section',
          title: 'Section A',
          items: [{ kind: 'content', Content: () => <span>section a content</span> }],
        },
        { kind: 'content', Content: () => <div>second content</div> },
        {
          kind: 'section',
          title: 'Section B',
          items: [{ kind: 'content', Content: () => <span>section b content</span> }],
        },
      ],
    });

    const body = screen.getByRole('dialog');
    const order = within(body)
      .getAllByText(/content$/)
      .map((el) => el.textContent);

    expect(order).toEqual([
      'first content',
      'section a content',
      'second content',
      'section b content',
    ]);
    expect(screen.getByRole('heading', { level: 4, name: 'Section A' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Section B' })).toBeInTheDocument();
  });

  it('renders a body of accordions only', () => {
    renderDescribed({
      title: 'Accordion body',
      onClose: noop,
      session: 'never',
      body: [
        {
          kind: 'accordion',
          title: 'Accordion One',
          initialIsOpen: true,
          items: [{ kind: 'content', Content: () => <div>accordion one content</div> }],
        },
        {
          kind: 'accordion',
          title: 'Accordion Two',
          items: [{ kind: 'content', Content: () => <div>accordion two content</div> }],
        },
      ],
    });

    expect(screen.getByText('Accordion One')).toBeInTheDocument();
    expect(screen.getByText('Accordion Two')).toBeInTheDocument();
  });

  it('renders a section containing subsections plus loose content', () => {
    renderDescribed({
      title: 'Section with subsections',
      onClose: noop,
      session: 'never',
      body: [
        {
          kind: 'section',
          title: 'Parent section',
          items: [
            { kind: 'content', Content: () => <div>loose content</div> },
            {
              kind: 'subsection',
              title: 'Subsection One',
              Content: () => <div>subsection one content</div>,
            },
            { kind: 'content', Content: () => <div>trailing content</div> },
          ],
        },
      ],
    });

    expect(screen.getByRole('heading', { level: 4, name: 'Parent section' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: 'Subsection One' })).toBeInTheDocument();
    expect(screen.getByText('loose content')).toBeInTheDocument();
    expect(screen.getByText('subsection one content')).toBeInTheDocument();
    expect(screen.getByText('trailing content')).toBeInTheDocument();
  });

  it('renders tabbed mode uncontrolled, honoring defaultSelectedTabId and firing onTabChange', async () => {
    const onTabChange = jest.fn();
    renderDescribed({
      title: 'Tabbed flyout',
      onClose: noop,
      session: 'never',
      defaultSelectedTabId: 'tab2',
      onTabChange,
      tabs: [
        {
          id: 'tab1',
          label: 'Tab 1',
          items: [{ kind: 'content', Content: () => <div>tab 1 content</div> }],
        },
        {
          id: 'tab2',
          label: 'Tab 2',
          items: [{ kind: 'content', Content: () => <div>tab 2 content</div> }],
        },
      ],
    });

    expect(screen.getByRole('tab', { name: 'Tab 2', selected: true })).toBeInTheDocument();
    expect(screen.getByText('tab 2 content')).toBeInTheDocument();
    expect(screen.queryByText('tab 1 content')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('tab', { name: 'Tab 1' }));

    expect(onTabChange).toHaveBeenCalledWith('tab1');
    expect(screen.getByText('tab 1 content')).toBeInTheDocument();
  });

  it('renders header badges, meta blocks, and info blocks', () => {
    renderDescribed({
      title: 'Header parts',
      onClose: noop,
      session: 'never',
      header: {
        badges: [{ children: 'Urgent' }],
        metaBlocks: [{ title: 'Owner', Content: () => <>Platform</> }],
        infoBlocks: [{ title: 'Risk score', Content: () => <>90</> }],
      },
      body: [{ kind: 'content', Content: () => <div>content</div> }],
    });

    expect(screen.getByText('Urgent')).toBeInTheDocument();
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Platform')).toBeInTheDocument();
    expect(screen.getByText('Risk score')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('renders both footer actions', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    renderDescribed({
      title: 'Footer actions',
      onClose: noop,
      session: 'never',
      body: [{ kind: 'content', Content: () => <div>content</div> }],
      footer: {
        primaryAction: { label: 'Save', onClick: onPrimary },
        secondaryAction: { label: 'Cancel', onClick: onSecondary },
      },
    });

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  it('renders nothing for a Content component that itself returns a template part', () => {
    renderDescribed({
      title: 'Part inside a content slot',
      onClose: noop,
      session: 'never',
      body: [
        {
          kind: 'content',
          Content: () => (
            <FlyoutTemplate.Body.Section title="Should not render">
              nested part content
            </FlyoutTemplate.Body.Section>
          ),
        },
      ],
    });

    expect(screen.queryByText('nested part content')).not.toBeInTheDocument();
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
  });
});

describe('descriptor type safety (compile-time only)', () => {
  it('rejects invalid descriptor shapes at compile time', () => {
    // Never called: this function exists only so `tsc` type-checks the bodies below,
    // each guarded by an `@ts-expect-error` on the line that must fail to compile.
    const invalidDescriptors = () => {
      // @ts-expect-error `body` and `tabs` are mutually exclusive.
      const bodyAndTabs: FlyoutTemplateDescriptor = {
        title: 'Test',
        onClose: noop,
        body: [],
        tabs: [{ id: 'tab1', label: 'Tab 1', items: [] }],
      };

      // @ts-expect-error `defaultSelectedTabId` is only valid alongside `tabs`.
      const defaultTabIdWithBody: FlyoutTemplateDescriptor = {
        title: 'Test',
        onClose: noop,
        body: [],
        defaultSelectedTabId: 'tab1',
      };

      const topLevelSubsection: FlyoutTemplateBodyItem[] = [
        // @ts-expect-error `kind: 'subsection'` is only valid inside a section/accordion's `items`.
        { kind: 'subsection', title: 'Nope', Content: () => null },
      ];

      const nestedSection: FlyoutTemplateBodyItem[] = [
        {
          kind: 'section',
          title: 'Outer',
          items: [
            // @ts-expect-error `kind: 'section'` cannot appear inside another section's `items`.
            { kind: 'section', title: 'Inner', items: [] },
          ],
        },
      ];

      return { bodyAndTabs, defaultTabIdWithBody, topLevelSubsection, nestedSection };
    };

    expect(typeof invalidDescriptors).toBe('function');
  });
});

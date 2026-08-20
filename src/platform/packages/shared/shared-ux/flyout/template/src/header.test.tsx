/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { act, render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EuiLink } from '@elastic/eui';
import { KibanaErrorBoundaryProvider } from '@kbn/shared-ux-error-boundary';
import { FlyoutTemplate } from './flyout_template';

const noop = () => {};

const WithErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <KibanaErrorBoundaryProvider>{children}</KibanaErrorBoundaryProvider>
);

const renderTemplate = (ui: React.ReactElement) => render(ui, { wrapper: WithErrorBoundary });

/** Minimal body used across header-focused tests. */
const minimalBody = (
  <FlyoutTemplate.Body>
    <span>content</span>
  </FlyoutTemplate.Body>
);

describe('FlyoutTemplate header', () => {
  it('renders the header title as an H3', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" />
        {minimalBody}
      </FlyoutTemplate>
    );

    const title = screen.getByRole('heading', { level: 3, name: 'Alert details' });
    expect(title).toBeInTheDocument();
  });

  it('assigns a generated id to the visible header title for flyout labeling', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" aria-label="Hidden override">
        <FlyoutTemplate.Header title="Alert details" />
        {minimalBody}
      </FlyoutTemplate>
    );

    const title = screen.getByRole('heading', { level: 3, name: 'Alert details' });
    expect(title.id).toMatch(/^flyoutTemplateTitle/);
  });

  it('renders Header.InfoBlock parts via the info blocks layout', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.InfoBlock title="Owner">Security</FlyoutTemplate.Header.InfoBlock>
          <FlyoutTemplate.Header.InfoBlock title="Risk score">90</FlyoutTemplate.Header.InfoBlock>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
    expect(screen.getByText('Risk score')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getAllByTestId('infoBlock')).toHaveLength(2);
  });

  it('renders no info blocks layout when the header has no InfoBlock parts', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="No info blocks" />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.queryByTestId('infoBlock')).not.toBeInTheDocument();
  });
});

describe('FlyoutTemplate header title icon and description', () => {
  it('renders a decorative title icon when no tooltip is given', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" titleIcon="warning" />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(container.querySelector('[data-euiicon-type="warning"]')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
    expect(container.querySelector('.euiToolTipAnchor')).toBeNull();
  });

  it('renders the title icon as a focusable tooltip anchor, defaulting to the info icon', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" titleTooltip="Extra context" />
        {minimalBody}
      </FlyoutTemplate>
    );

    const anchor = container.querySelector('.euiToolTipAnchor');
    expect(anchor).not.toBeNull();
    expect(anchor?.querySelector('[data-euiicon-type="info"]')).toHaveAttribute('tabindex', '0');
  });

  it('keeps the generated title id on the heading when a title icon is present', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" titleIcon="info" />
        {minimalBody}
      </FlyoutTemplate>
    );

    const heading = screen.getByRole('heading', { level: 3, name: 'Alert details' });
    expect(heading.id).toMatch(/^flyoutTemplateTitle/);
  });

  it('renders no title icon by default', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(container.querySelector('[data-euiicon-type]')).toBeNull();
  });

  it('renders the description below the title', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" description="Mar 30, 2022 @ 10:01:21.313" />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('Mar 30, 2022 @ 10:01:21.313')).toBeInTheDocument();
  });

  it('does not wrap the description in a paragraph, so block content stays valid', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header
          title="Alert details"
          description={<div data-test-subj="blockDescription">block content</div>}
        />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('blockDescription').closest('p')).toBeNull();
  });

  it('omits the description when it resolves falsy', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="myFlyout">
        <FlyoutTemplate.Header title="Alert details" description={false && 'hidden'} />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('myFlyoutHeader').textContent).toBe('Alert details');
  });
});

describe('FlyoutTemplate header metadata', () => {
  it('renders key-value pairs on a single line below the title', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.MetaBlock title="Last updated">
            Dec 3, 2025
          </FlyoutTemplate.Header.MetaBlock>
          <FlyoutTemplate.Header.MetaBlock title="Owner">Platform</FlyoutTemplate.Header.MetaBlock>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('Last updated')).toBeInTheDocument();
    expect(screen.getAllByText('Dec 3, 2025')).not.toHaveLength(0);
    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getAllByText('Platform')).not.toHaveLength(0);
  });

  it('accepts rich value content such as links', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.MetaBlock title="Last updated by">
            <EuiLink href="/profile">name@elastic.co</EuiLink>
          </FlyoutTemplate.Header.MetaBlock>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByRole('link', { name: 'name@elastic.co' })).toHaveAttribute(
      'href',
      '/profile'
    );
  });

  it('renders no metadata row when the header has no Metadata parts', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="myFlyout">
        <FlyoutTemplate.Header title="Alert details" />
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('myFlyoutHeader').textContent).toBe('Alert details');
  });

  it('keeps Metadata parts out of the info blocks layout', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.MetaBlock title="Owner">Platform</FlyoutTemplate.Header.MetaBlock>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.queryByTestId('infoBlock')).not.toBeInTheDocument();
  });
});

describe('FlyoutTemplate header badges', () => {
  const badgeParts = (ids: string[]) =>
    ids.map((id) => (
      <FlyoutTemplate.Header.Badge key={id}>{`badge ${id}`}</FlyoutTemplate.Header.Badge>
    ));

  it('renders every badge when at or below the visible maximum', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          {badgeParts(['a', 'b', 'c', 'd', 'e'])}
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('badge e')).toBeInTheDocument();
    expect(screen.queryByText(/more$/)).toBeNull();
  });

  it('collapses past the visible maximum into an overflow badge', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          {badgeParts(['a', 'b', 'c', 'd', 'e', 'f'])}
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('badge d')).toBeInTheDocument();
    expect(screen.queryByText('badge e')).toBeNull();
    expect(screen.getByText('+2 more')).toBeInTheDocument();
  });

  it('reveals the collapsed badges from the overflow popover', async () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          {badgeParts(['a', 'b', 'c', 'd', 'e', 'f'])}
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    await userEvent.click(screen.getByText('+2 more'));

    expect(screen.getByText('badge e')).toBeInTheDocument();
    expect(screen.getByText('badge f')).toBeInTheDocument();
  });

  it('forwards color, icon, and test subject to the badge', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.Badge color="warning" iconType="warning" data-test-subj="urgency">
            Urgency
          </FlyoutTemplate.Header.Badge>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    const badge = screen.getByTestId('urgency');
    expect(badge).toHaveTextContent('Urgency');
    expect(container.querySelector('[data-euiicon-type="warning"]')).toBeInTheDocument();
  });

  it('ignores conditional badges that resolve falsy', () => {
    const showBadge = false;
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.Badge>visible badge</FlyoutTemplate.Header.Badge>
          {showBadge && <FlyoutTemplate.Header.Badge>hidden badge</FlyoutTemplate.Header.Badge>}
          {showBadge && <FlyoutTemplate.Header.Badge>hidden badge 2</FlyoutTemplate.Header.Badge>}
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByText('visible badge')).toBeInTheDocument();
    expect(screen.queryByText(/more$/)).toBeNull();
  });

  it('renders no badge group when every badge resolves falsy', () => {
    const showBadge = false;
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="myFlyout">
        <FlyoutTemplate.Header title="Alert details">
          {showBadge && <FlyoutTemplate.Header.Badge>hidden badge</FlyoutTemplate.Header.Badge>}
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('myFlyoutHeader').textContent).toBe('Alert details');
  });

  it('renders badges between the metadata row and the info blocks', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="myFlyout">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.InfoBlock title="Owner">Platform</FlyoutTemplate.Header.InfoBlock>
          <FlyoutTemplate.Header.Badge>Urgency</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.MetaBlock title="Last updated">
            Dec 3, 2025
          </FlyoutTemplate.Header.MetaBlock>
        </FlyoutTemplate.Header>
        {minimalBody}
      </FlyoutTemplate>
    );

    // Declaration order is irrelevant; the header owns the layout.
    // MetaBlock string values render twice in the DOM (hidden sizer + visible text).
    expect(screen.getByTestId('myFlyoutHeader').textContent).toBe(
      'Alert detailsLast updatedDec 3, 2025Dec 3, 2025UrgencyOwnerPlatform'
    );
  });
});

describe('FlyoutTemplate header collapse on scroll', () => {
  let resizeObservers: Array<{
    callback: ResizeObserverCallback;
    observe: jest.Mock;
  }>;

  beforeEach(() => {
    resizeObservers = [];
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });
    global.ResizeObserver = jest.fn().mockImplementation((cb: ResizeObserverCallback) => {
      const observer = { callback: cb, observe: jest.fn() };
      resizeObservers.push(observer);
      return { observe: observer.observe, unobserve: jest.fn(), disconnect: jest.fn() };
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** The element the hook measures: the inner div of the collapsible region. */
  const collapsibleInner = () =>
    screen.getByTestId('flyoutHeaderCollapsibleRegion').firstElementChild as HTMLElement;

  const expandedTitleRow = () =>
    screen.getByTestId('flyoutHeaderCollapsibleRegion').previousElementSibling as HTMLElement;

  const expandedSpacer = () =>
    screen.getByTestId('flyoutHeaderCollapsibleRegion').nextElementSibling as HTMLElement;

  const fireResizeFor = (node: HTMLElement, entries: ResizeObserverEntry[] = []) => {
    const observer = resizeObservers.find(({ observe }) =>
      observe.mock.calls.some(([observedNode]) => observedNode === node)
    );
    if (!observer) throw new Error('No ResizeObserver found for node');
    act(() => {
      observer.callback(entries, null!);
    });
  };

  /** Give every shrinking header part a natural height so the hook can budget for the full change. */
  const primeCollapseBudget = ({
    collapsibleHeight = 200,
    titleHeight = 28,
    spacerHeight = 16,
  }: {
    collapsibleHeight?: number;
    titleHeight?: number;
    spacerHeight?: number;
  } = {}) => {
    const measurements = [
      [collapsibleInner(), collapsibleHeight],
      [expandedTitleRow(), titleHeight],
      [expandedSpacer(), spacerHeight],
    ] as const;
    for (const [node, height] of measurements) {
      Object.defineProperty(node, 'scrollHeight', {
        get: () => height,
        configurable: true,
      });
      fireResizeFor(node);
    }
  };

  const setScrollState = (
    el: HTMLElement,
    opts: { scrollTop: number; scrollHeight: number; clientHeight: number }
  ) => {
    Object.defineProperty(el, 'scrollTop', { get: () => opts.scrollTop, configurable: true });
    Object.defineProperty(el, 'scrollHeight', { get: () => opts.scrollHeight, configurable: true });
    Object.defineProperty(el, 'clientHeight', { get: () => opts.clientHeight, configurable: true });
  };

  /** Flyout with every collapsible part present; body overflows by a comfortable margin when scrolled. */
  const renderCollapsibleFlyout = () =>
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Long title" description="A timestamp">
          <FlyoutTemplate.Header.MetaBlock title="Key">Value</FlyoutTemplate.Header.MetaBlock>
          <FlyoutTemplate.Header.Badge>Tag A</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.Badge>Tag B</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.Badge>Tag C</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.InfoBlock title="Score">90</FlyoutTemplate.Header.InfoBlock>
          <FlyoutTemplate.Header.Tab id="tab1" label="Tab 1" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="tab1">
            <FlyoutTemplate.Body.Section title="Section">content</FlyoutTemplate.Body.Section>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

  it('hides the collapsible region when scrolled past the threshold', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    expect(region).not.toHaveAttribute('aria-hidden');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).toHaveAttribute('aria-hidden', 'true');
  });

  it('keeps the title heading visible with its id in collapsed state', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    const heading = screen.getByRole('heading', { name: 'Long title' });
    expect(heading).toBeInTheDocument();
    expect(heading.id).toMatch(/^flyoutTemplateTitle/);
  });

  it('keeps the tab bar visible in collapsed state', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(screen.getByRole('tab', { name: 'Tab 1' })).toBeInTheDocument();
  });

  it('does not show badges in the collapsed title row', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    // Badges are now only in the aria-hidden collapsible region; the collapsed title row has none.
    // 3 badges < MAX_VISIBLE_BADGES so no overflow badge exists anywhere in the tree.
    expect(screen.queryByText(/^\+\d+ more$/)).toBeNull();
  });

  it('stays expanded when the body does not overflow enough to cover the collapse budget', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    // 210 < collapsible(200) + title(28) + spacer(16) + EXPAND_AT(4) = 248.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 610, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).not.toHaveAttribute('aria-hidden');
  });

  it('includes a wrapped title and no-tab spacer in the collapse budget', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="A title that wraps onto two lines" description="Context" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Section">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget({ titleHeight: 56 });
    // 247 clears the old inner-only guard (200 + 16), but not the complete 276px budget.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 647, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).not.toHaveAttribute('aria-hidden');
  });

  it('expands when scrolled back to the top', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');

    setScrollState(overflowEl, { scrollTop: 0, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).not.toHaveAttribute('aria-hidden');
  });

  it('does not collapse when scrollTop is within the hysteresis band while expanded', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    // scrollTop = 8 is between EXPAND_AT(4) and COLLAPSE_AT(16); header stays expanded.
    setScrollState(overflowEl, { scrollTop: 8, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).not.toHaveAttribute('aria-hidden');
  });

  it('does not expand when scrollTop is within the hysteresis band while collapsed', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');

    // scrollTop = 8 is above EXPAND_AT(4); header stays collapsed.
    setScrollState(overflowEl, { scrollTop: 8, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');
  });

  it('stays collapsed when collapsing consumes the overflow that allowed it', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    // Expanded: 1000 - 700 = 300 > collapse budget 248, so collapse is allowed.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 700 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');

    // Collapsing handed the freed header space to the body: 1000 - 900 = 100 now fails that guard.
    // Applying it again here would expand, which restores the old geometry and collapses again.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 900 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');
  });

  it('ignores the region heights reported while the collapse animation is running', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    primeCollapseBudget();
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).toHaveAttribute('aria-hidden', 'true');

    // The animation shrinks the region toward zero, reporting heights that are not the region's own.
    fireResizeFor(collapsibleInner(), [{ contentRect: { height: 40 } } as ResizeObserverEntry]);

    setScrollState(overflowEl, { scrollTop: 0, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).not.toHaveAttribute('aria-hidden');

    // Overflow 210 clears a budget based on the animated 40, but not the true 200px region.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 610, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });
    expect(region).not.toHaveAttribute('aria-hidden');
  });

  it('collapses a header whose only shrinking parts are the title row and spacer', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Bare title" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="S">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    // An empty region still leaves a budget, because the title row and spacer shrink on their own.
    primeCollapseBudget({ collapsibleHeight: 0 });
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).toHaveAttribute('aria-hidden', 'true');
  });

  it('stays expanded until the shrinking parts have been measured', () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const region = screen.getByTestId('flyoutHeaderCollapsibleRegion');

    // Without a measured budget there is nothing to judge the collapse against.
    setScrollState(overflowEl, { scrollTop: 20, scrollHeight: 1000, clientHeight: 400 });
    act(() => {
      fireEvent.scroll(overflowEl);
    });

    expect(region).not.toHaveAttribute('aria-hidden');
  });

  /** Renders the flyout and returns the header element plus a mock for the scroller's scrollBy. */
  const setUpWheelForwarding = () => {
    renderCollapsibleFlyout();
    const overflowEl = screen.getByTestId('euiFlyoutBodyOverflow');
    const headerEl = document.querySelector('.euiFlyoutHeader') as HTMLElement;
    const scrollBy = jest.fn();
    Object.defineProperty(overflowEl, 'scrollBy', { value: scrollBy, configurable: true });
    // Page mode multiplies by the viewport height.
    Object.defineProperty(overflowEl, 'clientHeight', { value: 400, configurable: true });
    return { headerEl, scrollBy };
  };

  it('forwards pixel-mode wheel events on the header to the body scroll container', () => {
    const { headerEl, scrollBy } = setUpWheelForwarding();

    act(() => {
      fireEvent.wheel(headerEl, { deltaY: 50, deltaMode: 0 });
    });

    expect(scrollBy).toHaveBeenCalledWith({ top: 50 });
  });

  it('converts line-mode wheel deltas to pixels', () => {
    const { headerEl, scrollBy } = setUpWheelForwarding();

    // Firefox reports a tick as 3 lines; forwarding the raw 3 would barely move the body.
    act(() => {
      fireEvent.wheel(headerEl, { deltaY: 3, deltaMode: 1 });
    });

    expect(scrollBy).toHaveBeenCalledWith({ top: 48 });
  });

  it('converts page-mode wheel deltas using the scroller viewport height', () => {
    const { headerEl, scrollBy } = setUpWheelForwarding();

    act(() => {
      fireEvent.wheel(headerEl, { deltaY: 1, deltaMode: 2 });
    });

    expect(scrollBy).toHaveBeenCalledWith({ top: 400 });
  });

  it('prevents the default wheel action so the page behind does not scroll too', () => {
    const { headerEl } = setUpWheelForwarding();

    let notCancelled = true;
    act(() => {
      notCancelled = fireEvent.wheel(headerEl, { deltaY: 50 });
    });

    expect(notCancelled).toBe(false);
  });
});

describe('FlyoutTemplate Header collapsed prop', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderCollapsedHeader = () =>
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Compact title" collapsed>
          <FlyoutTemplate.Header.Badge>Alpha</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.Badge>Beta</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.Badge>Gamma</FlyoutTemplate.Header.Badge>
          <FlyoutTemplate.Header.Tab id="tab1" label="Overview" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="tab1">
            <FlyoutTemplate.Body.Section title="Section">content</FlyoutTemplate.Body.Section>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

  it('renders the title as a compact xs heading with its id regardless of scroll', () => {
    renderCollapsedHeader();
    const heading = screen.getByRole('heading', { name: 'Compact title' });
    expect(heading.tagName).toBe('H3');
    expect(heading.id).toMatch(/^flyoutTemplateTitle/);
  });

  it('does not show badges in the compact title row', () => {
    renderCollapsedHeader();
    // Badges live only in the aria-hidden collapsible region; the compact title row is badge-free.
    // 3 badges < MAX_VISIBLE_BADGES so no overflow badge exists anywhere in the tree.
    expect(screen.queryByText(/^\+\d+ more$/)).toBeNull();
  });

  it('renders the tab bar', () => {
    renderCollapsedHeader();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
  });

  it('hides the collapsible region immediately without needing a scroll', () => {
    renderCollapsedHeader();
    expect(screen.getByTestId('flyoutHeaderCollapsibleRegion')).toHaveAttribute(
      'aria-hidden',
      'true'
    );
  });

  it('puts the title string on the heading title attribute for native tooltip', () => {
    renderCollapsedHeader();
    const heading = screen.getByRole('heading', { name: 'Compact title' });
    expect(heading).toHaveAttribute('title', 'Compact title');
  });

  /** Records which elements a `scroll` listener gets attached to during `render`. */
  const trackScrollListenerTargets = (renderFlyout: () => void): HTMLElement[] => {
    const targets: HTMLElement[] = [];
    const original = HTMLElement.prototype.addEventListener;
    jest
      .spyOn(HTMLElement.prototype, 'addEventListener')
      .mockImplementation(function (this: HTMLElement, type, listener, options) {
        if (type === 'scroll') targets.push(this);
        original.call(this, type, listener, options);
      });
    renderFlyout();
    return targets.filter((el) => el.classList.contains('euiFlyoutBody__overflow'));
  };

  it('does not attach a scroll listener to the body overflow container', () => {
    expect(trackScrollListenerTargets(renderCollapsedHeader)).toHaveLength(0);
  });

  it('attaches a scroll listener when the header is not permanently collapsed', () => {
    // Positive control: proves the assertion above is not passing for an unrelated reason.
    const targets = trackScrollListenerTargets(() =>
      renderTemplate(
        <FlyoutTemplate onClose={noop} session="never">
          <FlyoutTemplate.Header title="Compact title" />
          <FlyoutTemplate.Body>
            <FlyoutTemplate.Body.Section title="Section">content</FlyoutTemplate.Body.Section>
          </FlyoutTemplate.Body>
        </FlyoutTemplate>
      )
    );

    expect(targets.length).toBeGreaterThan(0);
  });
});

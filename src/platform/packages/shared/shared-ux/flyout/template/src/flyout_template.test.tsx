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
import { KbnInfoCallout } from '@kbn/ui-callout';
import { FlyoutTemplate } from './flyout_template';

const noop = () => {};

/**
 * The zones render inside `EuiFlyout` regardless of session mode. Tests use
 * `session="never"` to render as a standard (unmanaged) flyout, which avoids
 * needing an `EuiFlyoutManager` provider while still exercising all of the
 * template's zone parsing, ordering, validation, and rendering logic.
 */
const renderTemplate = (ui: React.ReactElement) => render(ui);

describe('FlyoutTemplate', () => {
  it('renders header, body, and footer zones', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="myFlyout">
        <FlyoutTemplate.Header title="Service inventory" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">
            <span>summary content</span>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
        <FlyoutTemplate.Footer>
          <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={noop} />
        </FlyoutTemplate.Footer>
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('myFlyoutHeader')).toBeInTheDocument();
    expect(screen.getByTestId('myFlyoutBody')).toBeInTheDocument();
    expect(screen.getByTestId('myFlyoutFooter')).toBeInTheDocument();
    expect(screen.getByText('summary content')).toBeInTheDocument();
  });

  it('renders the header title as an H3', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const title = screen.getByRole('heading', { level: 3, name: 'Alert details' });
    expect(title).toBeInTheDocument();
  });

  it('renders Header.InfoBlock parts via the info blocks layout', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert details">
          <FlyoutTemplate.Header.InfoBlock title="Owner">Security</FlyoutTemplate.Header.InfoBlock>
          <FlyoutTemplate.Header.InfoBlock title="Risk score">90</FlyoutTemplate.Header.InfoBlock>
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
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
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.queryByTestId('infoBlock')).not.toBeInTheDocument();
  });

  it('accepts resizable/minWidth/onResize/ownFocus/onActive without altering zone rendering', () => {
    // These are pure passthrough props forwarded as-is to `EuiFlyout` (verified
    // by the `Resizable` story against the real component); this test guards
    // against the template's own rendering breaking when they're supplied.
    const onResize = jest.fn();
    const onActive = jest.fn();
    renderTemplate(
      <FlyoutTemplate
        onClose={noop}
        session="never"
        resizable
        minWidth={400}
        onResize={onResize}
        ownFocus={false}
        onActive={onActive}
        data-test-subj="resizableFlyout"
      >
        <FlyoutTemplate.Header title="Resizable" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByTestId('resizableFlyoutHeader')).toBeInTheDocument();
    expect(screen.getByTestId('resizableFlyoutBody')).toBeInTheDocument();
    expect(screen.getByText('content')).toBeInTheDocument();
    expect(onResize).not.toHaveBeenCalled();
    expect(onActive).not.toHaveBeenCalled();
  });

  it('renders section titles as H4', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Summary' })).toBeInTheDocument();
  });

  it('renders a divider between sections, none after the last', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="One">one</FlyoutTemplate.Body.Section>
          <FlyoutTemplate.Body.Section title="Two">two</FlyoutTemplate.Body.Section>
          <FlyoutTemplate.Body.Section title="Three">three</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Three sections → two dividers (none below the last).
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(2);
  });

  it('renders no divider for a single section', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(0);
  });

  it('does not wrap section content in an outlined box by default', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">
            <span>plain content</span>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByText('plain content').closest('.euiPanel')).toBeNull();
  });

  it('wraps section content in an outlined box when hasBorder is set', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary" hasBorder>
            <span>boxed content</span>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const panel = screen.getByText('boxed content').closest('.euiPanel');
    expect(panel).toBeInTheDocument();
    // The box wraps only the content; the title stays outside it (same as Accordion).
    expect(panel).not.toContainElement(screen.getByRole('heading', { level: 4, name: 'Summary' }));
  });

  it('renders a section icon next to the title', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary" icon="info">
            content
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(container.querySelector('[data-euiicon-type="info"]')).toBeInTheDocument();
  });

  it('renders a section action link on the title row', async () => {
    const onClick = jest.fn();
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary" action={{ label: 'Extra action', onClick }}>
            content
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const link = screen.getByRole('button', { name: 'Extra action' });
    await userEvent.click(link);
    expect(onClick).toHaveBeenCalled();
  });

  it('is valid without a header (body is the only required zone)', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByText('content')).toBeInTheDocument();
    expect(warn).not.toHaveBeenCalledWith('[FlyoutTemplate] A <FlyoutTemplate.Body> is required.');
    warn.mockRestore();
  });

  it('warns in development when the body zone is missing', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="No body here" />
      </FlyoutTemplate>
    );

    expect(warn).toHaveBeenCalledWith('[FlyoutTemplate] A <FlyoutTemplate.Body> is required.');
    warn.mockRestore();
  });

  it('preserves JSX order between sections and passthrough children in the body', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="ordered">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="First">
            <span>first section</span>
          </FlyoutTemplate.Body.Section>
          <KbnInfoCallout title="Data is delayed" />
          <FlyoutTemplate.Body.Section title="Second">
            <span>second section</span>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const body = screen.getByTestId('orderedBody');
    const text = body.textContent ?? '';
    expect(text.indexOf('first section')).toBeLessThan(text.indexOf('Data is delayed'));
    expect(text.indexOf('Data is delayed')).toBeLessThan(text.indexOf('second section'));
  });

  it('renders the primary action to the right of the secondary action', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="withFooter">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
        <FlyoutTemplate.Footer>
          <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={noop} />
          <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={noop} />
        </FlyoutTemplate.Footer>
      </FlyoutTemplate>
    );

    const footer = screen.getByTestId('withFooterFooter');
    const text = footer.textContent ?? '';
    expect(text.indexOf('Discard')).toBeLessThan(text.indexOf('Save'));
    expect(within(footer).getByText('Save')).toBeInTheDocument();
    expect(within(footer).getByText('Discard')).toBeInTheDocument();
  });

  it('does not render a footer when it has no actions, and adds no default Cancel button', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="noFooter">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
        <FlyoutTemplate.Footer />
      </FlyoutTemplate>
    );

    expect(screen.queryByTestId('noFooterFooter')).not.toBeInTheDocument();
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('warns and renders only the first zone when a singleton zone is duplicated', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="First title" />
        <FlyoutTemplate.Header title="Second title" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(warn).toHaveBeenCalledWith(
      '[FlyoutTemplate] Multiple <FlyoutTemplate.header> zones provided; rendering only the first.'
    );
    expect(screen.getByRole('heading', { level: 3, name: 'First title' })).toBeInTheDocument();
    expect(screen.queryByText('Second title')).not.toBeInTheDocument();
    warn.mockRestore();
  });

  it('declarative zone components render nothing on their own', () => {
    const { container } = render(
      <div>
        <FlyoutTemplate.Header title="orphan" />
        <FlyoutTemplate.Footer.PrimaryAction label="orphan" onClick={noop} />
      </div>
    );
    expect(container.firstChild).toBeEmptyDOMElement();
  });
});

describe('FlyoutTemplate tabs', () => {
  const renderWithTabs = (ui: React.ReactElement) => render(ui);

  it('renders a tab bar with correct roles', () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tabpanel')).toBeInTheDocument();
  });

  it('selects the first tab by default (uncontrolled)', () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('overview content')).toBeInTheDocument();
    expect(screen.queryByText('metadata content')).not.toBeInTheDocument();
  });

  it('respects defaultSelectedTabId (uncontrolled)', () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert" defaultSelectedTabId="metadata">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('metadata content')).toBeInTheDocument();
  });

  it('switches panel on tab click (uncontrolled)', async () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Metadata' }));

    expect(screen.getByText('metadata content')).toBeInTheDocument();
    expect(screen.queryByText('overview content')).not.toBeInTheDocument();
  });

  it('calls onTabChange and respects selectedTabId in controlled mode', async () => {
    const onTabChange = jest.fn();
    const { rerender } = renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert" selectedTabId="overview" onTabChange={onTabChange}>
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    await userEvent.click(screen.getByRole('tab', { name: 'Metadata' }));
    expect(onTabChange).toHaveBeenCalledWith('metadata');
    // Panel has not switched because the consumer drives the value.
    expect(screen.getByText('overview content')).toBeInTheDocument();

    // Consumer updates the controlled value.
    rerender(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert" selectedTabId="metadata" onTabChange={onTabChange}>
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            <span>metadata content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByText('metadata content')).toBeInTheDocument();
    expect(screen.queryByText('overview content')).not.toBeInTheDocument();
  });

  it('wires a11y ids between tab and panel', () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const tab = screen.getByRole('tab', { name: 'Overview' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('id', 'overview');
    expect(panel).toHaveAttribute('aria-labelledby', 'overview');
    expect(panel).toHaveAttribute('id', 'tabpanel-overview');
  });

  it('warns and does not render top-level Section in tabbed mode', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Orphan section">
            <span>orphan content</span>
          </FlyoutTemplate.Body.Section>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('Top-level Body.Section and passthrough children are not rendered')
    );
    expect(screen.queryByText('orphan content')).not.toBeInTheDocument();
    warn.mockRestore();
  });

  it('renders header and body unchanged when no tabs are declared', () => {
    renderWithTabs(
      <FlyoutTemplate onClose={noop} session="never" data-test-subj="noTabs">
        <FlyoutTemplate.Header title="No tabs" />
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">
            <span>summary content</span>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.getByText('summary content')).toBeInTheDocument();
  });
});

describe('FlyoutTemplate accordions', () => {
  it('wraps only the accordion content in an outlined box, not the title', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="Overview" initialIsOpen>
            <span>overview content</span>
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const title = screen.getByRole('button', { name: /Overview/ });
    expect(title).toBeInTheDocument();
    // Content is wrapped in an outlined box; the title stays outside it.
    const panel = screen.getByText('overview content').closest('.euiPanel');
    expect(panel).toBeInTheDocument();
    expect(panel).not.toContainElement(title);
  });

  it('renders a divider below each closed accordion except the last', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="One">one</FlyoutTemplate.Body.Accordion>
          <FlyoutTemplate.Body.Accordion title="Two">two</FlyoutTemplate.Body.Accordion>
          <FlyoutTemplate.Body.Accordion title="Three">three</FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Three closed accordions → two dividers (none below the last).
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(2);
  });

  it('hides the divider below an accordion while it is open', async () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="One">one</FlyoutTemplate.Body.Accordion>
          <FlyoutTemplate.Body.Accordion title="Two">two</FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Two closed accordions → one divider below the first.
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(1);

    // Opening the first accordion hides its divider.
    await userEvent.click(screen.getByRole('button', { name: /One/ }));
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(0);
  });

  it('toggles the accordion open on click', async () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="Overview">
            <span>overview content</span>
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const button = screen.getByRole('button', { name: /Overview/ });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('renders an accordion action as the extra action', async () => {
    const onClick = jest.fn();
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion
            title="Overview"
            action={{ label: 'Extra action', onClick }}
          >
            content
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    await userEvent.click(screen.getByRole('button', { name: 'Extra action' }));
    expect(onClick).toHaveBeenCalled();
  });

  it('warns in development when a body mixes Section and Accordion', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(noop);
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Summary">content</FlyoutTemplate.Body.Section>
          <FlyoutTemplate.Body.Accordion title="Details">details</FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(warn).toHaveBeenCalledWith(
      '[FlyoutTemplate] A body uses either Body.Section or Body.Accordion, not both.'
    );
    warn.mockRestore();
  });
});

describe('FlyoutTemplate subsections', () => {
  it('renders subsection titles as H5 inside a Section', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Overview">
            <FlyoutTemplate.Body.Section.Subsection title="Host">
              <span>host content</span>
            </FlyoutTemplate.Body.Section.Subsection>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByRole('heading', { level: 4, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 5, name: 'Host' })).toBeInTheDocument();
    expect(screen.getByText('host content')).toBeInTheDocument();
  });

  it('separates Section subsections with horizontal rules, none after the last', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Overview">
            <FlyoutTemplate.Body.Section.Subsection title="One">
              one
            </FlyoutTemplate.Body.Section.Subsection>
            <FlyoutTemplate.Body.Section.Subsection title="Two">
              two
            </FlyoutTemplate.Body.Section.Subsection>
            <FlyoutTemplate.Body.Section.Subsection title="Three">
              three
            </FlyoutTemplate.Body.Section.Subsection>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Three subsections → two dividers (none below the last).
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(2);
  });

  it('does not wrap Section subsections in an outer bordered box', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Section title="Overview">
            <FlyoutTemplate.Body.Section.Subsection title="Host">
              <span>host content</span>
            </FlyoutTemplate.Body.Section.Subsection>
          </FlyoutTemplate.Body.Section>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Content should NOT be inside an EuiPanel box in the section context.
    expect(screen.getByText('host content').closest('.euiPanel')).toBeNull();
  });

  it('renders Accordion subsections each in their own outlined box', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="Overview" initialIsOpen>
            <FlyoutTemplate.Body.Accordion.Subsection title="Host">
              <span>host content</span>
            </FlyoutTemplate.Body.Accordion.Subsection>
            <FlyoutTemplate.Body.Accordion.Subsection title="Process">
              <span>process content</span>
            </FlyoutTemplate.Body.Accordion.Subsection>
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Each subsection in its own EuiPanel box.
    expect(screen.getByText('host content').closest('.euiPanel')).toBeInTheDocument();
    expect(screen.getByText('process content').closest('.euiPanel')).toBeInTheDocument();
    // The two panels are siblings, not nested.
    const hostPanel = screen.getByText('host content').closest('.euiPanel')!;
    const processPanel = screen.getByText('process content').closest('.euiPanel')!;
    expect(hostPanel).not.toContainElement(processPanel as HTMLElement);
  });

  it('does not render horizontal rules between Accordion subsections', () => {
    const { container } = renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="Overview" initialIsOpen>
            <FlyoutTemplate.Body.Accordion.Subsection title="One">
              one
            </FlyoutTemplate.Body.Accordion.Subsection>
            <FlyoutTemplate.Body.Accordion.Subsection title="Two">
              two
            </FlyoutTemplate.Body.Accordion.Subsection>
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    // Accordion subsections use spacers, not horizontal rules.
    expect(container.querySelectorAll('hr.euiHorizontalRule')).toHaveLength(0);
  });

  it('renders subsection titles as H5 inside an Accordion', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.Accordion title="Overview" initialIsOpen>
            <FlyoutTemplate.Body.Accordion.Subsection title="Host">
              host content
            </FlyoutTemplate.Body.Accordion.Subsection>
          </FlyoutTemplate.Body.Accordion>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByRole('heading', { level: 5, name: 'Host' })).toBeInTheDocument();
  });

  it('exposes Subsection on Body directly as Body.Subsection', () => {
    // Body.Subsection is the same component as Body.Section.Subsection.
    expect(FlyoutTemplate.Body.Subsection).toBe(FlyoutTemplate.Body.Section.Subsection);
    expect(FlyoutTemplate.Body.Subsection).toBe(FlyoutTemplate.Body.Accordion.Subsection);
  });
});

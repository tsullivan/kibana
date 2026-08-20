/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { KibanaErrorBoundaryProvider } from '@kbn/shared-ux-error-boundary';
import { FlyoutTemplate } from './flyout_template';

const noop = () => {};

const WithErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <KibanaErrorBoundaryProvider>{children}</KibanaErrorBoundaryProvider>
);

const renderTemplate = (ui: React.ReactElement) => render(ui, { wrapper: WithErrorBoundary });

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

  it('accepts resizable/minWidth/onResize/ownFocus/onActive/id/hasChildBackground/outsideClickCloses/focusTrapProps/closeButtonProps without altering zone rendering', () => {
    const onResize = jest.fn();
    const onActive = jest.fn();
    const focusTrapProps = { shards: [] };
    const closeButtonProps = { 'data-test-subj': 'myCloseBtn' } as const;
    renderTemplate(
      <FlyoutTemplate
        onClose={noop}
        session="never"
        id="passthrough-flyout"
        hasChildBackground
        resizable
        minWidth={400}
        onResize={onResize}
        ownFocus={false}
        onActive={onActive}
        outsideClickCloses={false}
        focusTrapProps={focusTrapProps}
        closeButtonProps={closeButtonProps}
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
    // The `@elastic/eui` Jest mock (`@elastic/eui/test-env`) renders a bare-bones
    // `EuiFlyout` that doesn't forward `id` or spread `closeButtonProps` onto the DOM,
    // so those can't be asserted directly here. Instead, confirm the root flyout
    // element received its passthrough test subject and that the (default) close
    // button still renders, which is enough to prove these props didn't break
    // rendering without depending on unmocked `EuiFlyout` internals.
    expect(screen.getByTestId('resizableFlyout')).toBeInTheDocument();
    expect(screen.getByTestId('euiFlyoutCloseButton')).toBeInTheDocument();
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
  it('renders a tab bar with correct roles', () => {
    renderTemplate(
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
    renderTemplate(
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
    renderTemplate(
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
    renderTemplate(
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
    const { rerender } = renderTemplate(
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
    renderTemplate(
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
    expect(tab.id).not.toBe('overview');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel.id).toBe(`${tab.id}-panel`);
  });

  it('keeps tab and panel DOM ids unique across flyout instances', () => {
    renderTemplate(
      <>
        <FlyoutTemplate onClose={noop} session="never">
          <FlyoutTemplate.Header title="First">
            <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          </FlyoutTemplate.Header>
          <FlyoutTemplate.Body>
            <FlyoutTemplate.Body.TabPanel tabId="overview">
              first content
            </FlyoutTemplate.Body.TabPanel>
          </FlyoutTemplate.Body>
        </FlyoutTemplate>
        <FlyoutTemplate onClose={noop} session="never">
          <FlyoutTemplate.Header title="Second">
            <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          </FlyoutTemplate.Header>
          <FlyoutTemplate.Body>
            <FlyoutTemplate.Body.TabPanel tabId="overview">
              second content
            </FlyoutTemplate.Body.TabPanel>
          </FlyoutTemplate.Body>
        </FlyoutTemplate>
      </>
    );

    const tabs = screen.getAllByRole('tab', { name: 'Overview' });
    const panels = screen.getAllByRole('tabpanel');
    expect(tabs[0].id).not.toBe(tabs[1].id);
    expect(panels[0].id).not.toBe(panels[1].id);
    expect(panels[0]).toHaveAttribute('aria-labelledby', tabs[0].id);
    expect(panels[1]).toHaveAttribute('aria-labelledby', tabs[1].id);
  });

  it('falls back to the first tab when selectedTabId is invalid', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert" selectedTabId="missing">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            overview content
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            metadata content
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByText('overview content')).toBeInTheDocument();
  });

  it('falls back to the first tab when defaultSelectedTabId is invalid', () => {
    renderTemplate(
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert" defaultSelectedTabId="missing">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            overview content
          </FlyoutTemplate.Body.TabPanel>
          <FlyoutTemplate.Body.TabPanel tabId="metadata">
            metadata content
          </FlyoutTemplate.Body.TabPanel>
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    expect(screen.getByText('overview content')).toBeInTheDocument();
  });

  it('falls back when the uncontrolled selected tab is removed', async () => {
    const renderFlyout = (includeMetadata: boolean) => (
      <FlyoutTemplate onClose={noop} session="never">
        <FlyoutTemplate.Header title="Alert">
          <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
          {includeMetadata && <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />}
        </FlyoutTemplate.Header>
        <FlyoutTemplate.Body>
          <FlyoutTemplate.Body.TabPanel tabId="overview">
            overview content
          </FlyoutTemplate.Body.TabPanel>
          {includeMetadata && (
            <FlyoutTemplate.Body.TabPanel tabId="metadata">
              metadata content
            </FlyoutTemplate.Body.TabPanel>
          )}
        </FlyoutTemplate.Body>
      </FlyoutTemplate>
    );

    const { rerender } = renderTemplate(renderFlyout(true));
    await userEvent.click(screen.getByRole('tab', { name: 'Metadata' }));
    expect(screen.getByText('metadata content')).toBeInTheDocument();

    rerender(renderFlyout(false));
    expect(screen.getByText('overview content')).toBeInTheDocument();
  });

  it('does not render top-level Section in tabbed mode', () => {
    renderTemplate(
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

    expect(screen.queryByText('orphan content')).not.toBeInTheDocument();
  });

  it('renders header and body unchanged when no tabs are declared', () => {
    renderTemplate(
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

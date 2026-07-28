/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { Fragment, useMemo } from 'react';
import type { ReactNode } from 'react';
import { EuiFlyoutBody } from '@elastic/eui';
import type { ParsedItem, ParsedPart } from '@kbn/content-list-assembly';
import { bodyAssembly, flyoutAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTabs, useFlyoutTemplateConfig } from '../context';
import type { FlyoutBodyProps } from '../types';
import { Section, sectionPart } from './section';
import { TabPanel, TAB_PANEL_PART_NAME } from './tab_panel';

/**
 * Renders parsed body items in source order: `Section` parts are resolved,
 * passthrough children are rendered as-is. Shared by the untabbed body and by
 * each tab panel's content (a panel's children are the same shape as the body).
 */
const renderBodyItems = (children: ReactNode) => {
  const items = bodyAssembly.parseChildren(children, { supportsOtherChildren: true });
  return items.map((item, index) => {
    if (item.type === 'child') {
      return <Fragment key={`passthrough-${index}`}>{item.node}</Fragment>;
    }
    return (
      <Fragment key={item.instanceId}>{sectionPart.resolve(item, undefined) ?? null}</Fragment>
    );
  });
};

/** Part name used for identifying the `Body` zone. */
export const BODY_PART_NAME = 'body';

const bodyPart = flyoutAssembly.definePart({ name: BODY_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Body`. Returns `null`; the root renders the
 * `BodyZone` with these attributes. Namespaces `Section` and `TabPanel` parts.
 */
const BaseBody = bodyPart.createComponent<FlyoutBodyProps>();
BaseBody.displayName = 'FlyoutTemplate.Body';

export const Body = Object.assign(BaseBody, { Section, TabPanel });

/**
 * Internal renderer for the body zone. Composes `EuiFlyoutBody`.
 *
 * **Untabbed mode:** preserves JSX order between `Section` parts and passthrough
 * children (callouts, search, filters, etc.).
 *
 * **Tabbed mode** (any `Body.TabPanel` present): renders only the active tab's
 * panel with full a11y wiring. Top-level `Section` or passthrough children are
 * disallowed and logged as dev warnings (never thrown).
 */
export const BodyZone = ({ children, 'data-test-subj': dataTestSubj }: FlyoutBodyProps) => {
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const { selectedTabId } = useFlyoutTabs();

  const items = useMemo(
    () => bodyAssembly.parseChildren(children, { supportsOtherChildren: true }),
    [children]
  );

  const tabPanelItems = useMemo(
    () =>
      items.filter(
        (item): item is ParsedPart => item.type === 'part' && item.part === TAB_PANEL_PART_NAME
      ),
    [items]
  );

  const isTabbedMode = tabPanelItems.length > 0;

  const bodyTestSubj = resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Body');

  if (isTabbedMode) {
    if (process.env.NODE_ENV !== 'production') {
      const disallowed = items.filter(
        (item): item is ParsedItem =>
          item.type === 'child' || (item.type === 'part' && item.part !== TAB_PANEL_PART_NAME)
      );
      if (disallowed.length > 0) {
        // eslint-disable-next-line no-console
        console.warn(
          '[FlyoutTemplate] Top-level Body.Section and passthrough children are not ' +
            'rendered in tabbed mode. Wrap content inside Body.TabPanel.'
        );
      }

      // Warn for tab panels whose tabId is not in the declared tab list. The
      // selected-tab logic handles mismatches silently in prod; only warn in dev.
      const seenIds = new Set<string>();
      for (const panel of tabPanelItems) {
        const tabId = panel.attributes.tabId as string;
        if (seenIds.has(tabId)) {
          // eslint-disable-next-line no-console
          console.warn(
            `[FlyoutTemplate] Duplicate Body.TabPanel tabId "${tabId}"; first panel wins.`
          );
        } else {
          seenIds.add(tabId);
        }
      }
    }

    // Deduplicate by tabId (first wins).
    const seenPanelIds = new Set<string>();
    const uniquePanels = tabPanelItems.filter((panel) => {
      const tabId = panel.attributes.tabId as string;
      if (seenPanelIds.has(tabId)) return false;
      seenPanelIds.add(tabId);
      return true;
    });

    const activePanel = uniquePanels.find(
      (panel) => (panel.attributes.tabId as string) === selectedTabId
    );

    const activeTabId = activePanel ? (activePanel.attributes.tabId as string) : undefined;

    // The panel's children have the same shape as the body: Section parts and
    // passthrough content, resolved the same way.
    const activePanelContent = activePanel
      ? renderBodyItems(activePanel.attributes.children as ReactNode)
      : null;

    return (
      <EuiFlyoutBody data-test-subj={bodyTestSubj}>
        <div
          role="tabpanel"
          id={activeTabId !== undefined ? `tabpanel-${activeTabId}` : undefined}
          aria-labelledby={activeTabId}
          tabIndex={0}
          data-test-subj={activePanel?.attributes['data-test-subj'] as string | undefined}
        >
          {activePanelContent}
        </div>
      </EuiFlyoutBody>
    );
  }

  return <EuiFlyoutBody data-test-subj={bodyTestSubj}>{renderBodyItems(children)}</EuiFlyoutBody>;
};

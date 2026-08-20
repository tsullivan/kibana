/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { EuiFlyoutBody } from '@elastic/eui';
import { KibanaErrorBoundary } from '@kbn/shared-ux-error-boundary';
import type { ParsedItem } from '@kbn/ui-react-assembly';
import type { ReactNode } from 'react';
import React, { Fragment, useMemo } from 'react';
import { bodyAssembly, flyoutAssembly, partsOf } from '../assembly';
import {
  resolveZoneTestSubj,
  useFlyoutHeaderCollapse,
  useFlyoutTabs,
  useFlyoutTemplateConfig,
} from '../context';
import type { FlyoutBodyProps } from '../types';
import { Accordion, ACCORDION_PART_NAME, accordionPart } from './accordion';
import { Section, SECTION_PART_NAME, sectionPart } from './section';
import { Subsection } from './subsection';
import { TAB_PANEL_PART_NAME, TabPanel } from './tab_panel';

/** Renders `Section`, `Accordion`, and unstructured children in source order. */
const renderBodyItems = (children: ReactNode) => {
  const items = bodyAssembly.parseChildren(children, { supportsOtherChildren: true });

  if (process.env.NODE_ENV !== 'production') {
    const hasSection = items.some((i) => i.type === 'part' && i.part === SECTION_PART_NAME);
    const hasAccordion = items.some((i) => i.type === 'part' && i.part === ACCORDION_PART_NAME);
    if (hasSection && hasAccordion) {
      // eslint-disable-next-line no-console
      console.warn('[FlyoutTemplate] A body uses either Body.Section or Body.Accordion, not both.');
    }
  }

  // Sections and accordions each get dividers between siblings.
  const sectionTotal = items.filter(
    (i) => i.type === 'part' && i.part === SECTION_PART_NAME
  ).length;
  const accordionTotal = items.filter(
    (i) => i.type === 'part' && i.part === ACCORDION_PART_NAME
  ).length;
  let sectionIndex = 0;
  let accordionIndex = 0;

  return items.map((item, index) => {
    if (item.type === 'child') {
      return <Fragment key={`passthrough-${index}`}>{item.node}</Fragment>;
    }
    if (item.part === SECTION_PART_NAME) {
      const showBottomDivider = sectionIndex < sectionTotal - 1;
      sectionIndex += 1;
      return (
        <Fragment key={item.instanceId}>
          {sectionPart.resolve(item, { showBottomDivider }) ?? null}
        </Fragment>
      );
    }
    if (item.part === ACCORDION_PART_NAME) {
      const showBottomDivider = accordionIndex < accordionTotal - 1;
      accordionIndex += 1;
      return (
        <Fragment key={item.instanceId}>
          {accordionPart.resolve(item, { showBottomDivider }) ?? null}
        </Fragment>
      );
    }
    return null;
  });
};

/** Part name used for identifying the `Body` zone. */
export const BODY_PART_NAME = 'body';

const bodyPart = flyoutAssembly.definePart({ name: BODY_PART_NAME });

/** Declarative `FlyoutTemplate.Body`; the root renders the collected attributes. */
const BaseBody = bodyPart.createComponent<FlyoutBodyProps>();
BaseBody.displayName = 'FlyoutTemplate.Body';

export const Body = Object.assign(BaseBody, {
  Section: Object.assign(Section, { Subsection }),
  Accordion: Object.assign(Accordion, { Subsection }),
  TabPanel,
});

/** Internal renderer for the body zone, with optional tab-panel mode. */
export const BodyZone = ({ children, 'data-test-subj': dataTestSubj }: FlyoutBodyProps) => {
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const { tabs, selectedTabId } = useFlyoutTabs();
  const { scrollContainerRef } = useFlyoutHeaderCollapse();

  const items = useMemo(
    () => bodyAssembly.parseChildren(children, { supportsOtherChildren: true }),
    [children]
  );

  const tabPanelItems = useMemo(() => partsOf(items, TAB_PANEL_PART_NAME), [items]);

  const isTabbedMode = tabPanelItems.length > 0;

  const bodyTestSubj = resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Body');

  if (isTabbedMode) {
    const tabIds = new Set(tabs.map((tab) => tab.id));

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
        if (!tabIds.has(tabId)) {
          // eslint-disable-next-line no-console
          console.warn(
            `[FlyoutTemplate] Body.TabPanel tabId "${tabId}" does not match any Header.Tab id.`
          );
        }
      }

      for (const tab of tabs) {
        if (!seenIds.has(tab.id)) {
          // eslint-disable-next-line no-console
          console.warn(
            `[FlyoutTemplate] Header.Tab id "${tab.id}" does not have a matching Body.TabPanel.`
          );
        }
      }
    }

    const seenPanelIds = new Set<string>();
    const uniquePanels = tabPanelItems.filter((panel) => {
      const tabId = panel.attributes.tabId as string;
      if (seenPanelIds.has(tabId)) return false;
      seenPanelIds.add(tabId);
      return true;
    });

    const activeTab = tabs.find((tab) => tab.id === selectedTabId);
    const activePanel = uniquePanels.find((panel) => {
      return (panel.attributes.tabId as string) === activeTab?.id;
    });

    if (!activeTab || !activePanel) {
      return (
        <EuiFlyoutBody data-test-subj={bodyTestSubj} scrollContainerRef={scrollContainerRef} />
      );
    }

    const activePanelContent = renderBodyItems(activePanel.attributes.children as ReactNode);

    return (
      <EuiFlyoutBody data-test-subj={bodyTestSubj} scrollContainerRef={scrollContainerRef}>
        <KibanaErrorBoundary>
          <div
            role="tabpanel"
            id={activeTab.panelDomId}
            aria-labelledby={activeTab.tabDomId}
            tabIndex={0}
            data-test-subj={activePanel.attributes['data-test-subj'] as string | undefined}
          >
            {activePanelContent}
          </div>
        </KibanaErrorBoundary>
      </EuiFlyoutBody>
    );
  }

  return (
    <EuiFlyoutBody data-test-subj={bodyTestSubj} scrollContainerRef={scrollContainerRef}>
      <KibanaErrorBoundary>{renderBodyItems(children)}</KibanaErrorBoundary>
    </EuiFlyoutBody>
  );
};

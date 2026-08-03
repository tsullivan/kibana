/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useEffect, useState } from 'react';
import {
  EuiAccordion,
  EuiHorizontalRule,
  EuiSpacer,
  EuiTitle,
  useGeneratedHtmlId,
} from '@elastic/eui';
import type { FlyoutBodyAccordionProps } from '@kbn/shared-ux-flyout-common';
import { renderTitleAction, renderTitleIcon, renderTitleWithIcon } from '../../title_adornments';
import { SectionContent } from '../section_content';
import { accordionPart } from './part';

type AccordionRendererProps = FlyoutBodyAccordionProps & {
  /** Render a divider below this accordion; hidden while it is open. */
  showBottomDivider: boolean;
};

/** Internal renderer for hook-backed accordion state. */
const AccordionRenderer = ({
  id,
  title,
  icon,
  tooltip,
  action,
  initialIsOpen = false,
  showBottomDivider,
  children,
  'data-test-subj': dataTestSubj,
}: AccordionRendererProps) => {
  const accordionId = useGeneratedHtmlId({ conditionalId: id, prefix: 'flyoutAccordion' });

  // Delay initial open so EuiAccordion measures nonzero height inside the animated flyout.
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!initialIsOpen) return undefined;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setIsOpen(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [initialIsOpen]);

  // Keep heading elements out of the accordion button's phrasing content.
  const buttonContent = renderTitleWithIcon(
    <EuiTitle size="xs">
      <span>{title}</span>
    </EuiTitle>,
    renderTitleIcon(icon, tooltip)
  );

  return (
    <>
      <EuiAccordion
        id={accordionId}
        buttonContent={buttonContent}
        extraAction={action ? renderTitleAction(action) : undefined}
        forceState={isOpen ? 'open' : 'closed'}
        onToggle={setIsOpen}
        data-test-subj={dataTestSubj}
      >
        <SectionContent hasBorder>{children}</SectionContent>
      </EuiAccordion>
      {isOpen ? <EuiSpacer size="m" /> : showBottomDivider && <EuiHorizontalRule margin="m" />}
    </>
  );
};

/** Declarative `FlyoutTemplate.Body.Accordion`. */
export const Accordion = accordionPart.createComponent<FlyoutBodyAccordionProps>({
  resolve: (attributes, { showBottomDivider }) => (
    <AccordionRenderer {...attributes} showBottomDivider={showBottomDivider} />
  ),
});

Accordion.displayName = 'FlyoutTemplate.Body.Accordion';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useState } from 'react';
import { EuiAccordion, EuiHorizontalRule, EuiSpacer, EuiTitle, useGeneratedHtmlId } from '@elastic/eui';
import type { FlyoutAccordionProps } from '../../types';
import { renderTitleAction, renderTitleIcon, renderTitleWithIcon } from '../adornments';
import { SectionContent } from '../section_content';
import { accordionPart } from './part';

type AccordionSectionProps = FlyoutAccordionProps & {
  /** Render a divider below this accordion; hidden while it is open. */
  showBottomDivider: boolean;
};

/**
 * Internal renderer. Uses hooks (id + open state), so it must be a component
 * rather than inline JSX in `resolve`.
 *
 * The title row and outlined content box are shared with `Section` (via
 * `renderTitleWithIcon` / `SectionContent`). The accordion-only differences are
 * expand/collapse and the between-accordion divider, which hides while open.
 */
const AccordionSection = ({
  id,
  title,
  icon,
  tooltip,
  action,
  initialIsOpen = false,
  showBottomDivider,
  children,
  'data-test-subj': dataTestSubj,
}: AccordionSectionProps) => {
  const accordionId = useGeneratedHtmlId({ conditionalId: id, prefix: 'flyoutAccordion' });
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  // Styled like a section title, but a `span` (not an H4): the button label is
  // phrasing content, and headings are not allowed inside a button.
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
        initialIsOpen={initialIsOpen}
        onToggle={setIsOpen}
        data-test-subj={dataTestSubj}
      >
        <SectionContent hasBorder>{children}</SectionContent>
      </EuiAccordion>
      {/* Open: a spacer separates the content box from the next section. Closed:
          the between-accordion divider (omitted for the last accordion). */}
      {isOpen ? <EuiSpacer size="m" /> : showBottomDivider && <EuiHorizontalRule margin="m" />}
    </>
  );
};

/**
 * Declarative `FlyoutTemplate.Body.Accordion`.
 *
 * Returns `null`; the Body zone parses it and renders the resolved output. The
 * title row matches `Body.Section` (title, optional icon/tooltip, right-aligned
 * action). Content is always wrapped in an outlined box.
 */
export const Accordion = accordionPart.createComponent<FlyoutAccordionProps>({
  resolve: (attributes, { showBottomDivider }) => (
    <AccordionSection {...attributes} showBottomDivider={showBottomDivider} />
  ),
});

Accordion.displayName = 'FlyoutTemplate.Body.Accordion';

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import { FlyoutTemplate } from '../flyout_template';
import type { FlyoutTemplateBodyItem, FlyoutTemplateSectionItem } from './types';

/**
 * Renders `Section`/`Accordion` subsection items. `Body.Section.Subsection` and
 * `Body.Accordion.Subsection` are the same component, so this does not need to
 * know its parent's kind. Index fallback keys are safe here specifically because
 * options are captured once at open time and the list never reorders — the part's
 * `id` is preferred when the caller supplied one.
 */
export const renderSectionItems = (items: FlyoutTemplateSectionItem[]) =>
  items.map((item, i) => {
    if (item.kind === 'content') {
      const { Content } = item;
      return <Content key={i} />;
    }
    const { kind, Content, ...props } = item;
    return (
      <FlyoutTemplate.Body.Section.Subsection key={props.id ?? i} {...props}>
        <Content />
      </FlyoutTemplate.Body.Section.Subsection>
    );
  });

/** Renders top-level (or tab-panel) body items: loose content, sections, and accordions. */
export const renderBodyItems = (items: FlyoutTemplateBodyItem[]) =>
  items.map((item, i) => {
    if (item.kind === 'content') {
      const { Content } = item;
      return <Content key={i} />;
    }
    if (item.kind === 'section') {
      const { kind, items: children, ...props } = item;
      return (
        <FlyoutTemplate.Body.Section key={props.id ?? i} {...props}>
          {renderSectionItems(children)}
        </FlyoutTemplate.Body.Section>
      );
    }
    const { kind, items: children, ...props } = item;
    return (
      <FlyoutTemplate.Body.Accordion key={props.id ?? i} {...props}>
        {renderSectionItems(children)}
      </FlyoutTemplate.Body.Accordion>
    );
  });

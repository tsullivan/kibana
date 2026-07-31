/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { Fragment } from 'react';
import type { ReactNode } from 'react';
import { EuiPanel, EuiSpacer } from '@elastic/eui';
import { sectionAssembly } from '../assembly';
import { subsectionPart, SUBSECTION_PART_NAME } from './subsection';

/** Shared section/accordion content renderer with optional subsection parsing. */
export const SectionContent = ({
  hasBorder = false,
  children,
}: {
  hasBorder?: boolean;
  children?: ReactNode;
}) => {
  const items = sectionAssembly.parseChildren(children, { supportsOtherChildren: true });
  const subsectionTotal = items.filter(
    (i) => i.type === 'part' && i.part === SUBSECTION_PART_NAME
  ).length;

  if (subsectionTotal === 0) {
    return (
      <>
        <EuiSpacer size="s" />
        {hasBorder ? (
          <EuiPanel hasShadow={false} hasBorder paddingSize="m">
            {children}
          </EuiPanel>
        ) : (
          children
        )}
      </>
    );
  }

  // Subsections present: skip the outer box and render each subsection individually.
  let subsectionIndex = 0;
  return (
    <>
      <EuiSpacer size="s" />
      {items.map((item, index) => {
        if (item.type === 'child') {
          return <Fragment key={`passthrough-${index}`}>{item.node}</Fragment>;
        }
        const showBottomDivider = subsectionIndex < subsectionTotal - 1;
        subsectionIndex += 1;
        return (
          <Fragment key={item.instanceId}>
            {subsectionPart.resolve(item, { hasBorder, showBottomDivider }) ?? null}
          </Fragment>
        );
      })}
    </>
  );
};

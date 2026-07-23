/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { Fragment, useMemo } from 'react';
import { EuiFlyoutBody } from '@elastic/eui';
import { bodyAssembly, flyoutAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTemplateConfig } from '../context';
import type { FlyoutBodyProps } from '../types';
import { Section, sectionPart } from './section';

/** Part name used for identifying the `Body` zone. */
export const BODY_PART_NAME = 'body';

const bodyPart = flyoutAssembly.definePart({ name: BODY_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Body`. Returns `null`; the root renders the
 * `BodyZone` with these attributes. Namespaces the `Section` part.
 */
const BaseBody = bodyPart.createComponent<FlyoutBodyProps>();
BaseBody.displayName = 'FlyoutTemplate.Body';

export const Body = Object.assign(BaseBody, { Section });

/**
 * Internal renderer for the body zone. Composes `EuiFlyoutBody` and preserves
 * JSX order between `Section` parts and passthrough children (callouts, search,
 * filters, etc.).
 */
export const BodyZone = ({ children, 'data-test-subj': dataTestSubj }: FlyoutBodyProps) => {
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const items = useMemo(
    () => bodyAssembly.parseChildren(children, { supportsOtherChildren: true }),
    [children]
  );

  return (
    <EuiFlyoutBody data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Body')}>
      {items.map((item, index) => {
        if (item.type === 'child') {
          return <Fragment key={`passthrough-${index}`}>{item.node}</Fragment>;
        }
        return (
          <Fragment key={item.instanceId}>{sectionPart.resolve(item, undefined) ?? null}</Fragment>
        );
      })}
    </EuiFlyoutBody>
  );
};

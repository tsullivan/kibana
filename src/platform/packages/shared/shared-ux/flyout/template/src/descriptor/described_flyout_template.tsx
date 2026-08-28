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
import { renderBodyItems } from './render_body_items';
import type { FlyoutTemplateDescriptor } from './types';

/** Renders a `FlyoutTemplate` from a descriptor, for imperative hosts that cannot pass JSX. */
export const DescribedFlyoutTemplate = (descriptor: FlyoutTemplateDescriptor) => {
  // `body` and `tabs` are pulled out so they cannot reach `FlyoutTemplate`'s prop spread; the
  // body/tabs branch narrows on `descriptor` itself, because a tuple type does not drive
  // destructured-union narrowing.
  const { title, header, footer, body, tabs, ...flyoutProps } = descriptor;
  const { badges, metaBlocks, infoBlocks, ...headerProps } = header ?? {};

  return (
    <FlyoutTemplate {...flyoutProps}>
      <FlyoutTemplate.Header {...headerProps} title={title}>
        {metaBlocks?.map(({ Content, ...p }, i) => (
          <FlyoutTemplate.Header.MetaBlock key={p.id ?? i} {...p}>
            <Content />
          </FlyoutTemplate.Header.MetaBlock>
        ))}
        {badges?.map((p, i) => (
          <FlyoutTemplate.Header.Badge key={p.id ?? i} {...p} />
        ))}
        {infoBlocks?.map(({ Content, ...p }, i) => (
          <FlyoutTemplate.Header.InfoBlock key={p.id ?? i} {...p}>
            <Content />
          </FlyoutTemplate.Header.InfoBlock>
        ))}
        {descriptor.tabs?.map(({ items, panelTestSubj, ...p }) => (
          <FlyoutTemplate.Header.Tab key={p.id} {...p} />
        ))}
      </FlyoutTemplate.Header>
      <FlyoutTemplate.Body>
        {descriptor.tabs !== undefined
          ? descriptor.tabs.map((tab) => (
              <FlyoutTemplate.Body.TabPanel
                key={tab.id}
                tabId={tab.id}
                data-test-subj={tab.panelTestSubj}
              >
                {renderBodyItems(tab.items)}
              </FlyoutTemplate.Body.TabPanel>
            ))
          : renderBodyItems(descriptor.body)}
      </FlyoutTemplate.Body>
      {footer && (
        <FlyoutTemplate.Footer>
          {footer.secondaryAction && (
            <FlyoutTemplate.Footer.SecondaryAction {...footer.secondaryAction} />
          )}
          {footer.primaryAction && (
            <FlyoutTemplate.Footer.PrimaryAction {...footer.primaryAction} />
          )}
        </FlyoutTemplate.Footer>
      )}
    </FlyoutTemplate>
  );
};

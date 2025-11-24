/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { Suspense, lazy } from 'react';
import type { CoreStart } from '@kbn/core/public';
import { EuiLoadingSpinner, htmlIdGenerator } from '@elastic/eui';
import type { OpenConversationFlyoutOptions } from './types';
import type { OnechatInternalService } from '../services';
import type { ConversationFlyoutRef } from '../types';

const htmlId = htmlIdGenerator('onechat-conversation-flyout');

interface OpenConversationFlyoutParams {
  coreStart: CoreStart;
  services: OnechatInternalService;
}

/**
 * Opens a conversation flyout.
 *
 * @param options - Configuration options for the flyout
 * @param params - Internal parameters (services, core, etc.)
 * @returns An object with flyoutRef to close it programmatically
 */
export function openConversationFlyout(
  options: OpenConversationFlyoutOptions,
  { coreStart, services }: OpenConversationFlyoutParams
): { flyoutRef: ConversationFlyoutRef } {
  const { overlays } = coreStart;

  const LazyEmbeddableConversationComponent = lazy(async () => {
    const { createEmbeddableConversation } = await import(
      '../embeddable/create_embeddable_conversation'
    );
    const ConversationComponent = createEmbeddableConversation({
      services,
      coreStart,
    });
    return {
      default: ConversationComponent,
    };
  });

  const handleOnClose = () => {
    flyoutRef.close();
    options.onClose?.();
  };

  const ariaLabelledBy = htmlId();

  const flyoutRef = overlays.openSystemFlyout(
    <Suspense fallback={<EuiLoadingSpinner size="l" />}>
      <LazyEmbeddableConversationComponent
        onClose={handleOnClose}
        ariaLabelledBy={ariaLabelledBy}
        {...options}
      />
    </Suspense>,
    {
      'data-test-subj': 'onechat-conversation-flyout-wrapper',
      ownFocus: true,
      type: 'push',
      size: 's',
      resizable: true,
      session: 'start',
      'aria-label': 'OneChat Conversation Flyout',
      'aria-labelledby': ariaLabelledBy,
    }
  );

  const conversationFlyoutRef: ConversationFlyoutRef = {
    close: () => flyoutRef.close(),
  };

  return {
    flyoutRef: conversationFlyoutRef,
  };
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiFlyout, EuiFlyoutBody, EuiText } from '@elastic/eui';

interface NewFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewFlyout: React.FC<NewFlyoutProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <EuiFlyout
      flyoutMenuProps={{
        title: 'New Prompt',
      }}
      onClose={onClose}
      aria-labelledby="newFlyoutTitle"
      size="s"
      session="start"
    >
      <EuiFlyoutBody>
        <EuiText>
          <p>new prompt</p>
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};

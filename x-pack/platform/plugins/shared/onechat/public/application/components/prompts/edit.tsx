/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiFlyout, EuiFlyoutBody, EuiText } from '@elastic/eui';

interface EditFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  promptId: string | null;
}

export const EditFlyout: React.FC<EditFlyoutProps> = ({ isOpen, onClose, promptId }) => {
  if (!isOpen) return null;

  return (
    <EuiFlyout
      flyoutMenuProps={{
        title: 'Edit Prompt',
      }}
      onClose={onClose}
      aria-labelledby="editFlyoutTitle"
      size="s"
      session="start"
    >
      <EuiFlyoutBody>
        <EuiText>
          <p>Editing prompt: {promptId}</p>
        </EuiText>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiButton, EuiFlyout, EuiFlyoutBody, EuiText } from '@elastic/eui';
import { css } from '@emotion/react';

interface SavedFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNew: () => void;
  onEdit: (promptId: string) => void;
}

export const SavedFlyout: React.FC<SavedFlyoutProps> = ({ isOpen, onClose, onAddNew, onEdit }) => {
  if (!isOpen) return null;

  return (
    <EuiFlyout
      flyoutMenuProps={{
        title: 'Saved Prompts',
      }}
      onClose={onClose}
      aria-labelledby="savedFlyoutTitle"
      size="s"
      session="start"
    >
      <EuiFlyoutBody>
        <EuiText>
          <p>saved prompts</p>
        </EuiText>
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 4px 8px;
            border: 1px solid black;
            margin: 8px 0;
          `}
        >
          <EuiText>
            <p>Fake Prompt: 123</p>
          </EuiText>
          <EuiButton iconType="pencil" onClick={() => onEdit('123')}>
            Edit
          </EuiButton>
        </div>
        <EuiButton onClick={onAddNew}>Add new prompt</EuiButton>
      </EuiFlyoutBody>
    </EuiFlyout>
  );
};

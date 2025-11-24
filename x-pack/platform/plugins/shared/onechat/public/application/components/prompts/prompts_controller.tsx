/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useState } from 'react';
import { SavedFlyout } from './saved';
import { NewFlyout } from './new';
import { EditFlyout } from './edit';

interface PromptsControllerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptsController: React.FC<PromptsControllerProps> = ({ isOpen, onClose }) => {
  const [openNewFlyout, setOpenNewFlyout] = useState(false);
  const [openEditFlyout, setOpenEditFlyout] = useState(false);
  const [editPromptId, setEditPromptId] = useState<string | null>(null);

  const handleEdit = (promptId: string) => {
    setEditPromptId(promptId);
    setOpenEditFlyout(true);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
  };

  const handleOpenNewFlyout = () => {
    setOpenNewFlyout(true);
  };

  return (
    <>
      <SavedFlyout
        isOpen={true}
        onClose={handleClose}
        onAddNew={handleOpenNewFlyout}
        onEdit={handleEdit}
      />
      <NewFlyout isOpen={openNewFlyout} onClose={() => setOpenNewFlyout(false)} />
      <EditFlyout
        isOpen={openEditFlyout}
        onClose={() => setOpenEditFlyout(false)}
        promptId={editPromptId}
      />
    </>
  );
};

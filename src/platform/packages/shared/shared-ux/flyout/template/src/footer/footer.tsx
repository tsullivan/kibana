/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React from 'react';
import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutFooter,
} from '@elastic/eui';
import type { ParsedPart } from '@kbn/content-list-assembly';
import { flyoutAssembly, footerAssembly } from '../assembly';
import { resolveZoneTestSubj, useFlyoutTemplateConfig } from '../context';
import type { FlyoutFooterActionProps, FlyoutFooterProps } from '../types';
import {
  PrimaryAction,
  SecondaryAction,
  PRIMARY_ACTION_PART_NAME,
  SECONDARY_ACTION_PART_NAME,
} from './action';

/** Part name used for identifying the `Footer` zone. */
export const FOOTER_PART_NAME = 'footer';

const footerPart = flyoutAssembly.definePart({ name: FOOTER_PART_NAME });

/**
 * Declarative `FlyoutTemplate.Footer`. Returns `null`; the root renders the
 * `FooterZone` with these attributes. Namespaces the action parts.
 */
const BaseFooter = footerPart.createComponent<FlyoutFooterProps>();
BaseFooter.displayName = 'FlyoutTemplate.Footer';

export const Footer = Object.assign(BaseFooter, { PrimaryAction, SecondaryAction });

const renderPrimary = ({
  label,
  onClick,
  iconType,
  color,
  isLoading,
  isDisabled,
  fill = true,
  'data-test-subj': dataTestSubj,
}: FlyoutFooterActionProps) => (
  <EuiButton
    fill={fill}
    color={color}
    iconType={iconType}
    isLoading={isLoading}
    isDisabled={isDisabled}
    onClick={onClick}
    data-test-subj={dataTestSubj}
  >
    {label}
  </EuiButton>
);

const renderSecondary = ({
  label,
  onClick,
  iconType,
  color,
  isLoading,
  isDisabled,
  'data-test-subj': dataTestSubj,
}: FlyoutFooterActionProps) => (
  <EuiButtonEmpty
    color={color}
    iconType={iconType}
    isLoading={isLoading}
    isDisabled={isDisabled}
    onClick={onClick}
    data-test-subj={dataTestSubj}
  >
    {label}
  </EuiButtonEmpty>
);

/**
 * Internal renderer for the footer zone. Composes `EuiFlyoutFooter`. The primary
 * action is right-aligned and the secondary action sits to its left. There is no
 * default Cancel button; the footer renders nothing when it has no actions.
 */
export const FooterZone = ({ children, 'data-test-subj': dataTestSubj }: FlyoutFooterProps) => {
  const { dataTestSubj: rootTestSubj } = useFlyoutTemplateConfig();
  const parts = footerAssembly.parseChildren(children);

  const primary = parts.find(
    (part): part is ParsedPart => part.type === 'part' && part.part === PRIMARY_ACTION_PART_NAME
  );
  const secondary = parts.find(
    (part): part is ParsedPart => part.type === 'part' && part.part === SECONDARY_ACTION_PART_NAME
  );

  if (!primary && !secondary) {
    return null;
  }

  return (
    <EuiFlyoutFooter data-test-subj={resolveZoneTestSubj(dataTestSubj, rootTestSubj, 'Footer')}>
      <EuiFlexGroup justifyContent="flexEnd" gutterSize="s" responsive={false}>
        {secondary && (
          <EuiFlexItem grow={false}>
            {renderSecondary(secondary.attributes as unknown as FlyoutFooterActionProps)}
          </EuiFlexItem>
        )}
        {primary && (
          <EuiFlexItem grow={false}>
            {renderPrimary(primary.attributes as unknown as FlyoutFooterActionProps)}
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </EuiFlyoutFooter>
  );
};

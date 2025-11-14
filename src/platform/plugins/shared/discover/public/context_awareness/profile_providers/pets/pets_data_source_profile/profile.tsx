/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { getFieldValue } from '@kbn/discover-utils';
import React from 'react';
import { EuiLink, EuiBadge, EuiHealth, EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';
import type { DataSourceProfileProvider } from '../../../profiles';
import { DataSourceCategory } from '../../../profiles';
import { extractIndexPatternFrom } from '../../extract_index_pattern_from';
import { usePetsContext } from '../pets_context';

export const createPetsDataSourceProfileProvider = (): DataSourceProfileProvider => ({
  profileId: 'pets-data-source-profile',
  profile: {
    getCellRenderers: (prev) => (params) => ({
      ...prev(params),
      'pet.name': function PetNameCell(props) {
        const { setCurrentMessage } = usePetsContext();
        const petName = getFieldValue(props.row, 'pet.name') as string;
        const petDescription = getFieldValue(props.row, 'pet.description') as string;

        return (
          <EuiLink onClick={() => setCurrentMessage(`${petName}: ${petDescription}`)}>
            {petName}
          </EuiLink>
        );
      },
      'pet.type': function PetTypeCell(props) {
        const { setCurrentMessage } = usePetsContext();
        const petType = getFieldValue(props.row, 'pet.type') as string;

        const emoji =
          {
            dog: '🐕',
            cat: '🐈',
            rabbit: '🐇',
            bird: '🐦',
            'guinea pig': '🐹',
          }[petType] || '🐾';

        return (
          <span
            onClick={() => setCurrentMessage(`All ${petType}s are adorable!`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setCurrentMessage(`All ${petType}s are adorable!`);
              }
            }}
            role="button"
            tabIndex={0}
            style={{ cursor: 'pointer' }}
          >
            {emoji} {petType}
          </span>
        );
      },
      'pet.status': function PetStatusCell(props) {
        const status = getFieldValue(props.row, 'pet.status') as string;

        const statusConfig: Record<string, { color: string; label: string; icon?: string }> = {
          available: { color: 'success', label: 'Available', icon: '✓' },
          adopted: { color: 'primary', label: 'Adopted', icon: '🏡' },
          pending: { color: 'warning', label: 'Pending', icon: '⏳' },
          foster: { color: 'accent', label: 'In Foster', icon: '🤝' },
        };

        const config = statusConfig[status] || {
          color: 'default',
          label: status,
        };

        return (
          <EuiBadge color={config.color}>
            {config.icon} {config.label}
          </EuiBadge>
        );
      },
      'pet.age': function PetAgeCell(props) {
        const age = getFieldValue(props.row, 'pet.age') as number;

        let ageLabel = `${age} year${age !== 1 ? 's' : ''}`;
        let color = 'default';

        if (age < 1) {
          ageLabel = 'Baby';
          color = 'primary';
        } else if (age < 3) {
          ageLabel = `${age} yr (Young)`;
          color = 'success';
        } else if (age >= 7) {
          ageLabel = `${age} yr (Senior)`;
          color = 'warning';
        }

        return (
          <EuiBadge color={color} title={`${age} years old`}>
            {ageLabel}
          </EuiBadge>
        );
      },
      'pet.personality': function PetPersonalityCell(props) {
        const personalityRaw = getFieldValue(props.row, 'pet.personality');

        let personality: string[] = [];
        if (Array.isArray(personalityRaw)) {
          personality = personalityRaw;
        } else if (typeof personalityRaw === 'string') {
          personality = [personalityRaw];
        }

        if (personality.length === 0) {
          return <span>-</span>;
        }

        return (
          <EuiFlexGroup gutterSize="xs" wrap responsive={false}>
            {personality.slice(0, 3).map((trait, index) => (
              <EuiFlexItem grow={false} key={index}>
                <EuiBadge color="hollow">{trait}</EuiBadge>
              </EuiFlexItem>
            ))}
            {personality.length > 3 && (
              <EuiFlexItem grow={false}>
                <EuiBadge color="hollow">+{personality.length - 3}</EuiBadge>
              </EuiFlexItem>
            )}
          </EuiFlexGroup>
        );
      },
      'pet.special_needs': function PetSpecialNeedsCell(props) {
        const specialNeeds = getFieldValue(props.row, 'pet.special_needs') as boolean;

        if (specialNeeds) {
          return (
            <EuiHealth color="warning" title="Requires special care">
              Special Care
            </EuiHealth>
          );
        }

        return <span>-</span>;
      },
      'adoption.fee': function AdoptionFeeCell(props) {
        const fee = getFieldValue(props.row, 'adoption.fee') as number;

        return (
          <EuiText size="s">
            <strong>${fee}</strong>
          </EuiText>
        );
      },
    }),
    getRowIndicatorProvider: (prev) => (params) => {
      const prevValue = prev(params);
      const { dataView } = params;

      if (!dataView.getFieldByName('pet.special_needs') && !dataView.getFieldByName('pet.status')) {
        return prevValue;
      }

      return (row, euiTheme) => {
        const specialNeeds = getFieldValue(row, 'pet.special_needs') as boolean;
        const status = getFieldValue(row, 'pet.status') as string;

        if (specialNeeds) {
          return {
            color: euiTheme.colors.warning,
            label: 'Special needs pet',
          };
        }

        if (status === 'available') {
          return {
            color: euiTheme.colors.success,
            label: 'Available for adoption',
          };
        }

        return prevValue ? prevValue(row, euiTheme) : undefined;
      };
    },
    getDefaultAppState: () => () => ({
      columns: [
        { name: 'pet.name', width: 150 },
        { name: 'pet.type', width: 120 },
        { name: 'pet.age', width: 120 },
        { name: 'pet.status', width: 140 },
        { name: 'pet.personality', width: 250 },
        { name: 'shelter.name', width: 200 },
        { name: 'adoption.fee', width: 100 },
      ],
    }),
  },
  resolve: (params) => {
    const indexPattern = extractIndexPatternFrom(params);

    if (indexPattern !== 'pet-adoption-center') {
      return { isMatch: false };
    }
    return { isMatch: true, context: { category: DataSourceCategory.Default } };
  },
});

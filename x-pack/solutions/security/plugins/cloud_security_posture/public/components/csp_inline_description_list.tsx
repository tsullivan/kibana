/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { EuiDescriptionList, useEuiTheme } from '@elastic/eui';
import type { EuiDescriptionListProps } from '@elastic/eui';
import { CopyButton } from './copy_button';

const getModifiedTitlesListItems = (listItems?: EuiDescriptionListProps['listItems']) =>
  listItems
    ?.filter((item) => !!item?.title && !!item?.description)
    .map((item) => ({
      ...item,
      title: `${item.title}:`,
      description:
        typeof item.description === 'string' ? (
          <span>
            {item.description} <CopyButton copyText={item.description} />
          </span>
        ) : (
          item.description
        ),
    }));

// eui size m is 12px which is too small, and next after it is base which is 16px which is too big
const fontSize = '1rem';

export const CspInlineDescriptionList = ({
  testId,
  listItems,
}: {
  testId?: string;
  listItems: EuiDescriptionListProps['listItems'];
}) => {
  const { euiTheme } = useEuiTheme();
  const modifiedTitlesListItems = getModifiedTitlesListItems(listItems);
  return (
    <EuiDescriptionList
      data-test-subj={testId}
      type="inline"
      titleProps={{
        style: {
          background: 'initial',
          color: euiTheme.colors.textSubdued,
          fontSize,
          paddingRight: 0,
          paddingInline: 0,
          marginInline: 'unset',
          marginInlineEnd: euiTheme.size.xs,
        },
      }}
      descriptionProps={{
        style: {
          color: euiTheme.colors.textSubdued,
          marginRight: euiTheme.size.xs,
          fontSize,
        },
      }}
      listItems={modifiedTitlesListItems}
    />
  );
};

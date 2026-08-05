/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { type FunctionComponent } from 'react';
import { css } from '@emotion/react';
import { EuiText, useEuiMemoizedStyles } from '@elastic/eui';
import type { UseEuiTheme } from '@elastic/eui';
import type { MetadataPairsProps } from './types';

const styles = ({ euiTheme }: UseEuiTheme) => {
  return {
    // Pairs are inline text, so content decides the layout — no width breakpoints.
    list: css`
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: ${euiTheme.size.xs} ${euiTheme.size.m};
    `,
    // Pairs wrap rather than shrink; only one too wide for its own line truncates.
    item: css`
      flex: 0 1 auto;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    `,
    key: css`
      font-weight: ${euiTheme.font.weight.bold};
    `,
    // Keep link values from inheriting the key's weight.
    value: css`
      a {
        font-weight: ${euiTheme.font.weight.regular};
      }
    `,
  };
};

/**
 * A compact, responsive row of key-value pairs.
 * TODO: Warn in dev mode if the number of items exceeds 3, per UX guideline.
 */
export const MetadataPairs: FunctionComponent<MetadataPairsProps> = ({ items, ...rest }) => {
  const memoized = useEuiMemoizedStyles(styles);

  if (items.length === 0) {
    return null;
  }

  return (
    <div css={memoized.list} data-test-subj={rest['data-test-subj'] ?? 'metadataPairs'}>
      {items.map((item, index) => (
        <EuiText key={index} size="s" css={memoized.item} data-test-subj={item['data-test-subj']}>
          <span css={memoized.key}>{item.title}</span>{' '}
          <span css={memoized.value}>{item.value}</span>
        </EuiText>
      ))}
    </div>
  );
};

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
import { FLYOUT_MAX_GRID_COLUMNS, FLYOUT_MIN_CELL_WIDTH } from '@kbn/shared-ux-flyout-common';
import type { MetadataPairsProps } from './types';

/** Layout keys off a container query. */
const CONTAINER_NAME = 'flyoutMetadataPairs';

const styles = ({ euiTheme }: UseEuiTheme) => {
  const twoColumnBelow = FLYOUT_MAX_GRID_COLUMNS * FLYOUT_MIN_CELL_WIDTH;
  const oneColumnBelow = 2 * FLYOUT_MIN_CELL_WIDTH;

  return {
    container: css`
      container-type: inline-size;
      container-name: ${CONTAINER_NAME};
    `,
    grid: css`
      display: grid;
      grid-template-columns: repeat(${FLYOUT_MAX_GRID_COLUMNS}, minmax(0, auto));
      justify-content: start;
      align-items: center;
      gap: ${euiTheme.size.xs} ${euiTheme.size.m};

      /* 2 across, with a second row spanning both columns. */
      @container ${CONTAINER_NAME} (width < ${twoColumnBelow}px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        & > :last-child:nth-child(odd) {
          grid-column: 1 / -1;
        }
      }

      /* one pair per row */
      @container ${CONTAINER_NAME} (width < ${oneColumnBelow}px) {
        grid-template-columns: minmax(0, 1fr);
      }
    `,
    // Each pair ellipsizes at every layout.
    item: css`
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
    <div css={memoized.container} data-test-subj={rest['data-test-subj'] ?? 'metadataPairs'}>
      <div css={memoized.grid}>
        {items.map((item, index) => (
          <EuiText key={index} size="s" css={memoized.item} data-test-subj={item['data-test-subj']}>
            <span css={memoized.key}>{item.title}</span>{' '}
            <span css={memoized.value}>{item.value}</span>
          </EuiText>
        ))}
      </div>
    </div>
  );
};

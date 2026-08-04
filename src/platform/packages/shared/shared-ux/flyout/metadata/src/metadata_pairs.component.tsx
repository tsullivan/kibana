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
import {
  FLYOUT_MAX_GRID_COLUMNS,
  FLYOUT_MIN_CELL_WIDTH,
  MAX_METADATA_ITEMS,
} from '@kbn/shared-ux-flyout-common';
import type { MetadataPairsProps } from './types';

/**
 * Layout keys off a container query rather than a media query: this renders inside a flyout
 * that is resizable and can be `push` type, so its width is independent of the viewport's.
 */
const CONTAINER_NAME = 'flyoutMetadataPairs';

const styles = ({ euiTheme }: UseEuiTheme) => {
  // Shared with InfoBlocks so both drop a column at the same container width, rather than
  // reflowing at staggered widths.
  const twoColumnBelow = FLYOUT_MAX_GRID_COLUMNS * FLYOUT_MIN_CELL_WIDTH;
  const oneColumnBelow = 2 * FLYOUT_MIN_CELL_WIDTH;

  return {
    container: css`
      container-type: inline-size;
      container-name: ${CONTAINER_NAME};
    `,
    grid: css`
      display: grid;
      /* Up to three columns, wrapping into further rows — the item count is unbounded.
         Tracks are content-sized and start-aligned to keep pairs visually compact. */
      grid-template-columns: repeat(${FLYOUT_MAX_GRID_COLUMNS}, minmax(0, auto));
      justify-content: start;
      align-items: center;
      gap: ${euiTheme.size.xs} ${euiTheme.size.m};

      /* Cramped: 2 across, with a trailing odd pair spanning both columns. */
      @container ${CONTAINER_NAME} (width < ${twoColumnBelow}px) {
        grid-template-columns: repeat(2, minmax(0, 1fr));

        & > :last-child:nth-child(odd) {
          grid-column: 1 / -1;
        }
      }

      /* Very narrow: one pair per row. The span above collapses to the single column. */
      @container ${CONTAINER_NAME} (width < ${oneColumnBelow}px) {
        grid-template-columns: minmax(0, 1fr);
      }
    `,
    // Each pair ellipsizes rather than wrapping, at every layout.
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
 * A compact, responsive row of key-value pairs — the metadata line used beneath a flyout title.
 */
export const MetadataPairs: FunctionComponent<MetadataPairsProps> = ({ items, ...rest }) => {
  const memoized = useEuiMemoizedStyles(styles);

  // All pairs render; the cap is a design guideline, so overshooting only warns.
  if (process.env.NODE_ENV !== 'production' && items.length > MAX_METADATA_ITEMS) {
    // eslint-disable-next-line no-console
    console.warn(
      `[MetadataPairs] designed for up to ${MAX_METADATA_ITEMS} pairs; ${items.length} were provided.`
    );
  }

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

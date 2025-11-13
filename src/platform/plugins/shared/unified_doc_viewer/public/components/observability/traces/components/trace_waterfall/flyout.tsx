/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import React, { useCallback, useRef, useState } from 'react';
import {
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiTitle,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { EmbeddableRenderer } from '@kbn/embeddable-plugin/public';
import type { DocViewRenderProps } from '@kbn/unified-doc-viewer/types';
import { i18n } from '@kbn/i18n';
import { SpanFlyout, spanFlyoutId } from '../full_screen_waterfall/waterfall_flyout/span_flyout';
import { LogsFlyout, logsFlyoutId } from '../full_screen_waterfall/waterfall_flyout/logs_flyout';
import type { TraceOverviewSections } from '../../doc_viewer_overview/overview';

export interface TraceWaterfallFlyoutProps {
  traceId: string;
  rangeFrom: string;
  rangeTo: string;
  dataView: DocViewRenderProps['dataView'];
  serviceName?: string;
  onClose: () => void;
}

/**
 * Flyout that replaces the previous fullscreen waterfall overlay.
 * Opens child flyouts (span or logs) inside the same session when items are clicked.
 * TODO: Remove `FullScreenWaterfall` once migration is complete.
 */
export function TraceWaterfallFlyout({
  traceId,
  rangeFrom,
  rangeTo,
  dataView,
  serviceName,
  onClose,
}: TraceWaterfallFlyoutProps) {
  const [docId, setDocId] = useState<string | null>(null);
  const [activeFlyoutId, setActiveFlyoutId] = useState<
    typeof spanFlyoutId | typeof logsFlyoutId | null
  >(null);
  const [activeSection, setActiveSection] = useState<TraceOverviewSections | undefined>();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getParentApi = useCallback(
    () => ({
      getSerializedStateForChild: () => ({
        rawState: {
          traceId,
          rangeFrom,
          rangeTo,
          serviceName,
          scrollElement: scrollContainerRef.current,
          onErrorClick: (params: {
            traceId: string;
            docId: string;
            errorCount: number;
            errorDocId?: string;
          }) => {
            if (params.errorCount > 1) {
              setActiveFlyoutId(spanFlyoutId);
              setActiveSection('errors-table');
              setDocId(params.docId);
            } else if (params.errorDocId) {
              setActiveFlyoutId(logsFlyoutId);
              setDocId(params.errorDocId);
            }
          },
          onNodeClick: (nodeSpanId: string) => {
            setActiveSection(undefined);
            setDocId(nodeSpanId);
            setActiveFlyoutId(spanFlyoutId);
          },
          mode: 'full',
        },
      }),
    }),
    [traceId, rangeFrom, rangeTo, serviceName]
  );

  const handleCloseChildFlyout = () => {
    setActiveFlyoutId(null);
    setActiveSection(undefined);
    setDocId(null);
  };

  return (
    <>
      <EuiFlyout
        session="inherit"
        size="fill"
        ownFocus={false}
        onClose={onClose}
        data-test-subj="unifiedDocViewerObservabilityTracesTraceWaterfallFlyout"
        aria-labelledby="traceWaterfallFlyoutTitle"
      >
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="traceWaterfallFlyoutTitle">
              {i18n.translate('unifiedDocViewer.observability.traces.waterfallFlyout.title', {
                defaultMessage: 'Trace timeline',
              })}
            </h2>
          </EuiTitle>
        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <div ref={scrollContainerRef}>
            <EuiFlexGroup gutterSize="m">
              <EuiFlexItem>
                <EmbeddableRenderer
                  type="APM_TRACE_WATERFALL_EMBEDDABLE"
                  getParentApi={getParentApi}
                  hidePanelChrome
                />
                <EuiSpacer size="m" />
              </EuiFlexItem>
            </EuiFlexGroup>
          </div>
        </EuiFlyoutBody>
      </EuiFlyout>
      {docId && activeFlyoutId ? (
        activeFlyoutId === spanFlyoutId ? (
          <SpanFlyout
            traceId={traceId}
            spanId={docId}
            dataView={dataView}
            onCloseFlyout={handleCloseChildFlyout}
            activeSection={activeSection}
          />
        ) : (
          <LogsFlyout id={docId} dataView={dataView} onCloseFlyout={handleCloseChildFlyout} />
        )
      ) : null}
    </>
  );
}

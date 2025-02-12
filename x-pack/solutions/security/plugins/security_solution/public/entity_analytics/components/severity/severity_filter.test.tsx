/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { SeverityFilter } from './severity_filter';
import { EntityType } from '../../../../common/entity_analytics/types';
import { TestProviders } from '../../../common/mock';
import { createTelemetryServiceMock } from '../../../common/lib/telemetry/telemetry_service.mock';
import { RiskSeverity } from '../../../../common/search_strategy';

const mockedTelemetry = createTelemetryServiceMock();
jest.mock('../../../common/lib/kibana', () => {
  return {
    useKibana: () => ({
      services: {
        telemetry: mockedTelemetry,
      },
    }),
  };
});

describe('SeverityFilter', () => {
  beforeEach(() => {
    mockedTelemetry.reportEvent.mockClear();
  });

  it('sends telemetry when selecting a classification', () => {
    const { getByTestId } = render(
      <TestProviders>
        <SeverityFilter selectedItems={[]} onSelect={jest.fn()} riskEntity={EntityType.user} />
      </TestProviders>
    );

    fireEvent.click(getByTestId('risk-filter-popoverButton'));

    fireEvent.click(getByTestId('risk-filter-item-Unknown'));

    expect(mockedTelemetry.reportEvent).toHaveBeenCalledTimes(1);
  });

  it('does not send telemetry when deselecting a classification', () => {
    const { getByTestId } = render(
      <TestProviders>
        <SeverityFilter
          selectedItems={[
            RiskSeverity.Critical,
            RiskSeverity.High,
            RiskSeverity.Moderate,
            RiskSeverity.Low,
            RiskSeverity.Unknown,
          ]}
          onSelect={jest.fn()}
          riskEntity={EntityType.user}
        />
      </TestProviders>
    );

    fireEvent.click(getByTestId('risk-filter-popoverButton'));

    fireEvent.click(getByTestId('risk-filter-item-Unknown'));
    expect(mockedTelemetry.reportEvent).toHaveBeenCalledTimes(0);
  });
});

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { i18n } from '@kbn/i18n';
import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import {
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyoutHeader,
  EuiTitle,
  EuiFlyoutBody,
  EuiLoadingSpinner,
} from '@elastic/eui';
import {
  ApplicationStart,
  HttpStart,
  IUiSettingsClient,
  ThemeServiceStart,
} from '@kbn/core/public';
import { KibanaContextProvider } from '@kbn/kibana-react-plugin/public';
import { SharePluginStart } from '@kbn/share-plugin/public';
import type { SettingsStart } from '@kbn/core-ui-settings-browser';
import { css } from '@emotion/react';
import { InspectorViewDescription } from '../types';
import { Adapters } from '../../common';
import { InspectorViewChooser } from './inspector_view_chooser';

function hasAdaptersChanged(oldAdapters: Adapters, newAdapters: Adapters) {
  return (
    Object.keys(oldAdapters).length !== Object.keys(newAdapters).length ||
    Object.keys(oldAdapters).some((key) => oldAdapters[key] !== newAdapters[key])
  );
}

const inspectorTitle = i18n.translate('inspector.title', {
  defaultMessage: 'Inspector',
});

interface InspectorPanelProps {
  adapters: Adapters;
  title?: string;
  options?: unknown;
  views: InspectorViewDescription[];
  dependencies: {
    application: ApplicationStart;
    http: HttpStart;
    uiSettings: IUiSettingsClient;
    share: SharePluginStart;
    settings: SettingsStart;
    theme: ThemeServiceStart;
  };
}

interface InspectorPanelState {
  selectedView: InspectorViewDescription;
  views: InspectorViewDescription[];
  adapters: Adapters;
}

export class InspectorPanel extends Component<InspectorPanelProps, InspectorPanelState> {
  static defaultProps = {
    title: inspectorTitle,
  };

  static propTypes = {
    adapters: PropTypes.object.isRequired,
    views: (props: InspectorPanelProps, propName: string, componentName: string) => {
      if (!Array.isArray(props.views) || props.views.length < 1) {
        throw new Error(
          `${propName} prop must be an array of at least one element in ${componentName}.`
        );
      }
    },
    title: PropTypes.string,
    options: PropTypes.object,
  };

  state: InspectorPanelState = {
    selectedView: this.props.views[0],
    views: this.props.views,
    // Clone adapters array so we can validate that this prop never change
    adapters: { ...this.props.adapters },
  };

  static getDerivedStateFromProps(nextProps: InspectorPanelProps, prevState: InspectorPanelState) {
    if (hasAdaptersChanged(prevState.adapters, nextProps.adapters)) {
      throw new Error('Adapters are not allowed to be changed on an open InspectorPanel.');
    }
    const selectedViewMustChange =
      nextProps.views !== prevState.views && !nextProps.views.includes(prevState.selectedView);
    return {
      views: nextProps.views,
      selectedView: selectedViewMustChange ? nextProps.views[0] : prevState.selectedView,
    };
  }

  onViewSelected = (view: InspectorViewDescription) => {
    if (view !== this.state.selectedView) {
      this.setState({
        selectedView: view,
      });
    }
  };

  renderSelectedPanel() {
    return (
      <Suspense fallback={<EuiLoadingSpinner />}>
        <this.state.selectedView.component
          adapters={this.props.adapters}
          title={this.props.title || ''}
          options={this.props.options}
        />
      </Suspense>
    );
  }

  render() {
    const { views, title, dependencies } = this.props;
    const { selectedView } = this.state;

    return (
      <KibanaContextProvider services={dependencies}>
        <EuiFlyoutHeader hasBorder>
          <EuiFlexGroup justifyContent="spaceBetween" alignItems="center">
            <EuiFlexItem grow={true}>
              <EuiTitle size="s">
                <h1 id="inspector-panel-title">{title}</h1>
              </EuiTitle>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <InspectorViewChooser
                views={views}
                onViewSelected={this.onViewSelected}
                selectedView={selectedView}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutHeader>
        <EuiFlyoutBody
          css={css({
            '.euiFlyoutBody__overflowContent': {
              height: '100%',
              display: 'flex',
              flexWrap: 'nowrap',
              flexDirection: 'column',

              '> div': {
                flexGrow: 0,
              },

              '.insRequestCodeViewer': {
                flexGrow: 1,
              },
            },
          })}
        >
          {this.renderSelectedPanel()}
        </EuiFlyoutBody>
      </KibanaContextProvider>
    );
  }
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CoreSetup, CoreStart, Plugin } from 'src/core/public';
import { ManagementSetup } from 'src/plugins/management/public';
import { DataPublicPluginSetup, DataPublicPluginStart } from '../../../../src/plugins/data/public';
import { LicensingPluginSetup } from '../../licensing/public';
import { KUERY_LANGUAGE_NAME, setupKqlQuerySuggestionProvider } from './autocomplete';
import { registerBackgroundSessionsManagement } from './background_session_management';
import { EnhancedSearchInterceptor } from './search/search_interceptor';
import { setAutocompleteService } from './services';

export interface DataEnhancedSetupDependencies {
  data: DataPublicPluginSetup;
  licensing: LicensingPluginSetup;
  management: ManagementSetup;
}
export interface DataEnhancedStartDependencies {
  data: DataPublicPluginStart;
}

export type DataEnhancedSetup = ReturnType<DataEnhancedPlugin['setup']>;
export type DataEnhancedStart = ReturnType<DataEnhancedPlugin['start']>;

export class DataEnhancedPlugin
  implements Plugin<void, void, DataEnhancedSetupDependencies, DataEnhancedStartDependencies> {
  private enhancedSearchInterceptor!: EnhancedSearchInterceptor;

  public setup(
    core: CoreSetup<DataEnhancedStartDependencies>,
    { data, licensing, management }: DataEnhancedSetupDependencies
  ) {
    data.autocomplete.addQuerySuggestionProvider(
      KUERY_LANGUAGE_NAME,
      setupKqlQuerySuggestionProvider(core)
    );

    this.enhancedSearchInterceptor = new EnhancedSearchInterceptor({
      toasts: core.notifications.toasts,
      http: core.http,
      uiSettings: core.uiSettings,
      startServices: core.getStartServices(),
      usageCollector: data.search.usageCollector,
      session: data.search.session,
    });

    data.__enhance({
      search: {
        searchInterceptor: this.enhancedSearchInterceptor,
      },
    });

    registerBackgroundSessionsManagement(management, licensing.license$);
  }

  public start(core: CoreStart, plugins: DataEnhancedStartDependencies) {
    setAutocompleteService(plugins.data.autocomplete);
  }

  public stop() {
    this.enhancedSearchInterceptor.stop();
  }
}

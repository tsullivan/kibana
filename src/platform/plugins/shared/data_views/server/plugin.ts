/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import { CoreSetup, CoreStart, Logger, Plugin, PluginInitializerContext } from '@kbn/core/server';
import { dataViewsServiceFactory } from './data_views_service_factory';
import { registerRoutes } from './routes';
import { dataViewSavedObjectType } from './saved_objects';
import { capabilitiesProvider } from './capabilities_provider';
import { getIndexPatternLoad } from './expressions';
import { registerIndexPatternsUsageCollector } from './register_index_pattern_usage_collection';
import { createScriptedFieldsDeprecationsConfig } from './deprecations';
import { DATA_VIEW_SAVED_OBJECT_TYPE, LATEST_VERSION } from '../common';
import type { ClientConfigType } from '../common/types';
import { dataTiersUiSettingsConfig } from './ui_settings';
import {
  DataViewsServerPluginSetup,
  DataViewsServerPluginStart,
  DataViewsServerPluginSetupDependencies,
  DataViewsServerPluginStartDependencies,
} from './types';
import { DataViewsStorage } from './content_management';
import { cacheMaxAge } from './ui_settings';

export class DataViewsServerPlugin
  implements
    Plugin<
      DataViewsServerPluginSetup,
      DataViewsServerPluginStart,
      DataViewsServerPluginSetupDependencies,
      DataViewsServerPluginStartDependencies
    >
{
  private readonly logger: Logger;
  private rollupsEnabled: boolean = false;

  constructor(private readonly initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get('dataView');
  }

  public setup(
    core: CoreSetup<DataViewsServerPluginStartDependencies, DataViewsServerPluginStart>,
    { expressions, usageCollection, contentManagement }: DataViewsServerPluginSetupDependencies
  ) {
    core.savedObjects.registerType(dataViewSavedObjectType);
    core.capabilities.registerProvider(capabilitiesProvider);

    const config = this.initializerContext.config.get<ClientConfigType>();

    if (config.dataTiersExcludedForFields) {
      core.uiSettings.register(dataTiersUiSettingsConfig);
    }
    if (config.fieldListCachingEnabled) {
      core.uiSettings.register(cacheMaxAge);
    }

    const dataViewRestCounter = usageCollection?.createUsageCounter('dataViewsRestApi');

    registerRoutes({
      http: core.http,
      logger: this.logger,
      getStartServices: core.getStartServices,
      isRollupsEnabled: () => this.rollupsEnabled,
      dataViewRestCounter,
      hasEsDataTimeout: config.hasEsDataTimeout,
    });

    expressions.registerFunction(getIndexPatternLoad({ getStartServices: core.getStartServices }));
    registerIndexPatternsUsageCollector(core.getStartServices, usageCollection);
    core.deprecations.registerDeprecations(createScriptedFieldsDeprecationsConfig(core));

    contentManagement.register({
      id: DATA_VIEW_SAVED_OBJECT_TYPE,
      storage: new DataViewsStorage({
        throwOnResultValidationError: this.initializerContext.env.mode.dev,
        logger: this.logger.get('storage'),
      }),
      version: {
        latest: LATEST_VERSION,
      },
    });

    return {
      enableRollups: () => (this.rollupsEnabled = true),
    };
  }

  public start(
    { uiSettings, capabilities }: CoreStart,
    { fieldFormats }: DataViewsServerPluginStartDependencies
  ) {
    const config = this.initializerContext.config.get<ClientConfigType>();
    const scriptedFieldsEnabled = config.scriptedFieldsEnabled === false ? false : true; // accounting for null value

    const serviceFactory = dataViewsServiceFactory({
      logger: this.logger.get('indexPatterns'),
      uiSettings,
      fieldFormats,
      capabilities,
      scriptedFieldsEnabled,
      rollupsEnabled: this.rollupsEnabled,
    });

    return {
      dataViewsServiceFactory: serviceFactory,
      getScriptedFieldsEnabled: () => scriptedFieldsEnabled,
    };
  }

  public stop() {}
}

export { DataViewsServerPlugin as Plugin };

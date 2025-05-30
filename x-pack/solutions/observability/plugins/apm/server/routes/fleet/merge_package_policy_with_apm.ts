/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { APMIndices } from '@kbn/apm-sources-access-plugin/server';
import type { NewPackagePolicy } from '@kbn/fleet-plugin/common';
import type { APMInternalESClient } from '../../lib/helpers/create_es_client/create_internal_es_client';
import type { APMPluginStartDependencies } from '../../types';
import { listConfigurations } from '../settings/agent_configuration/list_configurations';
import {
  getPackagePolicyWithAgentConfigurations,
  getPackagePolicyWithSourceMap,
} from './get_package_policy_decorators';
import { listSourceMapArtifacts } from './source_maps';

export async function decoratePackagePolicyWithAgentConfigAndSourceMap({
  packagePolicy,
  internalESClient,
  fleetPluginStart,
  apmIndices,
}: {
  packagePolicy: NewPackagePolicy;
  internalESClient: APMInternalESClient;
  fleetPluginStart: NonNullable<APMPluginStartDependencies['fleet']>;
  apmIndices: APMIndices;
}) {
  const [agentConfigurations, { artifacts }] = await Promise.all([
    listConfigurations({ internalESClient, apmIndices }),
    listSourceMapArtifacts({ fleetPluginStart }),
  ]);

  const policyWithSourceMaps = getPackagePolicyWithSourceMap({
    packagePolicy,
    artifacts,
  });

  const policyWithAgentConfigAndSourceMaps = getPackagePolicyWithAgentConfigurations(
    policyWithSourceMaps,
    agentConfigurations
  );

  return policyWithAgentConfigAndSourceMaps;
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { FtrConfigProviderContext } from '@kbn/test';
export default async function ({ readConfigFile }: FtrConfigProviderContext) {
  const functionalConfig = await readConfigFile(
    require.resolve('../../../../../config/ess/config.base.frozen.trial')
  );

  return {
    ...functionalConfig.getAll(),
    kbnTestServer: {
      ...functionalConfig.get('kbnTestServer'),
      serverArgs: [...functionalConfig.get('kbnTestServer.serverArgs')],
    },
    testFiles: [require.resolve('..')],
    junit: {
      reportName: 'Core Analysis - Entity Store Integration Tests - ESS Env - Trial License',
    },
    mochaOpts: {
      ...functionalConfig.get('mochaOpts'),
      timeout: 360000 * 2,
    },
  };
}

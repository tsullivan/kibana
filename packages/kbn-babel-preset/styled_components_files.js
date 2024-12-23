/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

module.exports = {
  /**
   * Synchronized regex list of files that use `styled-components`.
   * Used by `kbn-babel-preset` and `kbn-eslint-config`.
   */
  USES_STYLED_COMPONENTS: [
    /packages[\/\\]kbn-ui-shared-deps-(npm|src)[\/\\]/,
    /src[\/\\]plugins[\/\\](kibana_react)[\/\\]/,
    /x-pack[\/\\]solutions[\/\\]observability[\/\\]plugins[\/\\](exploratory_view|investigate|investigate_app|observability|observability_ai_assistant_app|observability_ai_assistant_management|observability_solution|serverless_observability|streams|streams_app|synthetics|uptime|ux)[\/\\]/,
    /x-pack[\/\\]plugins[\/\\](observability_solution\/apm|beats_management|fleet|lists|observability_solution\/observability|observability_solution\/observability_shared|observability_solution\/exploratory_view|security_solution|timelines|observability_solution\/synthetics|observability_solution\/ux|observability_solution\/uptime)[\/\\]/,
    /x-pack[\/\\]solutions[\/\\]security[\/\\]plugins[\/\\](observability_solution\/apm|beats_management|fleet|observability_solution\/infra|lists|observability_solution\/observability|observability_solution\/observability_shared|observability_solution\/exploratory_view|security_solution|timelines|observability_solution\/synthetics|observability_solution\/ux|observability_solution\/uptime)[\/\\]/,
    /x-pack[\/\\]test[\/\\]plugin_functional[\/\\]plugins[\/\\]resolver_test[\/\\]/,
    /x-pack[\/\\]packages[\/\\]elastic_assistant[\/\\]/,
    /x-pack[\/\\]solutions[\/\\]security[\/\\]packages[\/\\]ecs_data_quality_dashboard[\/\\]/,
    /x-pack[\/\\]solutions[\/\\]security[\/\\]plugins[\/\\]security_solution[\/\\]/,
    /x-pack[\/\\]platform[\/\\]packages[\/\\]shared[\/\\]kbn-elastic-assistant[\/\\]/,
  ],
};

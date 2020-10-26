/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { i18n } from '@kbn/i18n';
import { I18nProvider } from '@kbn/i18n/react';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { Observable } from 'rxjs';
import { ManagementAppMountParams, ManagementSetup } from 'src/plugins/management/public';
import { ILicense } from '../../../licensing/public';

export function registerBackgroundSessionsManagement(
  management: ManagementSetup,
  license$: Observable<ILicense>
) {
  const title = i18n.translate('xpack.backgroundSessions.management.title', {
    defaultMessage: 'Background Sessions',
  });
  const breadcrumbText = i18n.translate('xpack.backgroundSessions.management.breadcrumb', {
    defaultMessage: 'Background Sessions',
  });
  management.sections.section.data.registerApp({
    id: 'background_sessions',
    title,
    order: 3,
    mount: async (params) => {
      params.setBreadcrumbs([{ text: breadcrumbText }]);
      return await mountManagementSection(license$, params);
    },
  });
}

async function mountManagementSection(
  license$: Observable<ILicense>,
  params: ManagementAppMountParams
) {
  render(
    <I18nProvider>
      <p>Hey whats happenin</p>
    </I18nProvider>,
    params.element
  );

  return () => {
    unmountComponentAtNode(params.element);
  };
}

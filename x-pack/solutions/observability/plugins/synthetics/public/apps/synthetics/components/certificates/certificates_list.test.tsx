/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React from 'react';
import { CertificateList, CertSort } from './certificates_list';
import { render } from '../../utils/testing';
import { Cert } from '../../../../../common/runtime_types';

describe('CertificateList', () => {
  it('render empty state', () => {
    const page = {
      index: 0,
      size: 10,
    };
    const sort: CertSort = {
      field: 'not_after',
      direction: 'asc',
    };

    const { getByText } = render(
      <CertificateList
        page={page}
        sort={sort}
        onChange={jest.fn()}
        certificates={{ isLoading: false, total: 0, certs: [] }}
      />
    );

    expect(getByText('No Certificates found.')).toBeInTheDocument();
  });

  it('renders certificates list', () => {
    const page = {
      index: 0,
      size: 10,
    };
    const sort: CertSort = {
      field: 'not_after',
      direction: 'asc',
    };

    const { getByText } = render(
      <CertificateList
        page={page}
        sort={sort}
        onChange={jest.fn()}
        certificates={{
          isLoading: false,
          total: 1,
          certs: [
            {
              monitors: [
                {
                  name: 'BadSSL Expired',
                  id: 'expired-badssl',
                  url: 'https://expired.badssl.com/',
                },
              ],
              issuer: 'COMODO RSA Domain Validation Secure Server CA',
              sha1: '404bbd2f1f4cc2fdeef13aabdd523ef61f1c71f3',
              sha256: 'ba105ce02bac76888ecee47cd4eb7941653e9ac993b61b2eb3dcc82014d21b4f',
              not_after: '2015-04-12T23:59:59.000Z',
              not_before: '2015-04-09T00:00:00.000Z',
              common_name: '*.badssl.com',
              configId: 'uptime-advanced-http-tls',
            } as Cert,
          ],
        }}
      />
    );

    expect(getByText('BadSSL Expired')).toBeInTheDocument();
  });
});

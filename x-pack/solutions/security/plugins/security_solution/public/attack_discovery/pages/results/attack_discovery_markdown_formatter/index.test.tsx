/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { TestProviders } from '../../../../common/mock';
import { AttackDiscoveryMarkdownFormatter } from '.';

describe('AttackDiscoveryMarkdownFormatter', () => {
  const markdown = `
  The following attack chain was detected involving Microsoft Office documents on multiple hosts:

- On {{ host.name 39054a91-67f9-46fa-b9d1-85f928d4cd1b }}, a malicious Microsoft Office document was opened by {{ user.name 2c13d131-8fab-41b9-841e-669c66315a23 }}.
- This document launched a child process to write and execute a malicious script file named "AppPool.vbs".
- The "AppPool.vbs" script then spawned PowerShell to execute an obfuscated script payload from "AppPool.ps1".
- On {{ host.name 5149b291-72d0-4373-93ec-c117477932fe }}, a similar attack involving a malicious Office document and the creation of "AppPool.vbs" was detected and prevented.

This appears to be a malware attack delivered via spearphishing, likely exploiting a vulnerability in Microsoft Office to gain initial access and then using PowerShell for execution and obfuscation. The attacker employed defense evasion techniques like script obfuscation and system binary proxies like "wscript.exe" and "mshta.exe". Mitigations should focus on patching Office vulnerabilities, restricting script execution, and enhancing email security controls.
  `;

  it('renders the expected markdown', () => {
    render(
      <TestProviders>
        <AttackDiscoveryMarkdownFormatter markdown={markdown} />
      </TestProviders>
    );

    const result = screen.getByTestId('attackDiscoveryMarkdownFormatter');

    expect(result).toHaveTextContent(
      'The following attack chain was detected involving Microsoft Office documents on multiple hosts: On 39054a91-67f9-46fa-b9d1-85f928d4cd1b, a malicious Microsoft Office document was opened by 2c13d131-8fab-41b9-841e-669c66315a23. This document launched a child process to write and execute a malicious script file named "AppPool.vbs". The "AppPool.vbs" script then spawned PowerShell to execute an obfuscated script payload from "AppPool.ps1". On 5149b291-72d0-4373-93ec-c117477932fe, a similar attack involving a malicious Office document and the creation of "AppPool.vbs" was detected and prevented. This appears to be a malware attack delivered via spearphishing, likely exploiting a vulnerability in Microsoft Office to gain initial access and then using PowerShell for execution and obfuscation. The attacker employed defense evasion techniques like script obfuscation and system binary proxies like "wscript.exe" and "mshta.exe". Mitigations should focus on patching Office vulnerabilities, restricting script execution, and enhancing email security controls.'
    );
  });

  it('renders interactive host entities', () => {
    render(
      <TestProviders>
        <AttackDiscoveryMarkdownFormatter markdown={markdown} />
      </TestProviders>
    );

    const entities = screen.getAllByTestId('entityButton');

    expect(entities.length).toEqual(3);
  });

  it('renders NON-interactive host entities when disableActions is true', () => {
    render(
      <TestProviders>
        <AttackDiscoveryMarkdownFormatter disableActions={true} markdown={markdown} />
      </TestProviders>
    );

    const entities = screen.queryAllByTestId('entityButton');

    expect(entities.length).toEqual(0); // <-- no interactive buttons
  });
});

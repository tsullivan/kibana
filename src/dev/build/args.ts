/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import getopts from 'getopts';
import { ToolingLog, pickLevelFromFlags } from '@kbn/tooling-log';

import { BuildOptions } from './build_distributables';

export function readCliArgs(argv: string[]) {
  const unknownFlags: string[] = [];
  const flags = getopts(argv, {
    boolean: [
      'skip-archives',
      'skip-cdn-assets',
      'skip-initialize',
      'skip-generic-folders',
      'skip-platform-folders',
      'skip-os-packages',
      'skip-canvas-shareable-runtime',
      'rpm',
      'deb',
      'docker-context-use-local-artifact',
      'docker-cross-compile',
      'docker-images',
      'docker-push',
      'skip-docker-contexts',
      'skip-docker-ubi',
      'skip-docker-wolfi',
      'skip-docker-cloud',
      'skip-docker-cloud-fips',
      'skip-docker-serverless',
      'skip-docker-fips',
      'release',
      'skip-node-download',
      'skip-cloud-dependencies-download',
      'verbose',
      'debug',
      'all-platforms',
      'verbose',
      'quiet',
      'silent',
      'debug',
      'help',
      'with-test-plugins',
      'with-example-plugins',
      'serverless',
    ],
    string: ['docker-namespace', 'epr-registry'],
    alias: {
      v: 'verbose',
      d: 'debug',
    },
    default: {
      debug: true,
      rpm: null,
      deb: null,
      'docker-images': null,
      'docker-context-use-local-artifact': null,
      'docker-cross-compile': false,
      'docker-push': false,
      'docker-tag': null,
      'docker-tag-qualifier': null,
      'docker-namespace': null,
      'version-qualifier': '',
      'epr-registry': 'snapshot',
    },
    unknown: (flag) => {
      unknownFlags.push(flag);
      return false;
    },
  });

  const log = new ToolingLog({
    level: pickLevelFromFlags(flags, {
      default: flags.debug === false ? 'info' : 'debug',
    }),
    writeTo: process.stdout,
  });

  if (unknownFlags.length || flags.help) {
    return {
      log,
      showHelp: true,
      unknownFlags,
    };
  }

  // In order to build a docker image we always need
  // to generate all the platforms
  if (flags['docker-images']) {
    flags['all-platforms'] = true;
  }

  function isOsPackageDesired(name: string) {
    if (flags['skip-os-packages'] || !flags['all-platforms']) {
      return false;
    }

    // build all if no flags specified
    if (flags.rpm === null && flags.deb === null && flags['docker-images'] === null) {
      return true;
    }

    return Boolean(flags[name]);
  }

  const eprRegistry = flags['epr-registry'];
  if (eprRegistry !== 'snapshot' && eprRegistry !== 'production') {
    log.error(
      `Invalid value for --epr-registry, must be 'production' or 'snapshot', got ${eprRegistry}`
    );
    return {
      log,
      showHelp: true,
      unknownFlags: [],
    };
  }

  const buildOptions: BuildOptions = {
    isRelease: Boolean(flags.release),
    versionQualifier: flags['version-qualifier'],
    dockerContextUseLocalArtifact: flags['docker-context-use-local-artifact'],
    dockerCrossCompile: Boolean(flags['docker-cross-compile']),
    dockerNamespace: flags['docker-namespace'],
    dockerPush: Boolean(flags['docker-push']),
    dockerTag: flags['docker-tag'],
    dockerTagQualifier: flags['docker-tag-qualifier'],
    initialize: !Boolean(flags['skip-initialize']),
    downloadFreshNode: !Boolean(flags['skip-node-download']),
    downloadCloudDependencies: !Boolean(flags['skip-cloud-dependencies-download']),
    createGenericFolders: !Boolean(flags['skip-generic-folders']),
    createPlatformFolders: !Boolean(flags['skip-platform-folders']),
    createArchives: !Boolean(flags['skip-archives']),
    createCdnAssets: !Boolean(flags['skip-cdn-assets']),
    createRpmPackage: isOsPackageDesired('rpm'),
    createDebPackage: isOsPackageDesired('deb'),
    createDockerWolfi: isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-wolfi']),
    createDockerCloud: isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-cloud']),
    createDockerCloudFIPS:
      isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-cloud-fips']),
    createDockerServerless:
      (isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-serverless'])) ||
      Boolean(flags.serverless),
    createDockerUBI: isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-ubi']),
    createDockerContexts: !Boolean(flags['skip-docker-contexts']),
    createDockerFIPS: isOsPackageDesired('docker-images') && !Boolean(flags['skip-docker-fips']),
    targetAllPlatforms: Boolean(flags['all-platforms']),
    targetServerlessPlatforms: Boolean(flags.serverless),
    eprRegistry: flags['epr-registry'],
    buildCanvasShareableRuntime: !Boolean(flags['skip-canvas-shareable-runtime']),
    withExamplePlugins: Boolean(flags['with-example-plugins']),
    withTestPlugins: Boolean(flags['with-test-plugins']),
  };

  return {
    log,
    showHelp: false,
    unknownFlags: [],
    buildOptions,
  };
}

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  EuiBadge,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiTitle,
  EuiText,
  EuiSpacer,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';
import { getFieldValue } from '@kbn/discover-utils';
import React, { useState } from 'react';
import moment from 'moment';
import type { RootProfileProvider } from '../../../profiles';
import { SolutionType } from '../../../profiles';
import { PetsContextProvider } from '../pets_context';

export const createPetsRootProfileProvider = (): RootProfileProvider => ({
  profileId: 'pets-root-profile',
  isExperimental: false,
  profile: {
    getRenderAppWrapper,
    getDefaultAdHocDataViews,
    getCellRenderers: (prev) => (params) => ({
      ...prev(params),
      '@timestamp': (props) => {
        const timestamp = getFieldValue(props.row, '@timestamp') as string;
        const formattedDate = moment(timestamp).format('MMM D, h:mm A');
        const fullDate = moment(timestamp).format('MMMM D, YYYY [at] h:mm:ss A');

        return (
          <EuiBadge color="#edc8f4" title={fullDate} data-test-subj="petsRootProfileTimestamp">
            {formattedDate}
          </EuiBadge>
        );
      },
    }),
  },
  resolve: (params) => {
    if (params.solutionNavId != null) {
      return { isMatch: false };
    }

    return { isMatch: true, context: { solutionType: SolutionType.Default } };
  },
});

const getRenderAppWrapper: RootProfileProvider['profile']['getRenderAppWrapper'] =
  (PrevWrapper) =>
  ({ children }) => {
    const [currentMessage, setCurrentMessage] = useState<string | undefined>(undefined);
    const [showChildFlyout, setShowChildFlyout] = useState(false);

    const handleCloseParentFlyout = () => {
      setCurrentMessage(undefined);
      setShowChildFlyout(false);
    };

    const handleCloseChildFlyout = () => {
      setShowChildFlyout(false);
    };

    return (
      <PrevWrapper>
        <PetsContextProvider value={{ currentMessage, setCurrentMessage }}>
          {children}
          {currentMessage && (
            <EuiFlyout
              type="push"
              size="m"
              onClose={handleCloseParentFlyout}
              data-test-subj="petsRootProfileFlyout"
              aria-labelledby="petsFlyoutTitle"
              session="start"
              flyoutMenuProps={{ title: 'Pet Details' }}
            >
              <EuiFlyoutHeader hasBorder>
                <EuiTitle size="s">
                  <h2 id="petsFlyoutTitle">
                    <span role="img" aria-label="paw prints">
                      🐾
                    </span>{' '}
                    Pet Details
                  </h2>
                </EuiTitle>
              </EuiFlyoutHeader>
              <EuiFlyoutBody>
                <EuiText>
                  <h3>Pet Information</h3>
                  <p>{currentMessage}</p>
                </EuiText>
                <EuiSpacer />
                <EuiText size="s" color="subdued">
                  <p>
                    Click the button below to open additional pet care information in a child
                    flyout!
                  </p>
                </EuiText>
                <EuiSpacer />
                <EuiFlexGroup gutterSize="s">
                  <EuiFlexItem grow={false}>
                    <EuiButton
                      onClick={() => setShowChildFlyout(true)}
                      iconType="documents"
                      size="s"
                      disabled={showChildFlyout}
                    >
                      View Care Guide
                    </EuiButton>
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                    <EuiButtonEmpty
                      onClick={handleCloseParentFlyout}
                      size="s"
                      aria-label="Close flyout"
                    >
                      Close
                    </EuiButtonEmpty>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiFlyoutBody>
              {showChildFlyout && (
                <EuiFlyout
                  type="push"
                  size="s"
                  onClose={handleCloseChildFlyout}
                  data-test-subj="petsChildFlyout"
                  aria-labelledby="petsChildFlyoutTitle"
                  flyoutMenuProps={{
                    title: 'Pet Care Guide',
                    titleId: 'petsChildFlyoutTitle',
                  }}
                >
                  <EuiFlyoutHeader hasBorder>
                    <EuiTitle size="s">
                      <h2 id="petsChildFlyoutTitle">
                        <span role="img" aria-label="clipboard">
                          📋
                        </span>{' '}
                        Pet Care Guide
                      </h2>
                    </EuiTitle>
                  </EuiFlyoutHeader>
                  <EuiFlyoutBody>
                    <EuiText size="s">
                      <h4>General Care Tips:</h4>
                      <ul>
                        <li>
                          <span role="img" aria-label="food">
                            🥗
                          </span>{' '}
                          Provide fresh food and water daily
                        </li>
                        <li>
                          <span role="img" aria-label="exercise">
                            🏃
                          </span>{' '}
                          Regular exercise and playtime
                        </li>
                        <li>
                          <span role="img" aria-label="vaccination">
                            💉
                          </span>{' '}
                          Keep vaccinations up to date
                        </li>
                        <li>
                          <span role="img" aria-label="love">
                            ❤️
                          </span>{' '}
                          Lots of love and attention!
                        </li>
                        <li>
                          <span role="img" aria-label="veterinarian">
                            🏥
                          </span>{' '}
                          Annual vet checkups
                        </li>
                      </ul>
                    </EuiText>
                    <EuiSpacer />
                    <EuiText size="s" color="subdued">
                      <p>
                        This is a stacked flyout! It appears on top of the parent flyout thanks to
                        the EUI Flyout System. You can have multiple levels of flyouts for complex
                        workflows.
                      </p>
                    </EuiText>
                    <EuiSpacer />
                    <EuiButton onClick={handleCloseChildFlyout} fill size="s">
                      Got it!
                    </EuiButton>
                  </EuiFlyoutBody>
                  <EuiFlyoutFooter>
                    <EuiFlexGroup justifyContent="flexEnd">
                      <EuiFlexItem grow={false}>
                        <EuiButtonEmpty
                          onClick={handleCloseChildFlyout}
                          aria-label="Close"
                          size="s"
                        >
                          Close
                        </EuiButtonEmpty>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiFlyoutFooter>
                </EuiFlyout>
              )}
            </EuiFlyout>
          )}
        </PetsContextProvider>
      </PrevWrapper>
    );
  };

const getDefaultAdHocDataViews: RootProfileProvider['profile']['getDefaultAdHocDataViews'] =
  (prev) => () =>
    [
      ...prev(),
      {
        id: 'pets-root-profile-ad-hoc-data-view',
        name: 'Pets profile data view',
        title: 'pet-adoption-center',
        timeFieldName: '@timestamp',
      },
    ];

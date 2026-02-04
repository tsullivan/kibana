/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the "Elastic License
 * 2.0", the "GNU Affero General Public License v3.0 only", and the "Server Side
 * Public License v 1"; you may not use this file except in compliance with, at
 * your election, the "Elastic License 2.0", the "GNU Affero General Public
 * License v3.0 only", or the "Server Side Public License, v 1".
 */

import {
  EuiButton,
  EuiCallOut,
  EuiCode,
  EuiFieldText,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiFormRow,
  EuiPageTemplate,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';
import type { OverlayStart } from '@kbn/core/public';
import React, { useState } from 'react';

const FlyoutComponentTest: React.FC = () => {
  const [isOpenFlyoutA, setIsOpenFlyoutA] = useState(false);
  const [isOpenFlyoutB, setIsOpenFlyoutB] = useState(false);
  const [isOpenFlyoutBChild, setIsOpenFlyoutBChild] = useState(false);
  const [name, setName] = useState('');

  return (
    <>
      <EuiButton disabled={isOpenFlyoutA} onClick={() => setIsOpenFlyoutA((val) => !val)}>
        EUI component test: Open Flyout A
      </EuiButton>
      {isOpenFlyoutA && (
        <EuiFlyout
          session="start"
          type="push"
          pushMinBreakpoint="xs"
          size="s"
          aria-labelledby="welcomeHeading"
          flyoutMenuProps={{ title: 'Flyout A' }}
          onClose={() => setIsOpenFlyoutA(false)}
        >
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2 id="welcomeHeading">Push flyout</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiText>
              This is <strong>Flyout A</strong>. This flyout is rendered with the{' '}
              <EuiCode>{'session="start"'}</EuiCode> prop set which created a new flyout session and
              marks this flyout as main.
            </EuiText>
            <EuiSpacer />
            <EuiFormRow label="What's your name?" fullWidth>
              <EuiFieldText value={name} onChange={(e) => setName(e.target.value)} />
            </EuiFormRow>
            <EuiSpacer />
            <EuiButton
              onClick={() => {
                setIsOpenFlyoutB(true);
              }}
            >
              Next step
            </EuiButton>
          </EuiFlyoutBody>
        </EuiFlyout>
      )}
      {isOpenFlyoutB && (
        <EuiFlyout
          session="start"
          type="overlay"
          size="m"
          aria-labelledby="flyoutBHeading"
          flyoutMenuProps={{ title: 'Flyout B' }}
          onClose={() => setIsOpenFlyoutB(false)}
        >
          <EuiFlyoutHeader>
            <EuiTitle>
              <h2 id="flyoutBHeading">Overlay flyout</h2>
            </EuiTitle>
          </EuiFlyoutHeader>
          <EuiFlyoutBody>
            <EuiText>
              This is <strong>Flyout B</strong>. This flyout is also rendered with the{' '}
              <EuiCode>{'session="start"'}</EuiCode> prop added which creates a{' '}
              <strong>second flyout session</strong> and marks this flyout as main in that session.
              <br />
              <br />
              <strong>Flyout A</strong> exists but is currently hidden since this one took
              precedence. You can jump back to it by clicking the <i>Back</i> button above if you
              like.
            </EuiText>
            <EuiSpacer />
            <EuiButton onClick={() => setIsOpenFlyoutBChild((val) => !val)}>
              {isOpenFlyoutBChild ? 'Close child flyout' : 'Open child flyout'}
            </EuiButton>
          </EuiFlyoutBody>
          {isOpenFlyoutBChild && (
            <EuiFlyout
              size="s"
              aria-label="Child of Flyout B"
              onClose={() => setIsOpenFlyoutBChild(false)}
            >
              <EuiFlyoutBody>
                <EuiText>
                  This is a <strong>child flyout</strong> of Flyout B. It belongs to the same
                  session as Flyout B because it is rendered inside of it (nested in the JSX tree).
                  <br />
                  <br />
                  If you close <i>Flyout B - main</i>, this flyout will close, too.
                </EuiText>
                <EuiSpacer />
                <EuiText>Try out the Back button to transition back to Flyout A</EuiText>
                <EuiSpacer />
                <EuiButton
                  onClick={() => {
                    setIsOpenFlyoutB(false);
                    setIsOpenFlyoutA(false);
                  }}
                >
                  Close all
                </EuiButton>
              </EuiFlyoutBody>
            </EuiFlyout>
          )}
        </EuiFlyout>
      )}
    </>
  );
};

const FlyoutSystemTest: React.FC<{ overlays: OverlayStart }> = ({ overlays }) => {
  const openParentFlyout = () => {
    const parentFlyout = overlays.openSystemFlyout(
      <ParentFlyoutContent overlays={overlays} onClose={() => parentFlyout.close()} />,
      {
        id: 'parent-flyout-demo',
        title: 'Parent Flyout (session: start)',
        session: 'start',
        size: 'm',
        type: 'overlay',
        ownFocus: true,
        outsideClickCloses: false,
      }
    );
  };

  return <EuiButton onClick={openParentFlyout}>Open Parent Flyout (Reproduce Bug)</EuiButton>;
};

const ParentFlyoutContent: React.FC<{ overlays: OverlayStart; onClose: () => void }> = ({
  overlays,
  onClose,
}) => {
  const openChildFlyout = () => {
    overlays.openSystemFlyout(<ChildFlyoutContent />, {
      id: 'child-flyout-demo',
      title: 'Child Flyout (session: inherit)',
      session: 'inherit',
      size: 's',
      type: 'overlay',
      outsideClickCloses: false,
    });
  };

  return (
    <>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2>Parent Flyout</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiCallOut title="This is the parent flyout" color="primary" iconType="iInCircle">
          <p>
            This flyout was opened with <EuiCode>session: &quot;start&quot;</EuiCode>.
          </p>
        </EuiCallOut>
        <EuiSpacer size="l" />
        <EuiText>
          <p>
            Now click the button below to open a child flyout. The child will use{' '}
            <EuiCode>session: &quot;inherit&quot;</EuiCode> which means it should be part of this
            parent&apos;s session.
          </p>
        </EuiText>
        <EuiSpacer size="m" />
        <EuiButton onClick={openChildFlyout} iconType="arrowRight">
          Open Child Flyout
        </EuiButton>
        <EuiSpacer size="l" />
        <EuiCallOut title="Now close this parent flyout" color="warning">
          <p>
            After opening the child flyout above, close this parent flyout using the button below.
            Watch what happens to the child flyout - it should close automatically but it
            doesn&apos;t (this is the bug).
          </p>
        </EuiCallOut>
        <EuiSpacer size="m" />
        <EuiText size="s">
          <p>
            <strong>Check the browser console</strong> for debug logs showing:
          </p>
          <ul>
            <li>When flyouts are opened (with their session type)</li>
            <li>Active flyouts list</li>
            <li>When flyouts are closed</li>
          </ul>
          <p>
            You&apos;ll see the child flyout remains in the active flyouts list after the parent
            closes.
          </p>
        </EuiText>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiButton onClick={onClose} iconType="cross">
          Close Parent (Trigger Bug)
        </EuiButton>
      </EuiFlyoutFooter>
    </>
  );
};

const ChildFlyoutContent: React.FC = () => {
  return (
    <>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="s">
          <h3>Child Flyout</h3>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiCallOut title="This is the child flyout" color="success" iconType="check">
          <p>
            This flyout was opened with <EuiCode>session: &quot;inherit&quot;</EuiCode>.
          </p>
          <p>It correctly appears as a child (stacked on top of the parent).</p>
        </EuiCallOut>
        <EuiSpacer size="l" />
        <EuiCallOut
          title="🐛 Bug: This flyout should close automatically"
          color="danger"
          iconType="alert"
        >
          <p>
            When you close the parent flyout, this child flyout should automatically close since
            it&apos;s part of the same session (<EuiCode>session: &quot;inherit&quot;</EuiCode>).
          </p>
          <p>
            <strong>But it doesn&apos;t!</strong> The child stays open even after the parent closes.
          </p>
        </EuiCallOut>
        <EuiSpacer size="m" />
        <EuiText size="s">
          <p>Go back to the parent flyout and click &quot;Close Parent&quot; to see the bug.</p>
          <p>This child flyout will remain open and you&apos;ll need to close it manually.</p>
        </EuiText>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiText size="xs" color="subdued">
          <p>This flyout should have closed automatically when the parent closed.</p>
        </EuiText>
      </EuiFlyoutFooter>
    </>
  );
};

export const OverviewPageFooter: React.FC<{ overlays: OverlayStart }> = ({ overlays }) => {
  return (
    <EuiPageTemplate.Section component="footer" className="kbnOverviewPageFooter">
      <FlyoutComponentTest />
      <br />
      <br /> <FlyoutSystemTest overlays={overlays} />
    </EuiPageTemplate.Section>
  );
};

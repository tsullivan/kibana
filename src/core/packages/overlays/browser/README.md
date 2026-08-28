# @kbn/core-overlays-browser

This package contains the public types for Core's browser-side Overlays service.

## Flyouts Services

### `overlays.openFlyout`

Opens a traditional flyout using a `MountPoint`. This method requires wrapping React content with `toMountPoint`.

```typescript
import { toMountPoint } from '@kbn/react-kibana-mount';
import { 
  EuiFlyoutHeader, 
  EuiFlyoutBody, 
  EuiFlyoutFooter,
  EuiTitle, 
  EuiText,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem 
} from '@elastic/eui';

// Open a flyout with a mount point
const flyoutRef = overlays.openFlyout(
  toMountPoint(
    <>
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2 id="myFlyoutTitle">My Flyout</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiText>
          <p>This is a flyout opened using the traditional method.</p>
        </EuiText>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty onClick={() => flyoutRef.close()}>
              Cancel
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={() => console.log('Save')} fill>
              Save
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </>,
    core
  ),
  {
    size: 'm',
    type: 'overlay',
    paddingSize: 'm',
    maxWidth: 600,
    ownFocus: true,
    outsideClickCloses: true,
    'aria-labelledby': 'myFlyoutTitle',
    onClose: (flyout) => {
      console.log('Flyout closed');
      flyout.close();
    },
  }
);

// Close the flyout programmatically
flyoutRef.close();
```

### `overlays.openFlyoutTemplate`

Opens a system flyout rendered as a `FlyoutTemplate` — the sanctioned way to build flyout content in Kibana — from a descriptor object describing every zone (header, body, footer) as data. Like `openSystemFlyout`, it integrates with the EUI Flyout Manager for session, history, and cascade-close support.

For the full descriptor reference (body items, sections, subsections, tabs, header badges/meta blocks/info blocks, footer actions, and the `Content: ComponentType` idiom), see the [`@kbn/flyout-template` README](../../../../platform/packages/shared/shared-ux/flyout/template/README.md#descriptor-front-end-for-imperative-hosts). This section only shows the shape at the core boundary.

```typescript
const flyoutRef = overlays.openFlyoutTemplate({
  title: 'My Flyout',
  size: 'm',
  maxWidth: 600,
  ownFocus: false,
  body: [
    {
      kind: 'section',
      title: 'Details',
      items: [
        {
          kind: 'content',
          Content: () => <p>This is a system flyout rendered as a FlyoutTemplate.</p>,
        },
      ],
    },
  ],
  footer: {
    secondaryAction: { label: 'Cancel', onClick: (flyout) => flyout.close() },
    primaryAction: { label: 'Save', onClick: () => console.log('Save') },
  },
  onClose: (flyout) => {
    console.log('Flyout closed');
    flyout.close();
  },
});

// Close the flyout programmatically
flyoutRef.close();
```

Core does not re-export the descriptor types (`FlyoutTemplateDescriptor`, `FlyoutTemplateBodyItem`, etc.) — a caller that needs to name one imports it from `@kbn/flyout-template` directly and adds that package to its own `kbn_references`. Most callers will not need to: object literals passed straight to `openFlyoutTemplate`, as in the example above, are inferred contextually with no import at all.

### `overlays.openSystemFlyout` (deprecated)

> **Deprecated.** Use [`overlays.openFlyoutTemplate`](#overlaysopenflyouttemplate) instead.

### Key Differences

- **`openFlyout`**: Traditional method that requires `toMountPoint`. Opens flyouts with `session="never"`. Content should include `EuiFlyoutHeader` and `EuiFlyoutBody`. Optionally include `EuiFlyoutFooter`.
- **`openFlyoutTemplate`**: The recommended method for session-based flyouts. Opens flyouts with `session="start"` for full EUI Flyout System integration, rendered as a `FlyoutTemplate` from a descriptor object — no hand-composed `EuiFlyoutHeader`/`Body`/`Footer`.
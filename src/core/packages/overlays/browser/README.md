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

> **Deprecated.** Use [`overlays.openFlyoutTemplate`](#overlaysopenflyouttemplate) instead. The "Content should include `EuiFlyoutBody`" contract this method documents below is exactly what `openFlyoutTemplate` replaces: it renders a real `FlyoutTemplate`, so callers stop hand-composing `EuiFlyoutBody`/`EuiFlyoutFooter` chrome.

Opens a system flyout that integrates with the EUI Flyout Manager. Using a mount point would break the context propogation of the EUI Flyout Manager, so this method accepts React elements directly rather than `toMountPoint`.

```typescript
import React, { useRef } from 'react';
import { 
  EuiFlyoutBody, 
  EuiFlyoutFooter,
  EuiText,
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem 
} from '@elastic/eui';
import type { OverlayRef } from '@kbn/core-mount-utils-browser';

// Create a component or function that opens the system flyout
const openMySystemFlyout = (overlays) => {
  const flyoutRef = useRef<OverlayRef | null>(null);
  
  const handleClose = () => {
    if (flyoutRef.current) {
      flyoutRef.current.close();
    }
  };

  const FlyoutContent = () => (
    <>
      <EuiFlyoutBody>
        <EuiText>
          <p>This is a system flyout that integrates with EUI Flyout Manager.</p>
          <p>The header is automatically created from the title option.</p>
        </EuiText>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty onClick={handleClose}>
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
    </>
  );

  flyoutRef.current = overlays.openSystemFlyout(<FlyoutContent />, {
    title: 'My System Flyout',
    type: 'overlay',
    size: 'm',
    maxWidth: 600,
    ownFocus: false,
    onClose: () => {
      console.log('System flyout closed');
      flyoutRef.current = null;
    },
    onActive: () => {
      console.log('System flyout became active');
    },
  });

  return flyoutRef.current;
};

// Open the flyout
const flyoutRef = openMySystemFlyout(overlays);

// Close the flyout programmatically from outside
flyoutRef.close();
```

#### Title Configuration

The `title` option is used by the EUI Flyout Manager for history navigation and creates the flyout menu header. You can provide the title in two ways:

1. **Top-level `title` option**:
```typescript
overlays.openSystemFlyout(<MyContent />, {
  title: 'My Flyout Title',
  // ... other options
});
```

2. **Within `flyoutMenuProps.title`**:
```typescript
overlays.openSystemFlyout(<MyContent />, {
  flyoutMenuProps: {
    title: 'My Flyout Title',
    hideTitle: false,
    'data-test-subj': 'myFlyout',
    // ... other flyout menu props
  },
  // ... other options
});
```

**Precedence behavior:** If you provide `title` in both places, `flyoutMenuProps.title` takes precedence over the top-level `title`.

```typescript
// Example: flyoutMenuProps.title takes precedence
overlays.openSystemFlyout(<MyContent />, {
  title: 'Default Title',  // This will be ignored
  flyoutMenuProps: {
    title: 'Override Title',  // This will be used
  },
});
```

### Key Differences

- **`openFlyout`**: Traditional method that requires `toMountPoint`. Opens flyouts with `session="never"`. Content should include `EuiFlyoutHeader` and `EuiFlyoutBody`. Optionally include `EuiFlyoutFooter`.
- **`openFlyoutTemplate`**: The recommended method for session-based flyouts. Opens flyouts with `session="start"` for full EUI Flyout System integration, rendered as a `FlyoutTemplate` from a descriptor object — no hand-composed `EuiFlyoutHeader`/`Body`/`Footer`.
- **`openSystemFlyout`** *(deprecated)*: Accepts React elements directly. Opens flyouts with `session="start"` for full EUI Flyout System integration, supporting features like flyout navigation and stacking. Content should not include `EuiFlyoutHeader`, as an `EuiFlyoutMenu` is created automatically from the `title` option. Content should include `EuiFlyoutBody`, and optionally `EuiFlyoutFooter`.
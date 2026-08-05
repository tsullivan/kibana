# @kbn/shared-ux-flyout-metadata

`MetadataPairs` renders a compact, responsive row of key-value pairs — the metadata line used beneath a flyout title.

## Usage

```tsx
import { MetadataPairs } from '@kbn/shared-ux-flyout-metadata';

<MetadataPairs
  items={[
    { title: 'Last updated', value: 'Dec 3, 2025' },
    { title: 'Owner', value: 'Platform' },
  ]}
/>
```

## Behavior

-   Up to three columns, wrapping into further rows. The item count is unbounded, though (3) is the designed maximum.
-   Responsive flow thresholds derive from `FLYOUT_MIN_CELL_WIDTH` from '@kbn/flyout-common'
-   Titles and values accept arbitrary `ReactNode`, to allow rich content.
-   An empty `items` array renders nothing.
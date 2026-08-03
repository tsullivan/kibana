# @kbn/shared-ux-flyout-metadata

`MetadataPairs` renders a compact, responsive row of key-value pairs — the metadata line
used beneath a flyout title.

```tsx
import { MetadataPairs } from '@kbn/shared-ux-flyout-metadata';

<MetadataPairs
  items={[
    { title: 'Last updated', value: 'Dec 3, 2025' },
    { title: 'Owner', value: 'Platform' },
  ]}
/>;
```

Usable on its own, so a flyout can adopt this presentation before migrating wholesale to
`FlyoutTemplate`. Inside the template it is rendered from the declarative
`FlyoutTemplate.Header.Metadata` parts.

## Layout

Up to three columns, wrapping into further rows; the item count is unbounded, though
`MAX_METADATA_ITEMS` (3) is the designed maximum and exceeding it warns in development.

Reflow is driven by **container queries**, not media queries: this renders inside a flyout
that is resizable and can be `push` type, so its width is independent of the viewport's.
Thresholds derive from `FLYOUT_MIN_CELL_WIDTH`, shared with the info blocks so both grids
collapse at the same width.

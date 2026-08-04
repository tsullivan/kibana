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

- Up to three columns, wrapping into further rows. The item count is unbounded, though `MAX_METADATA_ITEMS` (3) is the designed maximum and exceeding it warns in development.
- Reflow is driven by **container queries**, not media queries: this renders inside a flyout that is resizable and can be `push` type, so its width is independent of the viewport's. Thresholds derive from `FLYOUT_MIN_CELL_WIDTH`, shared with the info blocks so both grids collapse at the same width.
- At two columns a trailing odd pair spans both columns; below two columns each pair takes its own row.
- Each pair truncates to a single line with an ellipsis rather than wrapping, at every layout.
- Titles and values accept arbitrary `ReactNode`, so a value can be a link, badge, or other rich content. Link values are reset to regular weight so they don't inherit the title's bold.
- An empty `items` array renders nothing.

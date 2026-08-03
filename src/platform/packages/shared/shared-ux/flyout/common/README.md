# @kbn/shared-ux-flyout-common

Shared types and constants for the flyout template and its standalone parts.

This package is a leaf: it has no runtime dependencies on the other flyout packages, so
`@kbn/shared-ux-flyout-info-blocks`, `@kbn/shared-ux-flyout-metadata`, and
`@kbn/shared-ux-flyout-template` can all depend on it without a cycle.

It holds:

- **Public prop types** for the template's declarative parts, plus the item/props types for
  the standalone presentational components.
- **Shared layout constants**, notably `FLYOUT_MIN_CELL_WIDTH`. Both the metadata pairs and
  the info blocks derive their responsive thresholds from it so the two grids drop a column
  at the same container width.

Consumers of a single component do not need to import from here — each component package
re-exports its own types.

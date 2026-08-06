# @kbn/shared-ux-flyout-template

`FlyoutTemplate` gives you a flyout that already follows the Elastic UX
guidelines. You describe the content with JSX that mirrors what you want on
screen; you never set spacing, dividers, heading levels, or the underlying EUI
components yourself.

```tsx
import { FlyoutTemplate } from '@kbn/shared-ux-flyout-template';

<FlyoutTemplate onClose={onClose} size="m">
  <FlyoutTemplate.Header title="Alert details" description="Mar 30, 2022 @ 10:01:21.313" />

  <FlyoutTemplate.Body>
    <FlyoutTemplate.Body.Section title="Summary">
      <AlertSummary alert={alert} />
    </FlyoutTemplate.Body.Section>
  </FlyoutTemplate.Body>

  <FlyoutTemplate.Footer>
    <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={onDiscard} />
    <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={onSave} />
  </FlyoutTemplate.Footer>
</FlyoutTemplate>;
```

`Body` is the only zone you must provide. Zones always render in template order
(header, body, footer) no matter how you order them in JSX.

## Header

`title` is the only required prop; it renders as an H3, and the template owns
the heading level.

- `titleIcon` — an icon beside the title. Defaults to `info` when `titleTooltip`
  is set.
- `titleTooltip` — turns the title icon into a focusable tooltip anchor.
- `description` — subdued text below the title, such as a timestamp. Accepts
  block content.

Everything else in the header is a child part. Declare them in any order; the
header positions each kind for you.

- **`Header.Metadata`** — a key/value pair rendered on a single wrapping line
  below the description. Takes `title` (the key) and `children` (the value, which
  may be rich content such as a link). The design calls for at most three pairs;
  this is a guideline, not a limit, and extra pairs still render.
- **`Header.Badge`** — a badge below the metadata line. Takes `children` (the
  label) plus optional `color`, `iconType`, and `iconSide`. Five badges render
  as-is; past that the first four are shown and the remainder collapse into a
  `+N more` badge that reveals them in a popover.
- **`Header.InfoBlock`** — a labelled value block, laid out by
  `@kbn/shared-ux-flyout-info-blocks` below a full-width divider. Takes `title`,
  `children`, and optional `size` and `color`.

```tsx
<FlyoutTemplate.Header title="Alert details" titleIcon="warning">
  <FlyoutTemplate.Header.Metadata title="Owner">Platform</FlyoutTemplate.Header.Metadata>

  <FlyoutTemplate.Header.Badge color="warning" iconType="warning">
    Urgent
  </FlyoutTemplate.Header.Badge>

  <FlyoutTemplate.Header.InfoBlock title="Risk score">{riskScore}</FlyoutTemplate.Header.InfoBlock>
  <FlyoutTemplate.Header.InfoBlock title="Status">
    <EuiHealth color="success">Healthy</EuiHealth>
  </FlyoutTemplate.Header.InfoBlock>
</FlyoutTemplate.Header>
```

A part wrapped in a condition that resolves falsy
(`{isUrgent && <FlyoutTemplate.Header.Badge>…</FlyoutTemplate.Header.Badge>}`) is
skipped, so it never leaves an empty row behind.

These parts are the whole of what the header renders. Free-form content — your own
markup, a component, bare text — is dropped and logs a development warning naming
what was skipped; put that content in the body instead.

## Body

Choose either `Section` or `Accordion` for a given flyout, not both. Dividers
between siblings are added for you.

- **`Body.Section`** — `title` (an H4) plus content. Options: `icon` (with an
  optional `tooltip`) shown right of the title, `action` for a right-aligned link
  on the title row, and `hasBorder` to wrap the content — but not the title — in
  an outlined box.
- **`Body.Accordion`** — a collapsible section with the same title row as
  `Section` (`title`, `icon`/`tooltip`, `action`) plus `initialIsOpen`. Its
  content is always in an outlined box.
- **`Body.Section.Subsection`** (also `Body.Accordion.Subsection`) — one level
  deeper, with a `title` rendered as an H5. Subsections are the deepest level the
  template allows. When the parent boxes its content — always for `Accordion`,
  and for `Section` when you set `hasBorder` — each subsection gets its own box
  and the parent's single outer box is dropped. Otherwise subsections are
  separated by horizontal rules.
### Unstructured body content

The body also takes plain content — a callout, a search bar, a filter row, a data
grid — with no wrapper part. It renders as-is, in JSX order relative to the
sections around it, and gets no title, box, or divider:

```tsx
<FlyoutTemplate.Body>
  <DocumentFilterBar />
  <EuiSpacer size="m" />
  <DocumentGrid />
</FlyoutTemplate.Body>
```

Note that this applies to the body only. The header renders its declared parts
and nothing else, so anything else you put there is dropped, with a development
warning naming what was skipped.

## Tabs

Declare `Header.Tab` parts in the header and a matching `Body.TabPanel` for each
one. The template renders the tab bar at the bottom of the header, wires up the
`tab`/`tabpanel` accessibility relationship, and renders only the selected
panel.

```tsx
<FlyoutTemplate onClose={onClose}>
  <FlyoutTemplate.Header title="Alert details">
    <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
    <FlyoutTemplate.Header.Tab id="metadata" label="Metadata" />
  </FlyoutTemplate.Header>

  <FlyoutTemplate.Body>
    <FlyoutTemplate.Body.TabPanel tabId="overview">
      <FlyoutTemplate.Body.Section title="Summary">{summary}</FlyoutTemplate.Body.Section>
    </FlyoutTemplate.Body.TabPanel>
    <FlyoutTemplate.Body.TabPanel tabId="metadata">{metadata}</FlyoutTemplate.Body.TabPanel>
  </FlyoutTemplate.Body>
</FlyoutTemplate>
```

Each tab takes an `id`, a `label`, and optional `disabled`, `prepend`, and
`append`. Selection is uncontrolled by default and starts on the first tab; set
`defaultSelectedTabId` on the header to start elsewhere. To drive it yourself,
set `selectedTabId` and `onTabChange` on the header — `onTabChange` fires on
every tab click either way.

Once the body contains a `TabPanel`, everything must live inside a panel:
top-level sections and unstructured content in the body are not rendered.

## Footer

The footer is optional and holds at most one action of each kind:
`Footer.PrimaryAction` (a filled button, right-aligned) and
`Footer.SecondaryAction` (an empty button to its left). Both take `label`,
`onClick`, and optional `iconType`, `color`, `isLoading`, and `isDisabled`; the
primary action also accepts `fill={false}`.

A footer with no actions renders nothing, and the template never adds a default
Cancel button.

## Flyout props

`onClose`, `size`, `minWidth`, `type`, `maxWidth`, `paddingSize`, `ownFocus`,
`resizable`, and `onResize` are forwarded to the underlying `EuiFlyout`
unchanged. Structural close-button props and `side` are not exposed, so the
close affordance stays consistent across flyouts.

### Sessions and the flyout menu

The template defaults to `session="start"`, which registers the flyout with
EUI's flyout manager as the start of a new session. Use `session="inherit"` for
a flyout opened from within another one, and `session="never"` for a standard,
unmanaged flyout.

Managed mode requires an `EuiFlyoutManager`, which `EuiProvider` supplies —
Kibana apps get this through the rendering context.

Being managed does not automatically show the menu bar at the top of the
flyout. Under the default `flyoutMenuDisplayMode="auto"`, EUI renders the menu
only when it has something to show: a back button, session history, leading or
trailing actions, pagination, or a title you have explicitly unhidden with
`flyoutMenuProps={{ hideTitle: false }}`. A lone flyout typically shows EUI's
standard close button instead. Pass
`flyoutMenuDisplayMode="always"` to force the menu, and use `historyKey`,
`onActive`, and `flyoutMenuProps` to configure session history and menu
contents. Your header title is passed through to the menu automatically so
history entries are labelled.

### Accessibility

When the flyout has a header, its visible title names the flyout through
`aria-labelledby`, and any `aria-label` or `aria-labelledby` you pass is
ignored. Only headerless flyouts need — and get — an `aria-label` or
`aria-labelledby` of your own.

### Test subjects

Every zone and part accepts its own `data-test-subj`. A `data-test-subj` on the
root also seeds the zones, so `data-test-subj="myFlyout"` yields
`myFlyoutHeader`, `myFlyoutBody`, and `myFlyoutFooter`.
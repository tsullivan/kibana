# @kbn/shared-ux-flyout-template

`FlyoutTemplate` is a declarative, PRD-compliant flyout built with the
**declarative component assembly** pattern (`Assembly -> Part`) on top of
`@kbn/content-list-assembly`. Consumers compose a flyout with JSX children that
mirror the UI, while the template owns rendering, layout, PRD constraints, and
EUI composition.

```tsx
import { FlyoutTemplate } from '@kbn/shared-ux-flyout-template';

<FlyoutTemplate onClose={onClose} size="m">
  <FlyoutTemplate.Header title="Service inventory" />

  <FlyoutTemplate.Body>
    <FlyoutTemplate.Body.Section title="Summary">
      <ServiceSummary service={service} />
    </FlyoutTemplate.Body.Section>
    {/* passthrough content is allowed inside Body */}
    <EuiCallOut title="Data is delayed" color="warning" />
  </FlyoutTemplate.Body>

  <FlyoutTemplate.Footer>
    <FlyoutTemplate.Footer.SecondaryAction label="Discard" onClick={onDiscard} />
    <FlyoutTemplate.Footer.PrimaryAction label="Save" onClick={onSave} />
  </FlyoutTemplate.Footer>
</FlyoutTemplate>;
```

## Managed flyouts

`FlyoutTemplate` defaults to a **managed** flyout (`session="start"`), so EUI's
flyout manager auto-provides the top menu bar. This requires an
`EuiFlyoutManager`, which `EuiProvider` supplies (Kibana apps get this via the
render context). Configure the menu bar with the passthrough props `session`,
`historyKey`, `onActive`, `flyoutMenuProps`, and `flyoutMenuDisplayMode`. Pass
`session="never"` to render a standard (unmanaged) flyout.

## Other passthrough props

`onClose`, `size`, `minWidth`, `type`, `maxWidth`, `paddingSize`, `ownFocus`,
`resizable`, and `onResize` are forwarded to the underlying `EuiFlyout` as-is.
Structural close-button and `side` props are intentionally not exposed; the
template and (in managed mode) the EUI menu bar own the close affordance.

## Zones and parts (current slice)

- `FlyoutTemplate.Header` — required `title` (rendered as an H3). Accepts:
  - `FlyoutTemplate.Header.InfoBlock` — `title` plus a `children` value,
    resolved into `@kbn/shared-ux-info-blocks` and compressed to match the
    header's collapsed state.
- `FlyoutTemplate.Body` — the only required zone. Accepts:
  - `FlyoutTemplate.Body.Section` — `title` (H4) plus content.
  - passthrough children (callouts, announcements, search, filters).
- `FlyoutTemplate.Footer` — optional. Accepts:
  - `FlyoutTemplate.Footer.PrimaryAction` — right-aligned, filled button.
  - `FlyoutTemplate.Footer.SecondaryAction` — empty button, left of primary.

```tsx
<FlyoutTemplate.Header title="Alert details">
  <FlyoutTemplate.Header.InfoBlock title="Risk score">{riskScore}</FlyoutTemplate.Header.InfoBlock>
  <FlyoutTemplate.Header.InfoBlock title="Latency">
    <EuiHealth color="success">Healthy</EuiHealth>
  </FlyoutTemplate.Header.InfoBlock>
</FlyoutTemplate.Header>
```

Zones render in PRD order (header, body, footer) regardless of JSX order.
Invalid combinations and duplicate singleton zones warn in development and no-op
in production; they never throw.

## Not yet implemented

Header `Metadata` / `Badge` / `Tab`, `Body.Accordion`, all `Subsection`s,
`Footer.Left`, and a dedicated `Menu` assembly are planned follow-ups.

# Descriptor

`FlyoutTemplate` identifies its parts by walking its direct element children for a `Symbol.for()` part key, unwrapping only `Fragment`, `memo`, and `forwardRef`. A zone therefore sees its whole declaration before it renders, which is what pays for the template's opinions: it fixes zone order, enforces singletons, computes divider placement from sibling counts, assigns heading levels, cross-validates tab ids against panel ids, and derives the dialog's accessible name from the header title. The price is that the declaration must be statically visible where the zone renders.

This module carries that declaration as data. A host that mounts a React tree it does not author — across a package boundary, into a React root of its own — describes the flyout as a `FlyoutTemplateDescriptor`, and `DescribedFlyoutTemplate` builds every part from it inside its own JSX, as a literal child of the zone that parses it. Every guarantee above holds for a descriptor exactly as it holds for hand-written JSX, because the parts are real parts.

Content arrives as `Content: ComponentType` and is rendered as `<Content />`. Those land in the passthrough slots the body, tab panel, section, and accordion zones already support, so caller content keeps its own hooks, re-renders independently of the flyout chrome, and sits behind the template's error boundary. Bind props with a closure at the call site: `Content: () => <MyPanel doc={doc} />`.

## Ownership

The mapping from descriptor to parts lives in the same package as the parts it maps to. A part added to the template reaches every imperative host with no change outside this package, and a host names one type and one component no matter how many parts exist.

Every descriptor type is an `Omit<…>` of a prop type the template already declares in `src/types.ts`. Nothing is re-declared, so a prop added to `FlyoutBodySectionProps` reaches the descriptor API for free, and a prop removed from it breaks the build here, next to the parts that changed.

## Files

- **`types.ts`** — the descriptor surface. `FlyoutTemplateDescriptor` is the whole flyout as data; `FlyoutTemplateBodyItem` and `FlyoutTemplateSectionItem` are the two levels of body nesting; `FlyoutTemplateTabOptions` pairs a tab with the panel it selects; `ContentSlot` is the content contract.
- **`render_body_items.tsx`** — pure descriptor-to-element functions for the body. `Body.Section.Subsection` and `Body.Accordion.Subsection` are the same component, so the subsection renderer does not need to know its parent's kind.
- **`described_flyout_template.tsx`** — the single component an imperative host mounts.

## Invariants

- **The union stays at the top level.** `FlyoutTemplateDescriptor` distributes the shared base over the tabbed and untabbed branches through `WithBodyOptions`. That keeps it a genuine two-member union, so a consumer's `Omit` over it preserves both branches and the discriminated union still enforces that `body` and `tabs` are mutually exclusive. `WithBodyOptions` is exported only to satisfy declaration emit; it is not published from `template/index.ts`.
- **Descriptor-only keys are stripped before each spread.** `body` and `tabs` must not reach `FlyoutTemplate`, and `badges` / `metaBlocks` / `infoBlocks` must not reach `FlyoutTemplate.Header`, where they would land in the part's `attributes` and be spread into `HeaderZone`. Neither leak is a type error: TypeScript does not apply excess-property checking to a JSX spread from a variable.
- **Narrow on `descriptor`, not the destructured fields.** `tabs !== undefined` narrows only the local binding; a tuple type is not a unit type, so it does not drive destructured-union narrowing and leaves `body` unnarrowed.
- **Tabs are uncontrolled.** The descriptor carries `defaultSelectedTabId` and an optional `onTabChange`, and omits `selectedTabId` from the shared base so the body/tabs union is the sole source of tab state. The descriptor is a snapshot captured at open time, and controlled tab state has no way to advance.
- **`title` is a required `string`.** It names the dialog and seeds the flyout menu's history entry. Rich content belongs in `header.description`, which stays `ReactNode`.
- **Index fallback keys are safe.** Options are captured once at open time and the list never reorders. The part's `id` is preferred when the caller supplies one.

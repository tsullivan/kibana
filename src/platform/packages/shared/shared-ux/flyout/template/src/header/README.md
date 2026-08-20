# Header — collapse on scroll

## Scroll behavior

When the user scrolls the flyout body, the header automatically collapses to a compact row that shows only the title and up to two badges. The title truncates to one line, with the full text available as a hover tooltip when it is a plain string. The tab bar and the full-bleed divider stay pinned. Description, meta blocks, info blocks, and the callout slide away to give the body the recovered space.

Scrolling back to the top restores the full header. The collapse reverses with the same animation, and `prefers-reduced-motion` turns it into an instant swap.

The wheel scrolls the body from anywhere in the header, so the header is not a dead zone for scrolling and the page behind the flyout never scrolls along with it.

The behavior is always active and needs no configuration. It self-disables when the flyout body does not overflow enough to cover the complete collapse budget plus the 4px expansion threshold. That budget includes the collapsible content, expanded title row, and expanded spacer, so short flyouts are unaffected. A header with no secondary content at all still collapses, because the title row and spacer shrink on their own.

On a narrow flyout the compact row drops its inline badges and folds all of them into the `+N more` popover. Badges are sized by their labels and never shrink, so leaving them inline would squeeze the title down to a few pixels.

### Starting collapsed

Set `collapsed` on the header to render the compact row immediately, independent of scroll position:

```tsx
<FlyoutTemplate.Header title="Alert details" collapsed>
  <FlyoutTemplate.Header.Badge color="warning">Urgent</FlyoutTemplate.Header.Badge>
  <FlyoutTemplate.Header.Tab id="overview" label="Overview" />
</FlyoutTemplate.Header>
```

The description, meta blocks, and info blocks are never visible in this mode, so there is no reason to declare them. Scroll tracking is skipped entirely, and the header stays compact no matter how far the body scrolls.

## Implementation notes

These notes cover `use_header_collapse.ts` and `header/header.tsx` for contributors.

### Clip, not remove

The collapsible region uses the CSS grid trick: a wrapper set to `grid-template-rows: 0fr / 1fr` clips its inner div (which has `min-block-size: 0`) without removing it from the DOM. The content is always present; only its visual box collapses to zero height. A consequence: `element.scrollHeight` (the natural, unclipped height) reads the same value in both the expanded and collapsed states, while `getBoundingClientRect().height` tracks the animated visual height.

### Wheel forwarding

Wheel events over the non-scrollable header would otherwise scroll the page behind the flyout. The hook's `headerRef` callback installs a single non-passive `wheel` listener on the header's parent element (covering its padding). The listener calls `event.preventDefault()` and delegates to the scroll container. That is the entire path — no scroll logic lives in the header component itself. There is no duplication: both the normal scroll path and the forwarded wheel path converge on the same scroll container and trigger the same RAF-throttled `evaluate()` callback.

### No oscillation

The overflow guard is checked only on the transition _into_ the collapsed state. Its collapse budget is a conservative upper bound on all the space that can return to the body: the collapsible region's natural height plus the full expanded title-row and post-region spacer heights. Including the title and spacer matters for wrapped titles and headers without tabs, because those elements also become shorter in compact mode — and it is what lets a header with an empty collapsible region collapse at all. The body must overflow by more than that budget plus the 4px expansion threshold. A zero budget means nothing has been measured yet, so the header stays expanded.

Once collapsed, the expand decision is driven solely by `scrollTop ≤ 4px`. This asymmetry is deliberate: collapsing the header grows the body's client height, which shrinks `scrollHeight − clientHeight` — so re-testing the guard after collapsing would conclude the collapse was invalid, immediately expand, restore the original geometry, and re-collapse in a tight loop. Leaving collapse is therefore a scroll-position question, not a geometry question.

### ResizeObserver roles

The hook uses observers for the scroll-container viewport and the measurements that make up the collapse budget.

**Scroll-container observer** — watches the EuiFlyoutBody overflow div. It re-runs `evaluate()` when that element's own box changes, so viewport and flyout layout changes are covered without a separate window resize listener. Changes to descendant content alone do not necessarily resize this box; normal scroll events still evaluate the resulting scroll geometry.

**Collapse-budget observers** — watch the collapsible region's inner div, expanded title row, and expanded spacer. Each reads `node.scrollHeight` rather than `contentRect.height`. This is essential for the collapsible region because its observed box reports animated intermediate heights and eventually zero, while `scrollHeight` retains the natural, unclipped height. The title and spacer observers are attached only while expanded, so their last expanded measurements remain stable during collapse.

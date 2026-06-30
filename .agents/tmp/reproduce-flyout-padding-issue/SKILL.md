# Skill: Reproduce Flyout Padding / Phantom Scrollbar Issue

## Purpose
Diagnose and verify fixes for two related bugs on the Alerting v2 Episodes list page:
1. **Phantom scrollbar** — `#app-main-scroll` shows a scrollbar (thin, auto-hiding) when rows exist in the episodes table, even though the content should fit.
2. **Flyout gap** — when the episodes detail flyout is open, an 11px gap appears between the flyout and the page content. Root cause: `#app-main-scroll` scrollbar gutter (11px from `scrollbar-width: thin`) is included in the push-padding calculation.

## Environment
- Kibana: http://localhost:5601
- Viewport: 1800 × 1080 (or current session viewport)
- Credentials: elastic / changeme

## Login Procedure
1. Navigate to http://localhost:5601/login (going to `/` may redirect through a SAML capture URL)
2. Fill username field (`[data-test-subj="loginUsername"]`) with `elastic`
3. Fill password field (`[data-test-subj="loginPassword"]`) with `changeme`
4. Click the "Log in" button (`[data-test-subj="loginSubmit"]`)

This logs in directly (lands on the Observability landing page in this deployment).
ONLY if a role/space selector appears: it is an EuiComboBox, NOT a native
`<select>` — do not use `browser_select_option`. Instead click its "Open list of
options" button, click the desired option in the listbox, then submit.

## Navigating to Episodes Page
Use this exact URL (includes the time range + status filter that yields rows):
```
http://localhost:5601/app/management/alertingV2/episodes/?_a=(episodesList:(status:all,timeFrom:now-150m%2Fm,timeTo:now))
```
Then `browser_wait_for` text `Episodes`. NOTE: the
`insightsAndAlerting/alertingV2Episodes` path does NOT resolve to this page —
do not use it.

## Phantom Scrollbar Test
Goal: verify whether `#app-main-scroll` overflows (scrollbar visible) when the table has rows.

```js
// Run in browser_evaluate
const el = document.getElementById('app-main-scroll');
return {
  scrollHeight: el.scrollHeight,
  clientHeight: el.clientHeight,
  overflows: el.scrollHeight > el.clientHeight,
  scrollbarWidth: el.offsetWidth - el.clientWidth,
};
```

Expected when fixed: `overflows: false`, `scrollbarWidth: 0`.
Bug present: `overflows: true`, `scrollbarWidth: 11` (scrollbar gutter reserved).

## Flyout Gap Test
1. Click the expand toggle on any row (`button[data-test-subj="docTableExpandToggleColumn"]`).
   - If click is intercepted by sticky header, use `browser_evaluate`: `document.querySelector('button[data-test-subj="docTableExpandToggleColumn"]').click()`
2. Wait for `[data-test-subj="alertingV2EpisodeFlyout"]` to appear.
3. Measure the gap:

```js
const flyout = document.querySelector('[data-test-subj="alertingV2EpisodeFlyout"]');
const scroll = document.getElementById('app-main-scroll');
const flyoutLeft = flyout.getBoundingClientRect().left;
const scrollRight = scroll.getBoundingClientRect().right;
const padding = parseInt(scroll.style.paddingInlineEnd || '0', 10);
return { flyoutLeft, scrollRight, padding, gap: flyoutLeft - (scrollRight - padding) };
```

Expected when fixed: gap ≈ 0.

## Visual Confirmation
Take a screenshot after the phantom scrollbar test and after the flyout test to visually confirm presence/absence of the gap.

## Grow→Shrink Regression Test (CRITICAL)
The phantom scrollbar can be absent at the initial size but REAPPEAR after the
viewport grows then shrinks. Always test this cycle:
1. Resize taller (e.g. 1800×1400), 2. Resize back (1800×1080), 3. Re-measure overflow.
Reason: react-window records an explicit pixel height while large; on shrink the
stale tall height persists if the layout is content-driven (bottom-up).

## ROOT CAUSE (confirmed 2026-06-30)
The episodes page relied on a pure `flex-grow` chain with no determinate height
anchor. Walking up from `.euiDataGrid__virtualized`, EVERY ancestor up to
`#app-main-scroll` is content-sized, and several links (chrome `content`,
`kbnAppWrapper`×2, management `MAIN euiPageInner`, `ManagementAppWrapper`) have
`min-height: auto` — the classic flex `min-content` trap. The grid's intrinsic
pixel height therefore drives the layout BOTTOM-UP and overflows
`#app-main-scroll` (1024px), reserving the 11px scrollbar gutter → also causes the
flyout push-padding gap.

A `min-height: 0` cascade does NOT work: it would have to be applied to every link
including the shared chrome-layout files. Discover does NOT need this because it
does not use the flex chain — it anchors an explicit height.

### Why Discover works (and episodes didn't)
Discover's `EuiPage` sets `kbnFullBodyHeightCss` →
`height: calc(var(--kbn-application--content-height) - offset)`. Height flows
DOWN from this determinate anchor; the grid re-virtualizes via `height:100%` and
can never push its container taller. The management `KibanaPageTemplate` only
applies the `--kbn-application--content-height` anchor when a `pageHeader` *prop*
is passed (see `page_template_inner.tsx:87`). Management apps (incl. episodes)
render their own header in the body and pass no `pageHeader` prop, so
`minHeight={0}` and `EuiPage`'s `flex-shrink:0` make the page content-driven.

### The fix (episodes-page only, no shared-file changes)
`alert_episodes_list_page.tsx` root div:
```ts
${kbnFullBodyHeightCss(`calc(${euiTheme.size.l} * 2)`)}
```
The offset `2 * euiTheme.size.l` (= 48px) subtracts the Management page template's
`paddingSize: 'l'` (24px top + 24px bottom) that sits between the page root and
`#app-main-scroll`. Internal `min-height: 0` on the `EuiFlexGroup` and table
`EuiFlexItem` are still needed so the table shrinks within the now-determinate root.

### Verification (via live JS injection — no rebuild needed)
- `--kbn-application--content-height` resolves to `calc(100vh - 56px)`.
- Setting root `height: calc(var(--kbn-application--content-height) - 48px)` →
  `overflowBy: 0`, `scrollbarWidth: 0`.
- Survives the grow→shrink cycle (grid returns 797px→477px, overflow stays 0).

## Notes
- No hot module reloading — always refresh after code changes.
- The phantom scrollbar is faint (auto-hiding thumb) but still reserves 11px gutter.
- The flyout gap only appears when the phantom scrollbar is active (i.e., `#app-main-scroll` overflows).
- Reducing `padding-inline-end` by 11px closes the visual gap (confirmed via JS injection).
- Test fixes empirically by injecting `root.style.height` via `browser_evaluate` BEFORE editing code — CSS injection needs no rebuild, so you can confirm the exact calc value first.

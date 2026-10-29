---
name: feature-structure
description: >-
  Structure React Native feature UI in this repo: screens wire data, hooks are
  the view model, shared chrome stays generic, feature components receive props.
  Use when adding or editing files under src/features or src/shared/ui, splitting
  a component, passing PATHS or store data, or deciding whether a tab bar, page,
  and pager belong in separate files.
---

# Feature structure

Apply this when adding or changing UI under `src/features`. Match the existing folders. This repo uses hooks as the view model. Do not add a ViewModel class.

## Layers

| Layer | Where | Holds |
| --- | --- | --- |
| Model | `data/`, `src/store/`, `src/shared/api` | Static copy, Redux state, API calls |
| View model | `useX` hooks and `src/store/selectors.ts` | Gesture, selection, derived data. No JSX |
| View | `components/` | Props in, callbacks out |
| Screen | `screens/` | Reads store, route params, and `data/`, then passes them down |

## Views receive data

A file in `components/` does not import `data/` and does not call `useAppSelector` or `useAppDispatch`.

The screen, or a hook the screen calls, does that reading. Map the result into props.

`features/read/components/StoreProbes.tsx` is the exception. Those components exist to show which selector re-renders. Leave their subscriptions in the probe. Do not lift them to `ReadScreen`.

## One public component per file

Export one component from a file. Put its `StyleSheet` in that file.

Split when a piece has its own props and its own layout concern. A helper with no props of its own, used only inside that file, stays in the file.

Name a component after its role. A shared control takes the UI name (`TabView`, `TabBar`, `useTabPager`) and lives in `src/shared/ui`. Do not prefix it with the current screen's data (`Path`, `Note`). The next screen with the same chrome reuses those files and supplies its own page body. Only content that is specific to one feature stays in that feature.

The tab chrome is already shared:

- `TabView` owns the card, the sticky bar, and the horizontal track. It receives `tabs` and `renderPage`. It does not know about paths or rows.
- `TabBar` owns the labels and the underline. A tab is `{ key, title }`.
- `useTabPager(pageCount)` owns the pan and the selected index.
- `PathPage` stays in the feed feature. It is this screen's page body, not another tab view.

## Where state lives

Follow the rule already in the README:

- A value that must stay in sync across screens goes in Redux.
- Input that only this screen uses stays in component state.
- The next screen receives an id through route params. Pass `noteId`, not the whole note.
- Gesture position and the selected page index stay in `useTabPager`. The screen passes the hook result down.
- The hook receives `pageCount` from the caller. It does not import feature data.

## Shape

```tsx
const pager = useTabPager(PATHS.length);

<TabView
  pager={pager}
  tabs={PATHS}
  scrollY={scrollY}
  headerHeight={headerHeight}
  minHeight={listHeight}
  renderPage={(path, pageWidth) => (
    <PathPage path={path} rows={PATH_ROWS[path.key]} pageWidth={pageWidth} />
  )}
/>
```

The live `store.name` line is a read-side probe. Render it from the screen, or from a probe component next to the pager. Keep it out of `TabView`.

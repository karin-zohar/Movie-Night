# Code Review: `05-keyboard-navigation` Branch

## 1. Coding Principles

### A. Memory leak in `register` — no `unregister` mechanism (FIXED)

The `elements` ref in `KeyboardNavigationProvider` only grew; it never removed stale entries. When users navigated between pages, unmounted components left detached DOM references in the array, causing stale references, misaligned `activeIndex`, and potential memory leaks.

**Fix:** Added `unregister` to the context and updated all consumers to clean up on unmount.

### B. Dead code in `KeyboardNavigable` (FIXED)

`wrapperRef` was assigned inside `handleRef` but never read anywhere.

**Fix:** Repurposed as `registeredRef` to track the registered element for unregister cleanup.

### C. Duplicate import paths in `SelectTheme` (FIXED)

`KeyboardNavigable` and `useKeyboardNavigation` were imported on separate lines from the same module.

**Fix:** Merged into a single import.

### D. Redundant wrapper in `NavDrawer.handleClose` (FIXED)

`handleClose` wrapped `onClose` in `useCallback` but added no logic.

**Fix:** Removed the wrapper; all usages now reference `onClose` directly.

### E. Inconsistent mouse vs keyboard behavior on interactive elements

In `NavDrawer`, the hamburger `<Button>` has `onClick={onOpen}` (no lock), while the `KeyboardNavigable` wrapper has `onActivate={handleOpen}` (with lock). A mouse click triggers the Button's `onClick` and bypasses the `lock()` call, while keyboard Enter triggers the wrapper and calls `lock()`. The same pattern appears in `MovieActions`.

This works because `KeyboardNavigable.handleClick` has the `e.target !== e.currentTarget` guard — but the duality is subtle. Consider documenting this pattern or centralizing it.

### F. Faked event object in `Categories` (FIXED)

Casting a partial object as `RadioChangeEvent` (`{ target: { value: option.value } } as RadioChangeEvent`) is fragile. If any code downstream reads other properties of the event, it will silently get `undefined`.

**Fix:** Added a clean `onSelect` prop accepting a plain value. Extracted shared category-change logic in `MovieFilters` into `handleCategorySelect`, used by both `onValuesChange` (radio clicks) and `onSelect` (keyboard activation).

### G. Unbounded `requestAnimationFrame` loop in `SelectTheme`

```typescript
const updateHighlight = () => {
    if (cancelled) return;
    const dropdown = document.querySelector('.ant-select-dropdown');
    if (!dropdown) {
        requestAnimationFrame(updateHighlight);
        return;
    }
    // ...
};
```

If the dropdown never appears, this loops indefinitely. Add a retry limit:

```typescript
const MAX_RETRIES = 20;
let retries = 0;
const updateHighlight = () => {
    if (cancelled || retries++ > MAX_RETRIES) return;
    // ...
};
```

Also, `document.querySelector('.ant-select-dropdown')` targets the first matching element globally. If multiple selects exist on a page, it would target the wrong dropdown.

---

## 2. Naming Conventions

Overall naming is strong and consistent. A few notes:

- `escaping` ref in `SearchBar` is cryptic without context. Consider renaming to `isExitingSearchFocus` or adding a brief comment.
- `interactive` prop on `KeyboardNavigable` is vague. Something like `locksNavOnActivate` would be more self-documenting.
- `handleActivate` in `SelectTheme` is not wrapped in `useCallback` while its siblings `closeDropdown` and `handleChange` are. Inconsistent — should be memoized too.
- `handled` array in the provider's keydown handler is recreated on every keypress. Should be a module-level constant:

```typescript
const HANDLED_KEYS = ['Tab', 'ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Enter', 'Escape'];
```

---

## 3. Readability

Generally the code is clean and well-organized. A few improvements:

- The `focusout` handler in the provider (lines 69-77) aggressively reclaims focus. A one-line comment explaining *why* (to prevent focus escaping to body during keyboard navigation) would help future readers.
- `SearchBar`'s `handleFocus` logic with `escaping.current` is non-trivial. A comment like `// Skip lock if we just exited via Escape to avoid immediately re-locking` would clarify intent.
- The dual-handler pattern (`onClick` on Button + `onActivate` on wrapper) appears multiple times. A code comment at the `KeyboardNavigable` class level explaining this design decision would reduce cognitive load for contributors.

---

## 4. Error Handling

### A. No fetch timeout

`apiService.ts` has no `AbortController` or timeout. A slow TMDB response could leave the UI in a loading state indefinitely.

```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 10000);
const response = await fetch(url, { ...options, signal: controller.signal });
clearTimeout(timeoutId);
```

### B. Non-null assertion on `movieId`

```typescript
queryFn: () => fetchMovie(movieId!),
```

While `enabled: !!movieId` prevents the query from running, the `!` assertion is still a code smell. A guard clause or early return when `movieId` is undefined would be more defensive.

### C. Silent failure in `fetchFavoriteMovies`

Failed fetches are silently dropped via `Promise.allSettled`. If 15 of 20 favorites fail to load, the user sees 5 movies with no indication anything went wrong. Consider showing a toast or partial error state.

### D. Rate limiter recursion

```typescript
return waitForRateLimit(key, maxRequests, intervalInSeconds);
```

Recursive call after awaiting a timeout. In pathological cases, this could build up call frames. An iterative approach with `while` would be safer.

### E. Missing field validation on TMDB responses

`mapTMDBMovie` assumes the response has `id`, `title`, `overview`, and `poster_path`. If TMDB changes their API or returns an unexpected shape, the app would silently render broken data. Consider validating with a schema library (like Zod) or at minimum checking required fields.

---

## 5. Number of Renders

### A. Context value changes on every arrow key press (Critical)

```typescript
const providerValue = useMemo(() =>
    ({ activeIndex, setActiveIndex, register, unregister, lock, unlock, isLocked }),
    [activeIndex, setActiveIndex, register, unregister, lock, unlock, isLocked]);
```

`activeIndex` is in the dependency array. Every arrow key press changes `activeIndex`, which changes the context value, which re-renders **every** component consuming `useKeyboardNavigation` — that includes every `KeyboardNavigable`, `SelectTheme`, `SearchBar`, `MoviePreview`, etc. For a movies list with 20 items, pressing one arrow key triggers 20+ re-renders.

**Recommendation:** Split the context into two — one for `activeIndex` (read) and one for stable functions (`register`, `lock`, `unlock`). Or use a state management library like Zustand with selectors, or store `activeIndex` in a ref and use a subscription pattern.

### B. `unlock` recreated on every `activeIndex` change

```typescript
const unlock = useCallback(() => {
    locked.current = false;
    elements.current[activeIndex]?.focus({ preventScroll: true });
}, [activeIndex]);
```

Since `unlock` depends on `activeIndex`, it gets a new reference every time the index changes, which cascades through the `useMemo` for `providerValue`. Use a ref for `activeIndex` inside `unlock`:

```typescript
const activeIndexRef = useRef(activeIndex);
activeIndexRef.current = activeIndex;

const unlock = useCallback(() => {
    locked.current = false;
    elements.current[activeIndexRef.current]?.focus({ preventScroll: true });
}, []);
```

### C. `keydown` listener torn down and re-attached on every index change

The `Enter` case reads `activeIndex` directly, forcing the effect to depend on it. Using an `activeIndexRef` would let the effect run only once.

### D. `Typography` destructured inside component bodies

In `MoviePreview` and `MoviesPage`:

```typescript
const { Title } = Typography;
```

This runs on every render. Destructure at module level instead.

---

## 6. Efficiency of Data Loading from the API

### A. Favorites fetched one-by-one (Critical)

All favorite IDs fire individual requests, but they're all created simultaneously and then serialized by the rate limiter (5 per 10 seconds). With 10 favorites, that's **20+ seconds** of loading. With 20 favorites, **40+ seconds**.

**Recommendations:**
- Leverage React Query's per-movie caching: query each movie individually with `useQueries` so already-cached movies don't need re-fetching.
- Increase the rate limit (TMDB allows ~40 requests per 10 seconds).
- Consider storing movie metadata alongside favorite IDs in localStorage.

### B. Favorites query key includes the full `favoriteIds` array

Every time any favorite is added or removed, `favoriteIds` changes (new array reference), and the **entire** favorites list is re-fetched from scratch. Combined with per-movie fetching, this is very expensive.

### C. No pagination

Both the category and search endpoints only fetch `page=1`. For a movies app, infinite scroll or pagination would significantly improve the experience.

### D. Rate limiter is conservative

```typescript
const MAX_REQUESTS = 5;
const INTERVAL_IN_SECONDS = 10;
```

TMDB's actual rate limit is roughly 40-50 requests per 10 seconds. 5 per 10 seconds is very conservative and directly causes slow favorite loading.

---

## 7. Overall Application Loading Speed

### A. No route-level code splitting

All pages are eagerly imported. Use `React.lazy()` + `Suspense`:

```typescript
const MoviesPage = lazy(() => import('@/pages/MoviesPage/MoviesPage'));
const MoviePage = lazy(() => import('@/pages/MoviePage/MoviePage'));
```

### B. No image lazy loading

Movie poster `<img>` tags load eagerly. Adding `loading="lazy"` would significantly improve initial page load.

### C. No `QueryClient` configuration for performance

The default `QueryClient` has no global `staleTime`. While `MovieDisplay` sets `staleTime: 5 * 60 * 1000`, the movie detail query in `MoviePage` has no `staleTime`, meaning it refetches on every mount.

### D. Keyboard navigation provider wraps the entire app

Since context changes re-render all consumers, having this at the root level means every arrow key press can trigger a broad re-render tree. Consider moving it lower or splitting the context.

---

## Summary of Priority Issues

| Priority | Issue | Category | Status |
|----------|-------|----------|--------|
| **High** | No `unregister` — stale DOM refs accumulate | Coding Principles | FIXED |
| **High** | Context re-renders all consumers on every key press | Renders | Open |
| **High** | Favorites fetched 1-by-1 through aggressive rate limiter | Data Loading | Open |
| **High** | No fetch timeout — requests can hang forever | Error Handling | Open |
| **Medium** | `unlock` + keydown listener recreated every index change | Renders | Open |
| **Medium** | Unbounded rAF loop in SelectTheme highlight | Error Handling | Open |
| **Medium** | Full favorites re-fetch on any add/remove | Data Loading | Open |
| **Medium** | No route code-splitting or image lazy loading | Loading Speed | Open |
| **Low** | Dead `wrapperRef`, duplicate imports, faked event objects | Code Quality | FIXED |
| **Low** | Inconsistent `useCallback` usage, `Typography` destructuring | Naming / Style | Open |

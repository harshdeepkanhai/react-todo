# 🥋 React Training Log — Genin Arc

My journey from a broken `return;` to a shippable, typed, styled, accessible Todo app.
Every lesson below was learned by **breaking it first, then fixing it.**

---

## ⚔️ Mission 1 — The Counter Dojo

### ASI (Automatic Semicolon Insertion)
- `return;` alone on a line → JS silently inserts a semicolon → everything after is **unreachable dead code**.
- Fix: `return (` with the JSX opening on the same line as the paren, so the parser knows it's not done.
- 📜 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return#automatic_semicolon_insertion

### State as a stack / derive don't store
- Stored the whole history array; the current value is **derived** with `.at(-1)`.
- **Law: store what you can't compute; compute everything else.**
- Immutability: spread `[...prev, x]` to push, `slice` to pop — never mutate.

---

## 📜 Mission 2 — The Todo Scroll

### Keys in lists
- **Never use array index as `key`.** Deleting a middle item shifts indexes → React reuses keys → state lands on the wrong row.
- Use a stable id born **once at creation** (in the add handler), never regenerated in render.
- `crypto.randomUUID()` — built into the browser, no library.
- 📜 https://react.dev/learn/rendering-lists
- 📜 https://developer.mozilla.org/en-US/docs/Web/API/Crypto/randomUUID

### Arrow functions & implicit return
- A braceless arrow returns **one expression**. A second "statement" below it isn't inside the function — it becomes a stray top-level statement (an ASI cousin).
- Calling `setState` in the component body → runs every render → **infinite re-render loop**.
- 📜 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body

### Function vs. call (met it 3 times!)
- `onClick={fn}` → passes the function, fires on click.
- `onClick={fn(x)}` → **calls it during render**, assigns the return value → runs immediately, often an infinite loop.
- Wrap to pass an argument: `onClick={() => fn(x)}`.
- Also bit me in CSS: `.toUpperCase` (reference) vs `.toUpperCase()` (call).
- 📜 https://react.dev/learn/responding-to-events#passing-a-function-vs-calling-a-function

### Immutable updates
- Toggle: `map` returning a spread copy for the match, the original for the rest — never `todo.done = !todo.done`.
- Delete: `filter(t => t.id !== id)` — by id, never by index.
- 📜 https://react.dev/learn/updating-arrays-in-state

### Controlled inputs
- `value={state}` + `onChange={e => setState(e.target.value)}`. React owns the truth.
- The typed text lives at `e.target.value`.
- 📜 https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable

### Forms & preventDefault
- Use `<form onSubmit>`, not a lone `<button onClick>` — gives keyboard users **Enter to submit** for free.
- `e.preventDefault()` stops the browser's default page reload (which would wipe React state).
- 📜 https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
- 📜 https://react.dev/learn/responding-to-events#preventing-default-behavior

### The lazy initializer & the persistence race
- `useEffect` runs **after** commit → a load effect + save effect race → the save can stomp the disk with `[]` before the load applies (StrictMode double-mount guarantees it).
- **Loading is initialization → belongs in `useState(() => ...)`**, which runs **before** the first render.
- **Saving is synchronization → belongs in `useEffect`.**
- With a lazy initializer, `todos` is already the saved data at render zero → there's no empty array to overwrite → the race is **impossible, not merely unlikely**. *You don't win the race; you delete the other runner.*
- 📜 https://react.dev/reference/react/useState#avoiding-recreating-the-initial-state
- 📜 https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application
- 📜 https://react.dev/learn/synchronizing-with-effects
- 📜 https://react.dev/reference/react/StrictMode#fixing-bugs-found-by-re-running-effects-in-development

### Hostile disk / JSON safety
- `getItem` returns `null` when the key is absent (not `""`, not `"[]"`).
- `JSON.parse` **throws** on corrupt data → guard with `try/catch`, return `[]` on failure.
- `"[]".length` is **2**, not 0 — checking a string's length is not checking an array's emptiness.
- 📜 https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
- 📜 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse#exceptions

### Minimal contracts
- `addTodo(text: string)` — accept the least you need. Don't force callers to build an `id`/`done` you'll overwrite.
- Object shorthand: `{ text }` instead of `{ text: text }`.
- 📜 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions

### Derived state (the Principal move)
- Store the **filter mode** (`"all" | "active" | "done"`), not a `filteredTodos` array.
- Compute `visibleTodos` in the render body every render — it can never go stale.
- **Law: stored state can lie; derived state cannot.**
- 📜 https://react.dev/learn/thinking-in-react
- 📜 https://react.dev/learn/choosing-the-state-structure#avoid-redundant-state

---

## 🛡️ TypeScript

- `useState([])` infers `never[]` → nothing can go in it. Type the generic: `useState<Todos[]>([])`.
- Declare the shape once as an `interface`/`type`, reuse everywhere.
- Union types for finite sets: `"all" | "active" | "done"`.
- `as const` freezes an array's literals so they keep their narrow types instead of widening to `string`.
- **`tsc -b`**, not plain `tsc` — a Vite root `tsconfig.json` has `"files": []` and uses project references, so plain `tsc` checks nothing.
- **The compiler passing ≠ the app working.** `function + string` type-checks fine but renders `[native code]` garbage. Always look at the screen.
- 📜 https://react.dev/learn/typescript#typing-usestate
- 📜 https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases
- 📜 https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions

---

## 🎨 The Temple of Style (CSS)

### Design tokens
- Use CSS custom properties (`var(--accent)`, `var(--bg)`, `var(--border)`, `var(--shadow)`) — never hardcode colors. Dark mode then works automatically.
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_custom_properties/Using_CSS_custom_properties

### Flexbox layout
- `.todo` row: `display: flex; align-items: center; gap: 12px`.
- Push one child to the far edge: `margin-left: auto` (auto margins absorb free space in flex).
- Sane spacing: `8–16px`, never `200px`.
- `display: flex` governs **children** — putting it on a leaf `<input>` (no children) does nothing. Never copy CSS you don't understand.
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Basic_concepts_of_flexbox

### Selectors & states
- Comma-separated selectors are **independent** — `.add-form button:hover, button:focus-visible` leaks the second rule to every button. Scope each one.
- Chained pseudo-classes mean **AND**: `button:hover:focus-visible` = hovered *and* focused. Comma = **OR**.
- A state must **change** something — an identical `:hover` copy is dead CSS. Change bg / add `box-shadow`.
- `cursor: pointer` is for buttons; a text input wants the default I-beam.
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/Selector_list
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

### DOM-stamp drives style
- CSS can't see React state → stamp the DOM, then target it.
- Active filter: `aria-current={filter === mode ? "page" : undefined}` → `button[aria-current="page"] { ... }`. One attribute serves **styling + screen reader**.
- Done todo: `className={todo.done ? "todo done" : "todo"}` → `.todo.done { text-decoration: line-through; opacity: 0.6 }`.
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/Attribute_selectors
- 📜 https://developer.mozilla.org/en-US/docs/Web/CSS/text-decoration

---

## ♿ Accessibility

- `aria-current` — marks the current item in a set (the active filter view).
- `aria-checked` / `role="checkbox"` — a widget role signs a **contract**: must be focusable (`tabIndex`) and keyboard-operable (Space). Inert without a role. Can't contain other focusable controls.
- **Use the platform:** a `<button>` is already focusable + key-operable, so `aria-pressed={todo.done}` (toggle-button pattern) is cleaner than reinventing a checkbox.
- 📜 https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current
- 📜 https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/checkbox_role
- 📜 https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-pressed

---

## ⚛️ Conditional rendering

- The `&&` trap: `{list.length && <p/>}` renders a literal **`0`** when length is 0 (0 is falsy but renderable).
- Use a boolean (`length === 0`), `> 0`, `Boolean()`, or a ternary.
- 📜 https://react.dev/learn/conditional-rendering#logical-and-operator-

---

## 🧠 The Laws (burned into the stance)

1. **Store what you can't compute; compute everything else.** (Derived state.)
2. **Make bad states unrepresentable** — don't patch a race, delete the possibility.
3. **Accept the least you need; return the most you promise.** (Minimal contracts.)
4. **Never copy code you don't understand.**
5. **The compiler passing ≠ the app working. Always look at the screen.**
6. **Use the platform** before reinventing it (buttons, forms, `aria-pressed`).

---

## 🗺️ The Path Ahead

- **Arc 1 — Genin:** Counter ✅ · Todo Scroll ✅ · Styling ✅ · GitHub Card Summoner ⬜
- **Arc 2 — Chunin:** React Router, custom hooks, reusable components
- **Arc 3 — Jonin:** TanStack Query, Zustand/Redux Toolkit, React Hook Form + Zod, performance
- **Arc 4 — Anbu:** Next.js (RSC, Server Actions), Vitest + RTL + Playwright, a11y, CI/CD
- **Arc 5 — Hokage:** real-time/CRDT, monorepos (Turborepo), micro-frontends, the reconciler & fiber

### Next mission — GitHub Card Summoner
Fetch `https://api.github.com/users/{name}`; handle loading / success / error.
The trap: `useEffect` callbacks can't be `async` directly; fast typing resurrects the race → `AbortController` cleanup is the fix.
- 📜 https://react.dev/reference/react/useEffect#fetching-data-with-effects
- 📜 https://developer.mozilla.org/en-US/docs/Web/API/AbortController

---

## 📚 Core references

- React docs: https://react.dev/learn
- `useState`: https://react.dev/reference/react/useState
- `useEffect`: https://react.dev/reference/react/useEffect
- You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- TypeScript with React: https://react.dev/learn/typescript
- MDN Web Docs: https://developer.mozilla.org/

# Atomic Design Standards

This project adopts Brad Frost’s **Atomic Design** methodology to keep UI code predictable, discoverable, and reusable. Follow these conventions unless a maintainer approves an exception.

---

## 1. Layer Definitions

| Layer         | Purpose & Scope                                              | Folder                         | Examples                                |
| ------------- | ------------------------------------------------------------ | ------------------------------ | --------------------------------------- |
| **Atoms**     | Smallest “leaf” pieces of UI—no internal state; fully styled | `web/src/components/atoms`     | `Button.tsx`, `Input.tsx`, `Logo.tsx`   |
| **Molecules** | Groups of atoms working together, may manage _local_ state   | `web/src/components/molecules` | `FormField.tsx`, `NavItem.tsx`          |
| **Organisms** | Section-level UI; can fetch data; can accept children        | `web/src/components/organisms` | `Header.tsx`, `EstimateForm.tsx`        |
| **Templates** | Page layouts with regions for dynamic data                   | `web/src/components/templates` | `MainLayout.tsx`, `MarketingLayout.tsx` |
| **Pages**     | Route-level components (Next.js app router)                  | `web/src/app/**/page.tsx`      | `app/(public)/services/[slug]/page.tsx` |

> **Rule of thumb**: If you can meaningfully break a component into smaller parts that are reused elsewhere, you probably should.

---

## 2. File & Naming Conventions

- **One component per file** (e.g. `Button.tsx`) plus an adjacent barrel for re-exports:
  ```
  Button.tsx
  Button.test.tsx
  Button.stories.tsx
  index.ts      ← export { Button } from './Button'
  ```
- **PascalCase** for component files, **camelCase** for hooks & utility files.
- Use the suffix ``only when a component truly needs client-side execution (e.g. event handlers,`useState`, `useEffect`).

---

## 3. Styling Guidelines

- **Tailwind CSS** is the default.\
  \*Extract long or shared classlists into \***\*atoms\*\*** (e.g. **`Input.tsx`**) or \***_TW variants_**.

- When a design token repeats across multiple organisms, expose it via CSS variable on `:root` in `globals.css` and consume with `var(--token)`.

---

## 4. Storybook & Tests

- Each atom, molecule, and organism **must** have:
  - a **Storybook story** (`*.stories.tsx`) showcasing at least “Default” and an edge-case variant.
  - a **unit test** (`*.test.tsx`) covering rendering and critical interactions (React Testing Library + Jest).

- Templates and pages should have **integration / smoke tests** only.

---

## 5. Import Paths

Use root-relative aliases (configured in `tsconfig.json`) to avoid brittle `../../..` chains:

```ts
import { Button } from '@/components/atoms';
import { EstimateForm } from '@/components/organisms/EstimateForm';
```

---

## 6. When to Promote or Demote

- Promote a molecule → organism when it starts handling external data fetches or complex state.
- Demote an organism → molecule when the logic is split out and it becomes a purely presentational group.

---

## 7. PR Checklist for UI Work

1. Component placed in correct layer folder.
2. Filename matches component name; exported in nearest `index.ts`.
3. Tailwind classes reviewed for duplication opportunities.
4. Storybook stories build locally (`pnpm storybook`).
5. Jest tests pass (`pnpm test`).
6. Docs updated (if a new public component).

_Adhering to these standards keeps the codebase modular and accelerates on-boarding of future contributors._ 🚀

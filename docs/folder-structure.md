# Monorepo Folder Structure

> **Scope**: This document explains the default directory layout for the Wyatt Go Home Solutions monorepo.\
> Stick to this structure so that all contributors—and our CI pipeline—can find things quickly.

```
.
├── .devcontainer/        # VS Code Remote Container config (Node, pnpm, Terraform)
├── .github/              # PR templates, workflows, CODEOWNERS
├── docs/                 # Project docs (incl. Atomic Design, contributing, etc.)
├── infra/                # Terraform IaC for Vercel, Neon, R2, Turnstile, Resend
│   ├── main.tf
│   ├── variables.tf
│   └── README.md
├── pnpm-workspace.yaml   # Declares workspaces for 🚀 Hoisting
├── package.json          # Root scripts (lint, test, format), repo metadata
├── studio/               # Sanity v3 Content Studio
│   ├── sanity.config.ts
│   └── schemas/
├── web/                  # Next.js 14 App Router application
│   ├── .storybook/       # Storybook config
│   ├── public/           # Static assets (favicons, og images)
│   ├── src/
│   │   ├── app/          # Route tree (pages, layouts, loading, error)
│   │   ├── components/
│   │   │   ├── atoms/
│   │   │   ├── molecules/
│   │   │   ├── organisms/
│   │   │   └── templates/
│   │   ├── hooks/        # Reusable React hooks
│   │   ├── lib/          # Helpers (api, prisma, upload, analytics)
│   │   ├── styles/       # Global & util CSS / Tailwind config
│   │   └── tests/        # Jest setup, test-utils
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   └── tsconfig.json
└── README.md
```

---

## 1. Workspace Packages

| Package    | Path      | Tech       | Purpose                        |
| ---------- | --------- | ---------- | ------------------------------ |
| **web**    | `/web`    | Next.js 14 | Public site + admin dashboard  |
| **studio** | `/studio` | Sanity v3  | Headless CMS & content schemas |
| **infra**  | `/infra`  | Terraform  | Provision & output cloud infra |

> **Why no **``** packages yet?**\
> Until we need separate versioning (e.g., shared NPM lib) we keep things simple.

---

## 2. Component Paths (Atomic Design)

- `web/src/components/atoms/` → fundamental UI pieces (buttons, inputs).
- `web/src/components/molecules/` → small groups of atoms (form field).
- `web/src/components/organisms/` → full sections (estimate form, header).
- `web/src/components/templates/` → layout skeletons with named slots.

Import via the `@/components/*` alias configured in ``.

```ts
import { Button } from '@/components/atoms';
```

---

## 3. Testing & Tooling Locations

| Tool                  | Location                                                 |
| --------------------- | -------------------------------------------------------- |
| **Jest**              | `web/src/tests/**` + `*.test.tsx` beside unit under test |
| **Storybook**         | `web/.storybook/` config & `*.stories.tsx` near source   |
| **Cypress**           | `web/cypress/` end‑to‑end specs                          |
| **ESLint / Prettier** | Config at repo root; rules shared via `"extends"`        |

---

## 4. Scripts Cheat‑Sheet (root `package.json`)

```
# Dev web + studio concurrently
pnpm dev

# Type‑check all workspaces
pnpm typecheck

# Run Jest unit tests
pnpm test

# Lint & format
pnpm lint
pnpm format

# Storybook
pnpm storybook

# Provision / update cloud infra
cd infra && terraform init && terraform apply
```

---

## 5. Adding Something New

1. **Choose the right workspace** (`web`, `studio`, `infra`).
2. **Follow Atomic Design**: place new UI in atoms/molecules/…
3. **Barrel export** the component (`index.ts`).
4. Include **unit tests + Storybook story** if UI.
5. Run `pnpm lint && pnpm test` before committing.
6. Open a **pull request**; link to the relevant _Prompt XX_ task.

---

Keeping to this structure helps Claude Code reason about paths automatically and lets contributors jump in without a scavenger hunt. 🚀

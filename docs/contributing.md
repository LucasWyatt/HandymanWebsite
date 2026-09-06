# Contributing Guide

Welcome to the Wyatt Go Home Solutions monorepo!\
This project uses a **prompt‑driven workflow**: each numbered prompt (see `/docs/README.md`) defines a discrete unit of work for Claude Code 4 CLI to implement. Follow the standards below to keep history clean and reviews painless.

---

## 1. Branching Model

| Branch type    | Naming pattern     | When to create                              |
| -------------- | ------------------ | ------------------------------------------- |
| **Feature**    | `feat/prompt-<NN>` | Implement a prompt (e.g. `feat/prompt-04`)  |
| **Bugfix**     | `fix/<slug>`       | Hot‑fix on `main` after release             |
| **Chore**      | `chore/<slug>`     | Docs, tooling, or dependency bumps          |
| **Experiment** | `exp/<slug>`       | Spikes or throw‑away PoCs (will be deleted) |

_The **`main`** branch is \***\*protected\*\***—all commits must land via Pull Request._

---

## 2. Commit Style

We use a simplified **Conventional Commits** format:

```
<type>(scope?): <brief description>

<body – optional but encouraged>
```

**Types:** `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `ci`\
**Scope:** folder or package, e.g. `feat(web): add EstimateForm validation`.

> **Tip:** For large prompts, prefer several focused commits over one mega‑commit.

---

## 3. Pull‑Request Checklist

Before opening a PR, ensure:

1. **Branch name** matches pattern (`feat/prompt-05`).
2. `pnpm lint && pnpm test && pnpm typecheck` pass locally.
3. New UI has **unit tests** and **Storybook stories** (see `/docs/atomic-design.md`).
4. Any Terraform change has been `terraform fmt`‑ed and `plan` reviewed.
5. Relevant docs updated (README, docs/, or inline JSDoc).
6. PR description includes:
   - ✅ **Prompt number** & link (e.g. _Implements Prompt 05_)
   - Overview of changes + screenshots if UI.
   - “Checklist” section copied & ticked.

> Fill out the `` that lives in the repo.

### What happens next?

- **CI** (GitHub Actions) runs lint, unit tests, build, and Vercel preview deploy.
- The **project maintainer** (currently @you) leaves comments or approves.
- When approved, the author **squash‑merges** the PR → `main`.

---

## 4. Coding Standards

| Area       | Tool / Rule                                                |
| ---------- | ---------------------------------------------------------- |
| TypeScript | `strict` mode, no `any` unless justified in comments       |
| Linting    | ESLint (airbnb+react) + Prettier, run via Husky pre‑commit |
| Styling    | Tailwind; avoid inline styles except for 1‑off tweaks      |
| Tests      | Jest + React Testing Library for units, Cypress for e2e    |
| Docs       | Update Markdown when behaviour or API changes              |

---

## 5. Keeping Secrets Safe

- Never commit `.env.local` or any raw keys.
- Terraform outputs are written to **GitHub Secrets** via `gh secret set`.
- If you need a new secret for local dev, add a placeholder to `.env.example`.

---

## 6. Issue Tracking & Discussions

- Use **GitHub Issues** for bugs or non‑prompt feature ideas. Tag appropriately: `bug`, `enhancement`, `question`, `infra`.
- Link issues in PR descriptions: `Fixes #123` or `Closes #45`.
- For quick questions, start a **GitHub Discussion** instead of `@` mentions.

---

## 7. Release Process (future)

Once we approach v1 launch, we’ll adopt **semantic‑release** to automate changelog and version bumps. Until then, manual tags are fine.

---

## 8. Code of Conduct

Be respectful, write clear reviews, and remember Claude is following prompts. 🤖

---

Thanks for helping make this codebase robust and welcoming! 🛠️

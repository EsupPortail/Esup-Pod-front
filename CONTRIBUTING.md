# Contribution Guide - Esup-Pod (Frontend)

Bienvenue dans le dépôt du frontend Esup-Pod. Ce document a pour but de vous guider à la fois sur l'architecture du projet et sur nos règles de contribution pour maintenir un standard de qualité élevé.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer:, and find related reports :mag_right:.

- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps which reproduce the problem** in as many details as possible.
- **Provide specific examples to demonstrate the steps** (links, snippets).
- **Describe the behavior you observed** after following the steps and point out what exactly is the problem.
- **Explain which behavior you expected to see instead and why.**
- **Include screenshots and animated GIFs** which show you following the described steps.
- Include details about your environment:
  - **Which version of Pod are you using?**
  - **What’s the name and version of the browser you’re using**?

### Pull Requests

The process described here has several goals:

- Maintain quality
- Fix problems that are important to users
- Enable a sustainable system for maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Make sure that your pull request targets the `dev` branch.
2. Your PR status is in `draft` while it’s still a work in progress.
3. After you submit your pull request, verify that all status checks (CI) are passing.

---

## Styleguides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to…" not "Moves cursor to…")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### Naming Conventions and Case Styles

Use consistent casing across the codebase so files and symbols are easy to read and to distinguish by language:

- **JavaScript / TypeScript**: Use `camelCase` for variables, functions, hooks, and object properties (`usePlaylist`, `fetchVideos`, `selectedVideoId`).
- **React components**: Use `PascalCase` for component names and file names (`VideoCard.tsx`, `SidebarMenu.tsx`).
- **Constants / enums / configuration values**: Use `UPPER_SNAKE_CASE` for shared constants when they are truly constant (`API_BASE_URL`, `DEFAULT_LANGUAGE`).
- **CSS / CSS Modules**: Use `kebab-case` for class names and custom property names (`video-card`, `page-header`, `--brand-primary`).
- **Files**: Prefer descriptive names that match their purpose; use kebab-case for CSS files when relevant and PascalCase for React component files.
- **Avoid mixing styles**: Do not use `camelCase` for CSS classes or `kebab-case` for JavaScript identifiers.

### Typography

Please use these typographic characters in all displayed strings:

- Use Apostrophe (’) instead of single quote (')
  - English samples: don’t, it’s
  - French samples: J’aime, l’histoire
- Use the ellipsis (…) instead of 3 dots (...)
  - English sample: Loading…
  - French sample: Chargement…
- Use typographic quotes (“ ”) instead of neutral quotes (" ")
  - English sample: You can use the “Description” field below.
  - French sample: Utilisez le champ « Description » ci-dessous

### Languages

The application uses locale files under `src/locales/` as the single source of truth for user-facing text. Every visible string should be defined in the relevant dictionary, then consumed through the translation helper instead of being written directly in components.

- **Source of truth**: Use the files `src/locales/fr.ts`, `src/locales/en.ts`, and `src/locales/es.ts`.
- **Key structure**: Keep translations grouped by domain (`common`, `auth`, `home`, `preferences`, `filters`, etc.) to match the project conventions.
- **No hardcoded strings**: Do not write literal text directly in JSX, CSS labels, or UI metadata when a translation key exists.
- **Examples from the project**: prefer values such as `common.loading`, `auth.loginTitle`, `preferences.languageSectionTitle`, and `home.welcomeSubtitle` instead of raw strings like "Chargement…" or "Login".
- **Add keys in all locales**: When a new user-facing label is introduced, add it consistently to every locale file to avoid missing translations.
- **Use existing keys first**: Before creating a new key, check whether an equivalent translation already exists in the dictionary files.
- **Formatting and typography**: Keep the locale values responsible for punctuation and special characters, such as ellipses and apostrophes, as already used in the existing language files (`Chargement…`, `Bienvenue…`, `Niveau d’études`).

---

## Architecture & Conventions (Frontend specific)

This project is based on **Next.js** and **React**.

### Dos & Don'ts

- **TypeScript :** This project is strictly typed. Verify them before commiting with `yarn typecheck`
- **Liting :** Do not commit code with ESLint errors. Use `yarn lint` to check before commiting. (The project is configured with a pre-commit hook).
- **Side effects (useEffect) :** Avoid synchronous `setState` in `useEffect`, this triggers cascading renders.
- **API requests :** All backend communication must go through `authFetch` and be encapsulated in a hook using **React Query**.
- **Desig System :** This project uses **Cunningham**. For any new integration, please prioritize Cunningham over MUI. If you modify `cunningham.ts`, you need to recompile the tokens with the `yarn build-theme` command.

### Tests

We are gradually implementing unit tests using **Vitest**.

- Run the tests: `yarn test`
- Test files use the `.test.ts` or `.test.tsx` extension and are located in the same folder as the component being tested.

Thank you for your contribution!

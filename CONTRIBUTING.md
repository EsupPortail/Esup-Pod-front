# Contribution Guide - Esup-Pod V5 (Frontend)

Bienvenue dans le dépôt du frontend Esup-Pod V5. Ce document a pour but de vous guider à la fois sur l'architecture du projet et sur nos règles de contribution pour maintenir un standard de qualité élevé.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report. Following these guidelines helps maintainers and the community understand your report :pencil:, reproduce the behavior :computer:, and find related reports :mag_right:.

* **Use a clear and descriptive title** for the issue to identify the problem.
* **Describe the exact steps which reproduce the problem** in as many details as possible.
* **Provide specific examples to demonstrate the steps** (links, snippets).
* **Describe the behavior you observed** after following the steps and point out what exactly is the problem.
* **Explain which behavior you expected to see instead and why.**
* **Include screenshots and animated GIFs** which show you following the described steps.
* Include details about your environment:
  * **Which version of Pod are you using?**
  * **What’s the name and version of the browser you’re using**?

### Pull Requests

The process described here has several goals:

* Maintain quality
* Fix problems that are important to users
* Enable a sustainable system for maintainers to review contributions

Please follow these steps to have your contribution considered by the maintainers:

1. Make sure that your pull request targets the `dev` branch.
2. Your PR status is in `draft` while it’s still a work in progress.
3. After you submit your pull request, verify that all status checks (CI) are passing.

---

## Styleguides

### Git Commit Messages

* Use the present tense ("Add feature" not "Added feature")
* Use the imperative mood ("Move cursor to…" not "Moves cursor to…")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line
* Consider starting the commit message with an applicable emoji:
  * :art: `:art:` when improving the format/structure of the code
  * :racehorse: `:racehorse:` when improving performance
  * :memo: `:memo:` when writing docs
  * :bug: `:bug:` when fixing a bug
  * :fire: `:fire:` when removing code or files
  * :green_heart: `:green_heart:` when fixing the CI build
  * :white_check_mark: `:white_check_mark:` when adding tests
  * :arrow_up: `:arrow_up:` when upgrading dependencies
  * :shirt: `:shirt:` when removing linter warnings

---

## Architecture & Conventions (Frontend specific)

Le projet est basé sur **Next.js (App Router)** et **React**.

### Dos & Don'ts

* **TypeScript :** Le projet est strictement typé. Vérifiez vos types avant de commiter avec `yarn typecheck`.
* **Linting :** Ne commitez pas de code avec des erreurs ESLint. Utilisez `yarn lint`. (Le projet est configuré avec un hook pre-commit).
* **Effets secondaires (useEffect) :** Évitez de faire des `setState` de manière synchrone dans un `useEffect`, cela provoque des rendus en cascade.
* **Requêtes API :** Toute communication backend doit passer par `authFetch` et être encapsulée dans un hook utilisant **React Query**.
* **Design System :** Le projet utilise **Cunningham**. Pour toute nouvelle intégration, veuillez privilégier Cunningham plutôt que MUI. Si vous modifiez `cunningham.ts`, vous devez recompiler les tokens avec la commande `yarn build-theme`.

### Tests

Nous mettons en place progressivement des tests unitaires avec **Vitest**.

* Lancer les tests : `yarn test`
* Les fichiers de tests portent l'extension `.test.ts` ou `.test.tsx` et se situent dans le même dossier que le composant testé.

Merci pour votre contribution !

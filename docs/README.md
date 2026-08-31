# Pod V5 Front Documentation

Welcome to the Pod V5 Frontend Documentation. This guide is intended for developers and UI/UX contributors.

## Table of Contents

### Configuration & Deployment

- **[Deployment & Variables](deployment.md)**: Configuration of `.env` variables (`NEXT_PUBLIC_BACK_URL`), setup with Node 20+, and build instructions.
- **[Design System](design_system.md)**: Customization of Cunningham tokens, MUI integration, and global styles.

### Application Architecture

The frontend is built with **Next.js (App Router)** and **React**.

- **[Architecture Overview](architecture.md)**: General project structure, Server vs Client components, and security (XSS & Tokens).
- **[State Management & Data Fetching](state_management.md)**: How we use **React Query** (`useQuery`, `useInfiniteQuery`, `useMutation`), query invalidation, and React Contexts (AuthProvider).
- **[Component Library & Best Practices](components.md)**: Rules for writing reusable components, CSS Modules, and handling forms.

### Workflows & Testing

- **[Testing Strategy](testing.md)**: Setup and rules for unit testing with **Vitest** and **React Testing Library**.
- **[API Consumption](api_consumption.md)**: The `authFetch` wrapper, endpoints mapping, and handling HTTP errors gracefully.

---

### Rules & Contributions

To maintain project quality, please refer to the following guides:

- **[Contribution Guide](../CONTRIBUTING.md)**: Coding rules, commit messages, and PR workflow.
- **[Code of Conduct](../CODE_OF_CONDUCT.md)**: Community commitment.

---

## Project Structure

```text
Esup-Pod-front/
├── src/
│   ├── app/              # Next.js App Router Pages
│   │   ├── login/
│   │   ├── video/
│   │   ├── playlist/
│   │   └── dashboard/
│   ├── components/       # Shared UI Components
│   │   ├── video/
│   │   ├── collection/
│   │   ├── Sidebar/
│   │   └── Navbar/
│   ├── hooks/            # Custom React Hooks & React Query
│   ├── context/          # React Providers (Auth, Theme)
│   ├── api/              # API Wrappers (authFetch, requestJson)
│   ├── constants/        # Global definitions & labels
│   ├── types/            # TypeScript interfaces
│   └── utils/            # Helper functions
├── public/               # Static assets
├── docs/                 # Documentation (You are here)
├── .husky/               # Pre-commit hooks
└── package.json
```

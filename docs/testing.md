# Stratégie de Tests (Vitest)

L'application Frontend utilise **Vitest** et **React Testing Library** pour les tests unitaires et d'intégration.

## 1. Stack technique

- **Vitest** : Moteur d'exécution des tests (compatible avec la syntaxe Jest et bien plus rapide car utilisant Vite).
- **React Testing Library (@testing-library/react)** : Permet de tester les composants React du point de vue de l'utilisateur (interactions DOM, rendu).
- **@testing-library/jest-dom** : Fournit des matchers de test utiles (ex: `toBeInTheDocument()`).

## 2. Configuration

- Fichier racine : `vitest.config.ts` (alias des chemins `@/*`, environnement JS-DOM).
- Setup global : `vitest.setup.ts` (mocking des variables d'environnement, Polyfills, Mock du backend).

## 3. Emplacement des Tests

Les fichiers de tests doivent être placés juste à côté du fichier qu'ils testent, avec l'extension `.test.tsx` ou `.test.ts`.

Exemple :

```text
src/components/video/player/
├── VideoPlayer.tsx
└── VideoPlayer.test.tsx
```

## 4. Ce que l'on teste

1. **Composants Critiques** : `VideoPlayer`, `VideoDisplay`.
2. **Contextes / Providers** : `AuthProvider` (le maintien de l'état JWT, le refresh silencieux).
3. **Utilitaires** : Les fonctions métiers pures (`requestJson.ts`).

*Nous ne testons pas l'interface UI au pixel près (Snapshots), mais bien les comportements.*

## 5. Exécution des Tests

```bash
yarn test          # Lancer Vitest (Watch mode par défaut)
yarn test --run    # Lancer les tests une seule fois (pour la CI)
```

## 6. Bonnes pratiques de Mocking

- Pour les tests impliquant des requêtes, on mock la fonction utilitaire qui wrap la requête (ex: mock `authFetch` ou utilisation de MSW si configuré).
- Le contexte d'authentification (`useAuth`) doit être wrappé par un faux provider dans les tests de composants.

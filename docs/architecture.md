# Architecture Esup-Pod V5 Frontend

Ce document décrit l'architecture, les patterns et les conventions de l'application React / Next.js (App Router).

## 1. Stack Technique

- **Framework** : Next.js 15 (App Router)
- **Langage** : TypeScript strict
- **Design System** : Double dépendance (migration en cours) :
  - **MUI (Material-UI)** : Historique, utilisé pour les composants complexes (Menu, Popover) et les icônes (`@mui/icons-material`).
  - **Cunningham** : Design system de référence actuel pour Esup-Pod. Utilisé pour les boutons, formulaires, alertes.
- **Data Fetching & State** : React Query (`@tanstack/react-query`)
- **Vidéos** : Video.js avec un wrappeur custom.

## 2. Structure des Dossiers

```text
src/
├── api/          # Wrappers d'API et fetchers (ex: authFetch.ts)
├── app/          # Routes Next.js (App Router) - Chaque page est dans son dossier
├── components/   # Composants React isolés et réutilisables (découpés par feature)
├── constants/    # Variables globales, traductions, formateurs (date, time)
├── context/      # Contextes React (ex: AuthProvider)
├── hooks/        # Custom hooks métiers (ex: useVideos, useAuth)
├── types/        # Définitions TypeScript
└── utils/        # Fonctions utilitaires génériques
```

## 3. Data Flow et APIs

### Le pattern `authFetch`

Toutes les requêtes au backend passent par `authFetch` (dans `src/api/authFetch.ts`).
Ce wrapper :

1. Récupère le token JWT depuis le `localStorage`.
2. L'injecte dans le header `Authorization: Bearer <token>`.
3. Intercepte les `401 Unauthorized` pour tenter un refresh silencieux du token.
4. Redirige vers `/login` si le refresh échoue.

### Les Hooks Métiers (`useEntity`)

Les composants ne font jamais de fetch directement. Ils utilisent des hooks (ex: `usePlaylist`, `useChannel`).
Ces hooks encapsulent React Query (`useQuery`, `useMutation`) et gèrent :

- Le cache
- Les états de chargement (`isLoading`)
- La gestion d'erreur formattée

Exemple de convention :

- `useVideo` : Logique CRUD pour une vidéo.
- `useVideosList` : Logique de pagination, tri et filtrage pour une liste.

## 4. Composants Client et Serveur

L'application utilise l'App Router de Next.js.

- Les fichiers `page.tsx` à la racine des dossiers sont souvent des **Server Components** pour gérer le SEO via l'export de `metadata`.
- Les Server Components importent et renvoient ensuite des **Client Components** (portant souvent le suffixe `ClientPage.tsx` ou avec un `'use client'` explicite).
- Cela permet un bon référencement naturel (SEO) tout en conservant la réactivité complète de React.

## 5. Règles de nommage et Conventions

- **Composants** : PascalCase (`VideoPlayer.tsx`).
- **Hooks** : camelCase préfixé par `use` (`useRequireAuth.tsx`).
- **Styles** : Utilisation des CSS Modules (`styles.module.css`). Classes en snake_case (ex: `.video_infos_header`) pour éviter la collision.

## 6. Bonnes pratiques de code

1. **Eviter le `setState` dans le `useEffect`** : Le React Compiler pénalise fortement les appels à setState synchrones dans un effet. Privilégiez `useMemo` ou mettez à jour l'état au niveau des events handlers (`onClick`, `onSubmit`).
2. **Dépendances exhaustives** : Le tableau de dépendances des `useEffect` et `useCallback` doit être complet.
3. **Immutabilité** : Ne mutez jamais un objet d'état, recréez-le (`setList(prev => [...prev, newItem])`).
4. **Refs** : Ne jamais accéder à `ref.current` pendant le cycle de rendu principal (utiliser un `useEffect` ou le faire dans les handlers).

## 7. Authentification

L'état d'authentification est maintenu dans `AuthProvider` (basé sur le JWT du localStorage).

- Pour protéger une route : Utilisez le hook `useRequireAuth("/login")` en haut de votre composant. Il vérifiera la session et redirigera l'utilisateur si nécessaire.

### Sécurité et Stockage des Jetons (Tokens)

Actuellement, les jetons JWT (Access et Refresh) sont stockés dans le `localStorage` du navigateur.

- **Avantage** : Facilite grandement l'intégration avec des clients non-web (mobile) ou des requêtes inter-domaines sans se soucier de la complexité des CORS / requêtes authentifiées par cookies.
- **Risque (XSS)** : Le stockage local expose les jetons aux attaques de type Cross-Site Scripting (XSS). Tout script malveillant injecté sur le domaine pourrait théoriquement lire le `localStorage` et voler la session.
- **Recommandation future** : Si le backend le permet, une migration vers des cookies `httpOnly` pour stocker le Refresh Token est recommandée pour durcir la sécurité. En attendant, la sécurité repose entièrement sur l'assainissement strict du code React (échappement automatique des variables) et la mise en place d'une CSP (Content Security Policy) robuste pour prévenir les injections de scripts.

---
*Ce document doit évoluer à mesure que le refactoring de la plateforme progresse.*

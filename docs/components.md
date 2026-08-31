# Guide des Composants (UI & Design System)

Le frontend utilise une architecture basée sur des composants fonctionnels React typés (TypeScript).

## 1. Design System : Cunningham

Nous utilisons [Cunningham](https://github.com/suitenumerique/cunningham) comme design system principal. Il fournit :

- Les variables CSS (`var(--c--globals--colors--...)`)
- Des composants accessibles (Button, Modal, Input)
- Les polices et espacements standards.

### Compilation du thème

Si vous modifiez le fichier racine `cunningham.ts`, vous devez recompiler le thème pour générer les variables CSS :

```bash
yarn build-theme
```

## 2. Règle "Dumb vs Smart Components"

Nous essayons de séparer la logique de l'affichage.

1. **Dumb Components** (Composants de Présentation) : Situés dans `src/components/`, ils ne font pas de requêtes API et se contentent d'afficher des props (`VideoCard`, `VideoPlayer`).
2. **Smart Components** (Composants Conteneurs / Pages) : Situés dans `src/app/`, ils utilisent les hooks (ex: `useVideosList`) pour récupérer la donnée, puis la passent aux "Dumb Components".

## 3. Styles (CSS Modules)

Pour éviter les collisions de styles, nous utilisons les **CSS Modules**.

- Fichier : `styles.module.css` (situé dans le même dossier que le composant).
- Nom de classe : `camelCase` ou `snake_case` utilisé via l'import de styles (`className={styles.myClass}`).
- **Strictement interdit** : Les sélecteurs CSS globaux (sauf dans `globals.css`).

## 4. Composants Client vs Serveur

Next.js utilise l'App Router.

- Par défaut, tout fichier dans `src/app/` est un **Server Component** (rendu sur le serveur Node.js).
- Si votre composant nécessite de l'interactivité (ex: `onClick`, `useState`), vous DEVEZ ajouter la directive `"use client";` tout en haut du fichier.

*Convention interne :* On essaie de garder la coquille de la page `page.tsx` comme composant serveur pour l'injection des métadonnées (SEO), et d'importer un composant `<MaFeatureClientPage />` qui s'occupe de la logique client.

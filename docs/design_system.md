# Design System (Cunningham & CSS)

Afin d'assurer la cohérence visuelle et l'accessibilité globale de la plateforme, nous utilisons le Design System **Cunningham**.

## 1. Cunningham

Cunningham est le Design System de la Suite Numérique. Il fournit une surcouche de composants React robustes et un générateur de tokens CSS.

### Fichier `cunningham.ts`

C'est le fichier maître du design. Il définit la palette de couleurs principale (Primary, Secondary, Success, Warning, etc.), les espacements, et la typographie.
Si l'établissement (ex: l'Université) souhaite modifier la couleur principale pour qu'elle corresponde à sa charte graphique, c'est **exclusivement** dans ce fichier que cela se passe.

### Génération des variables CSS

Une fois `cunningham.ts` modifié, les variables CSS (ex: `--c--globals--colors--primary-500`) doivent être regénérées via la commande :

```bash
yarn build-theme
```

## 2. Utilisation dans le code

Il ne faut **jamais** utiliser de couleurs ou d'espacements codés en dur (`#FF0000`, `15px`).
Utilisez toujours les variables CSS fournies par Cunningham :

**❌ Mauvais :**

```css
.myContainer {
  background-color: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}
```

**✅ Bon :**

```css
.myContainer {
  background-color: var(--c--globals--colors--gray-100);
  padding: var(--c--globals--spacings--lg);
  border-radius: var(--c--theme--border-radius);
}
```

## 3. Cohabitation avec MUI (Material-UI)

L'application est dans une phase de transition. Certains composants complexes (comme les Menus déroulants avancés ou certaines modales complexes) utilisent encore MUI.

- **Règle** : Si Cunningham propose le composant (ex: `Button`, `Input`, `Alert`), privilégiez **toujours** Cunningham.
- **Icônes** : Les icônes utilisées restent les `Material-Icons` standards via le package `@mui/icons-material`.

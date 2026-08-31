# Déploiement et Variables d'Environnement

L'application Frontend Pod V5 est une application Next.js standard pouvant être déployée sur n'importe quel conteneur Node.js.

## 1. Prérequis Serveur

- Node.js >= 20.x
- Yarn >= 4.x (Corepack activé)

## 2. Variables d'Environnement

L'application utilise un fichier `.env` ou `.env.local` pour sa configuration.
Toute variable préfixée par `NEXT_PUBLIC_` sera exposée au navigateur (Frontend). Les autres seront réservées au serveur Node.js.

**Variables critiques :**

- `NEXT_PUBLIC_BACK_URL` : L'URL racine de l'API Backend (ex: `https://api.pod.univ.fr/`).
- `NEXT_PUBLIC_APP_TITLE` : Titre global de l'application.
- `NEXT_PUBLIC_APP_LOGO` : Chemin vers le logo de l'université.

## 3. Lancer en Production (Build)

Next.js requiert une phase de build pour optimiser les assets, pré-rendre les Server Components et compiler TypeScript.

```bash
# 1. Génération du thème CSS
yarn build-theme

# 2. Build de l'application Next.js
yarn build

# 3. Lancement du serveur de production
yarn start
```

## 4. Architecture Docker (Optionnelle)

Bien que ce dépôt ne contienne pas de `Dockerfile` explicite, il est recommandé de packager l'application via une image `node:20-alpine`, de lancer la commande `yarn build` lors de la construction de l'image, et de configurer l'ENTRYPOINT sur `yarn start`.

## 5. Reverse Proxy / Nginx

L'application écoute généralement sur le port 3000. Il est de la responsabilité du reverse proxy (Nginx, Traefik) d'exposer l'application sur le port 80/443 et de configurer le certificat SSL.

# Consommation de l'API (Backend Django)

L'interaction avec l'API Pod V5 est standardisée pour garantir le passage sécurisé des tokens et une gestion unifiée des erreurs.

## 1. La définition des Routes (`src/api/routes.ts`)

Toutes les URLs d'API sont stockées et exportées via un objet ou une fonction (`getRoutes()`).
Cela centralise la configuration (ex: préfixe `/api/v1/`) et évite les chaînes de caractères magiques dans les composants.

## 2. Le Wrapper `authFetch`

Pour toute requête nécessitant une authentification, il faut utiliser la fonction `authFetch` (située dans `src/api/authFetch.ts`) plutôt que le `fetch` natif.

**Mécanique interne de `authFetch` :**

1. Prend l'URL et les options standard de fetch.
2. Intercepte la requête pour ajouter le header `Authorization: Bearer <access_token>`.
3. Si le serveur répond avec `401 Unauthorized` (Token expiré), `authFetch` intercepte l'erreur.
4. Lance automatiquement une tentative de `refresh` via le Refresh Token.
5. Si succès, rejoue la requête originale avec le nouveau token.
6. Si échec (Refresh token expiré), déconnecte l'utilisateur.

## 3. Parsing des résultats (`requestJson`)

La fonction utilitaire `requestJson<T>(response)` s'assure de parser proprement le retour JSON et de typer la sortie, tout en évitant les crashs si le JSON est invalide ou vide (ex: réponse `204 No Content`).

Exemple :

```typescript
const res = await authFetch(getRoutes().video.get(slug), {
  accessToken,
  onRefresh: refresh,
});

if (!res.ok) throw new Error("Erreur");
return requestJson<Video>(res); // Retourne la donnée typée proprement
```

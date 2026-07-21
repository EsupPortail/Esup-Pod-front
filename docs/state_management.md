# Gestion d'État et Data Fetching (React Query)

Le frontend Pod V5 utilise **React Query (@tanstack/react-query)** comme solution principale de gestion d'état serveur. La gestion de l'état client local est réduite au minimum.

## 1. Pourquoi React Query ?

Contrairement à Redux, React Query est conçu pour synchroniser l'état local du client avec l'état distant du serveur. Il offre nativement :

- La mise en cache (Cache-Control)
- Les requêtes en arrière-plan (Background Fetching)
- Les invalidations simples (`queryClient.invalidateQueries`)
- La pagination infinie (`useInfiniteQuery`)

## 2. Structure des Hooks (`useEntity`)

Aucun composant ne devrait appeler directement l'API (via fetch). Tout doit passer par des Hooks dédiés, situés dans le dossier `src/hooks/`.

Exemples :

- `useVideo(slug)` : Récupération d'une seule vidéo.
- `useVideosList(params)` : Récupération paginée d'une collection.
- `usePlaylist(slug)` : CRUD sur les playlists.

### Exemple Type

```typescript
export function useVideo(slug: string, enabled = true) {
  const { accessToken, refresh } = useAuth();
  
  return useQuery({
    queryKey: ["video", slug],
    queryFn: async () => {
      const res = await authFetch(getRoutes().video.get(slug), {
        accessToken,
        onRefresh: refresh,
      });
      // ... gestion d'erreur
      return requestJson<Video>(res);
    },
    enabled: Boolean(slug) && enabled,
    staleTime: 60000,
  });
}
```

## 3. Pagination Infinie

L'API Django REST Framework retourne généralement des données paginées avec `count`, `next` et `previous`.
Nous utilisons `useInfiniteQuery` (voir `useVideos.tsx`) et un composant de détection de défilement (Observer) pour appeler `fetchNextPage` automatiquement.

## 4. Invalidation du Cache (Mutations)

Après une action d'écriture (POST, PUT, DELETE), le cache doit être invalidé pour déclencher un rafraîchissement automatique de la liste sans recharger la page.

```typescript
const queryClient = useQueryClient();

useMutation({
  mutationFn: (data) => createVideo(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["videos"] });
  }
});
```

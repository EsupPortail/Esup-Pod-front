export const CollectionBlockManifest = {
  frontend_id: "collection-block",
  name: "Bloc Générale de Collections",
  description: "Affiche une sélection paramétrable de collections (chaînes, thèmes, playlists).",
  fields: {
    collection_type: {
      type: "select",
      label: "Type de collection à afficher",
      options: [
        { label: "Chaînes (Channels)", value: "channel" },
        { label: "Thèmes (Catégories)", value: "theme" },
        { label: "Playlists", value: "playlist" },
        { label: "Toutes les collections", value: "all" },
      ],
      default: "channel",
    },
    collection_ids: {
      type: "text",
      label: "Identifiants ou Slugs de collections à afficher (séparés par virgule)",
      placeholder: "ex: 1, 5, actualites-2026",
      default: "",
    },
    order_by: {
      type: "select",
      label: "Ordre d'affichage",
      options: [
        { label: "Titre (A-Z)", value: "title" },
        { label: "Date de création (Récents)", value: "-created_at" },
      ],
      default: "title",
    },
  },
};

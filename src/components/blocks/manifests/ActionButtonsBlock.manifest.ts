export const ActionButtonsBlockManifest = {
  frontend_id: "action-buttons-block",
  name: "Bloc Boutons d'Action",
  description:
    "Affiche des boutons d'actions rapides (ex: Déposer une vidéo, Accéder à l'admin, etc.).",
  version: "1.0.0",
  fields_schema: {
    display_title: {
      type: "text",
      label: "Titre de la section (optionnel)",
      default: "",
    },
  },
};

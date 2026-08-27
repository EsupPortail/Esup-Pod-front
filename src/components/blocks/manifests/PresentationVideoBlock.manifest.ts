export const PresentationVideoBlockManifest = {
  frontend_id: "presentation-video-block",
  name: "Bloc Vidéo Mise en Avant (Hero)",
  description:
    "Met en avant la ou les dernières vidéos en grande taille, en haut de la page (section hero).",
  version: "1.0.0",
  fields_schema: {
    item_limit: {
      type: "number",
      label: "Nombre de vidéos à afficher",
      default: 1,
    },
    order_by: {
      type: "select",
      label: "Ordre de sélection",
      options: [
        { label: "Dernières ajoutées", value: "-created_at" },
        { label: "Les plus vues", value: "-views_count" },
        { label: "Titre (A-Z)", value: "title" },
      ],
      default: "-created_at",
    },
  },
};

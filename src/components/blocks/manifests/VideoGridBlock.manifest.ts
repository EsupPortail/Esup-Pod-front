export const VideoGridBlockManifest = {
  frontend_id: "video-grid-block",
  name: "Bloc Grille de Vidéos",
  description: "Affiche une rangée ou grille de cartes vidéos paramétrable.",
  fields: {
    order_by: {
      type: "select",
      label: "Ordre de tri des vidéos",
      options: [
        { label: "Dernières ajoutées", value: "-created_at" },
        { label: "Les plus vues", value: "-views_count" },
        { label: "Titre (A-Z)", value: "title" },
      ],
      default: "-created_at",
    },
  },
};

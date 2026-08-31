export const LiveBlockManifest = {
  frontend_id: "live-block",
  name: "Bloc Directs (Live Streams)",
  description: "Affiche la liste des directs en cours avec un indicateur actif rouge.",
  fields: {
    order_by: {
      type: "select",
      label: "Ordre de tri des directs",
      options: [
        { label: "Date de début (Prochainement)", value: "start_date" },
        { label: "Date de début (Récents)", value: "-start_date" },
        { label: "Titre (A-Z)", value: "title" },
        { label: "Popularité (Nombre de spectateurs)", value: "-max_viewers" },
      ],
      default: "start_date",
    },
  },
};

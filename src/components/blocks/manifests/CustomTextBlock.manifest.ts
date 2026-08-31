export const CustomTextBlockManifest = {
  frontend_id: "custom-text-block",
  name: "Bloc Texte Libre / HTML",
  description: "Affiche un paragraphe ou contenu personnalisé.",
  fields: {
    subtitle_or_text: {
      type: "textarea",
      label: "Contenu texte ou HTML",
      default: "",
    },
  },
};

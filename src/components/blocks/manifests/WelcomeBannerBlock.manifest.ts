export const WelcomeBannerBlockManifest = {
  frontend_id: "welcome-banner-block",
  name: "Bloc Bandeau d'Accueil",
  description:
    "Affiche un bandeau de bienvenue avec un message configurable en haut de la page d'accueil.",
  version: "1.0.0",
  fields_schema: {
    display_title: {
      type: "text",
      label: "Titre du bandeau",
      default: "Bienvenue sur POD WebTV",
    },
    subtitle_or_text: {
      type: "textarea",
      label: "Texte ou sous-titre du bandeau",
      default: "",
    },
  },
};

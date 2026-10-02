export const fr = {
  // === Commun ===
  common: {
    // Actions
    close: "Fermer",
    save: "Enregistrer",
    cancel: "Annuler",
    back: "Retour",
    update: "Mettre à jour",
    delete: "Supprimer",
    edit: "Éditer",
    add: "Ajouter",
    adding: "Ajout en cours…",
    addVideo: "Ajouter une vidéo",
    search: "Rechercher",
    selectAll: "Tout sélectionner",
    stayOnPage: "Rester sur la page",
    leaveWithoutSaving: "Quitter sans enregistrer",

    // Statut & connexion
    login: "Connexion",
    logout: "Déconnexion",
    connected: "Connecté",
    disconnected: "Déconnecté",
    loading: "Chargement…",
    error: "Une erreur est survenue",

    // Navigation
    home: "Accueil",
    selectionReturn: "Retour à la sélection",
    goToMainContent: "Aller au contenu principal",
    backToHomepage: "Retour à l'accueil",
    tab: "Tableau de bord",
    commingSoon: "Fonctionnalité à venir",

    // Entités (singulier / pluriel)
    video: "Vidéo",
    videos: "Vidéos",
    pluralVideos: "{count, plural, one {# vidéo} other {# vidéos}}",
    collection: "Collection",
    collections: "Collections",
    channel: "Chaîne",
    channels: "Chaînes",
    playlist: "Playlist",
    playlists: "Playlists",
    theme: "Thème",
    themes: "Thèmes",
    subtopic: "Sous-thème",
    subtopics: "Sous-thèmes",
    discipline: "Discipline",
    disciplines: "Disciplines",
    series: "Série / Émission",
    allVideos: "Toutes les vidéos",
    direct: "Direct",
    directs: "Les directs",
    view: "vue",
    views: "vues",

    // Affichage, recherche & pagination
    displayMode: "Affichage :",
    viewCards: "Cartes",
    viewTable: "Tableau",
    videosFound: "vidéo(s) trouvée(s)",
    found: "{count, plural, one {Trouvé} other {Trouvés}}",
    noResults: "Aucun résultat pour votre recherche",
    paginationInfo:
      "Affichage de {start} à {end} sur {count, plural, one {# vidéo{pageInfo}} other {# vidéos{pageInfo}}}",
    paginationPage: " (Page {page} sur {pagesCount})",
    opacity: "Opacité",

    // Métadonnées
    createdBy: "Créée par",
    latestUpdate: "Mise à jour le :",
    contributors: "Contributeurs & Intervenants",
    addContributorsDesc:
      "Ajoutez des auteurs, réalisateurs ou intervenants à votre vidéo.",
    infos: "Informations",
    configBase: "Configurez les paramètres de base",

    // Visibilité
    public: "Publique",
    private: "Privée",
    passwordProtected:
      "Vous avez activé la protection par mot de passe, veuillez saisir un mot de passe.",

    // Validation & confirmations
    titleRequired: "Le titre est obligatoire",
    descRequired: "La description est obligatoire.",
    permanentAction: "Cette action est définitive.",
    unsavedChangesLeaveConfirmation:
      "Vous avez des modifications non enregistrées. Voulez-vous vraiment quitter cette page ?",
    unsavedChangesTitle: "Modifications non enregistrées",

    // Divers
    recently: "Récemment",
    default: "Par défaut",
  },
  errors: {
    // Général
    error: "Une erreur est survenue",
    update: "Une erreur est survenue lors de la mise à jour",
    save: "Erreur lors de la sauvegarde",
    create: "Erreur lors de la création",
    loadError: "Erreur de chargement",
    loadConfig: "Erreur lors du chargement de la configuration",
    loadInfo: "Erreur lors du chargement des informations",
    notFound: "Page introuvable",
    notFoundDesc:
      "La page que vous recherchez n’existe pas ou a été supprimée.",
    serverError: "Erreur serveur",
    serverErrorDesc:
      "Une erreur est survenue côté serveur. Veuillez réessayer plus tard.",
    notConnected: "Utilisateur non connecté",
    error401: "Accès non autorisé (401). Veuillez vous connecter.",
    notConfigured:
      "La page demandée n’existe pas ou n’a pas encore été configurée pour cette établissement.",
    formFieldsError:
      "{count, plural, =1 {Veuillez corriger le champ suivant : {fields}.} other {Veuillez corriger les # champs suivants : {fields}.}}",
    savingFormError: "Erreur lors de l'enregistrement du formulaire",
    accessDenied: "Vous ne pouvez pas accéder à cette page",

    // Vidéos
    loadErrorVideo: "Erreur lors du chargement de la vidéo",
    loadErrorVideos: "Erreur lors du chargement des vidéos {status}.",
    deleteErrorVideo:
      "Une erreur est survenue lors de la suppression de la vidéo",
    dupErrorVideo: "Une erreur est survenue lors de la duplication de la vidéo",

    // Images
    chooseImage: "Veuillez choisir une image",
    imageSendError: "Échec de l’envoi de l’image",
    imageDeleteError: "Échec de la suppression de l’image",

    // Pages & sections
    loadPage: "Erreur lors du chargement de la page",
    getBlocks: "Erreur lors de la récupération des blocs de mise en page.",
    unableToSection: "Impossible de charger cette section de l'application",
    unableToTheme: "Impossible de charger ce thème.",

    // Chaînes & thèmes
    getChannels:
      "Erreur lors de la récupération {count, plural, one {de la chaîne} other {des chaînes}}",
    getThemeError:
      "Erreur lors de la récupération {count, plural, one {du thème} other {des thèmes}}",

    // Mots-clés
    tagsLoadError: "Erreur lors du chargement des mots-clés : {error}",
    noKeywords: "Aucun mot-clé disponible pour le moment.",

    // Sous-titres
    addSubtitleError: "Erreur lors de l'ajout du sous-titre",
    deleteSubtitleError: "Erreur lors de la suppression du sous-titre",

    // Playlists
    loadPlaylist:
      "Erreur de chargement {count, plural, one {de la playlist} other {des playlists}}.",
    updatePlaylist: "Erreur lors de la modification de la playlist",
    deletePlaylist: "Erreur lors de la suppression de la playlist",
    addVideoToPlaylist: "Erreur lors de l'ajout de la vidéo à la playlist",
    deleteVideoFromPlaylist:
      "Erreur lors du retrait de la vidéo de la playlist",

    // Favoris
    loadFavorites: "Erreur lors du chargement des favoris",
    addFavorite: "Erreur lors de l'ajout de la vidéo aux favoris",
    deleteFavorite: "Erreur lors de la suppression de la vidéo des favoris",

    // Commentaires & votes
    loadComments: "Erreur lors du chargement des commentaires",
    addComment: "Erreur lors de l'ajout du commentaire",
    deleteComment: "Erreur lors de la suppression du commentaire",
    addVote: "Erreur lors de l'ajout du vote",

    // Chapitres
    loadChapters: "Erreur lors du chargement des chapitres",
    addChapter: "Erreur lors de l'ajout du chapitre",
    deleteChapter: "Erreur lors de la suppression du chapitre",
  },
  pending: {
    sending: "Envoi en cours…",
    deleting: "Suppression en cours…",
    updating: "Mise à jour en cours…",
    loading: "Chargement en cours…",
    encoding: "Encodage en cours…",
    processing: "Traitement en cours…",
    saving: "Enregistrement en cours…",
    publishing: "Publication en cours…",
  },
  providers: {
    // Hooks de contexte
    auth: "useAuth doit être utilise dans AuthProvider.",
    sidebar: "useSidebar doit être utilise dans SidebarProvider.",
    playlistCreation:
      "usePlaylistCreationContext doit être utilisé dans PlaylistCreationProvider.",
    cunninghamTheme:
      "useCunninghamTheme doit être utilisé dans CunninghamStyleProvider.",

    // Erreurs
    getChannels:
      "Erreur lors de la récupération {count, plural, one {de la chaîne} other {des chaînes}}",
  },
  a11y: {
    // Logos
    institutionLogo: "Logo de l’établissement",
    homeLogo: "Logo Esup-Pod, retour à l’accueil",
    facebookLogo: "Logo Facebook",
    xLogo: "Logo X",
    linkedinLogo: "Logo LinkedIn",
    blueskyLogo: "Logo Bluesky",
    mastodonLogo: "Logo Mastodon",

    // Bannières, logos & vignettes
    channelBanner: "Bannière de la chaîne {title}",
    channelLogo: "Logo de la chaîne {title}",
    themeBanner: "Bannière du thème {title}",
    videoThumbnail: "Vignette de la vidéo {title}",
    collectionThumbnail: "Vignette de la collection {title}",
    playlistThumbnail: "Vignette de la playlist {title}",
    thumbnail: "Vignette",
    preview: "Aperçu",
    watermark: "Filigrane",

    // Photo de profil
    profilePreview: "Aperçu de la photo de profil",
    currentProfilePicture: "Photo de profil actuelle",
    changeProfilePicture: "Changer mon image de profil",
    deleteProfilePicture: "Supprimer la photo actuelle",
    newProfilePictureSuccess: "Image de profil mise à jour avec succès",
    deleteProfilePictureSuccess: "Image de profil supprimée avec succès",
    noProfilePicture: "Vous n’avez pas encore de photo de profil.",
    chooseImage: "Veuillez sélectionner une image",

    // Import de vidéo
    importVideo: "Importer une vidéo",
    chooseFile: "Veuillez sélectionner un fichier vidéo",
    chooseVideo: "Sélectionner cette vidéo",
    chooseVideoOrAudioFile: "Choisissez un fichier audio ou vidéo",
    supportedFormats: "Formats supportés : ",
    fileSizeLimit:
      "La taille du fichier doit être <bold>inférieure à {maxSize} Go.</bold>",
    uploadTimeInfo:
      "Le temps d’envoi dépend de la taille de votre fichier et de votre vitesse de téléchargement.",
    uploadWarning:
      "Pendant l’envoi, ne fermez pas votre navigateur avant d’avoir reçu un message de succès ou d’échec.",
    videoProcessingMessage:
      "Votre vidéo est en cours de traitement. Ne fermez pas la page…",
    skipImportCreateEmpty: "Passer l’importation (Créer une fiche vide)",
    createEmptyRecord: "Créer une fiche vide",
    emptyRecordWarning:
      "Vous vous apprêtez à créer une fiche vidéo sans fichier média source. Vous pourrez ajouter la vidéo source ultérieurement depuis l’étape <b>« Importation »</b> de la page d’édition.",
    clearDescriptiveTitle: "Saisissez un titre clair et descriptif.",

    // Conditions d’utilisation & propriété intellectuelle
    termsOfUse: "Conditions d’utilisation",
    acceptTermsRequired: "Veuillez accepter les conditions d’utilisation.",
    intellectualPropertyWarning:
      "Attention ! Assurez-vous de respecter le code de la propriété intellectuelle avant de publier une vidéo :",
    intellectualPropertyAcknowledgement:
      "J'atteste de respecter le code de la propriété intellectuelle en publiant ma vidéo.",
    publicationAuthorizations:
      "Je confirme que je dispose des autorisations nécessaires signées par les parties concernées par la publication de ce média, en ce compris le consentement relatif au droit à l’image et au traitement des données personnelles. Je certifie que l’ensemble des personnes concernées ont bénéficié d’une information complète relative au traitement de leurs données personnelles, conformément aux dispositions des articles 13 et 14 du RGPD.",

    // Contrôles & menus
    collectionsDisplayMode: "Mode d’affichage des collections",
    videosDisplayMode: "Mode d’affichage des vidéos",
    videoActions: "Actions vidéo",
  },

  // === Données de référence ===
  languages: {
    fr: "Français",
    en: "English",
    es: "Español",
  },
  cursus: {
    "0": "Autre",
    L1: "Licence 1",
    L2: "Licence 2",
    L3: "Licence 3",
    M1: "Master 1",
    M2: "Master 2",
    D: "Doctorat",
  },
  type: {
    cours: "Cours",
    conference: "Conférence",
    tutoriel: "Tutoriel",
    colloque: "Colloque",
    seminaire: "Séminaire",
    interview: "Interview",
    autre: "Autre",
  },
  discipline: {
    informatique: "Informatique",
    droit: "Droit",
    medecine: "Médecine",
    sciences: "Sciences",
    histoire: "Histoire",
    langues: "Langues",
  },

  // === Mise en page ===
  navbar: {
    searchPlaceholder: "Rechercher…",
    addVideo: "Ajouter une vidéo",
    settings: "Affichage et accessibilité",
    login: "Connexion",
    myProfileImage: "Modifier mon image de profil",
    administration: "Administration",
    openProfileMenu: "Ouvrir le menu de profil",
    closeSearch: "Fermer la recherche",
  },
  sidebar: {
    // Navigation
    mainMenu: "Menu principal",
    closeMenu: "Fermer le menu",
    browseVideos: "Consulter les vidéos",
    mySpace: "Mon espace",
    dashboard: "Mon tableau de bord",
    myFavorites: "Mes vidéos favorites",
    favorites: "Vidéos favorites",
    myPlaylists: "Mes listes de lecture",
    playlists: "Lecture de la liste",
    videoBranding: "Habillages & Filigranes",

    // Accueil & lecture
    welcome: "Bienvenue",
    welcomeUser: "Bienvenue {name} !",
    nowPlaying: "Lecture en cours",
  },
  footer: {
    legalNotice: "Mentions légales",
    accessibilityPartially: "Accessibilité : Partiellement conforme",
    siteMap: "Plan du site",
    esupProject: "Projet Esup-Pod",
    esupPortal: "Esup portail",
    videoPlatform: "Plateforme vidéo",
  },

  // === Pages & fonctionnalités ===
  home: {
    welcomeSubtitle: "Bienvenue sur votre plateforme POD !",
    welcomeIntro:
      "La vidéo est un média de choix quand il s’agit de communiquer, d’enseigner et d’apprendre. Voici quelques usages qui pourraient vous intéresser.",
    howToTitle: "Comment faire ?",
    howToDescPrefix:
      "Vous avez envie de mettre en ligne vos propres contenus ? Ce ",
    quickGuideLink: "guide de prise en main",
    howToDescSuffix:
      " rapide vous présentera les fonctionnalités de base de Pod.",
    btnUsePod: "Utiliser pod",
    btnHowTo: "Comment faire",
    btnCopyright: "Du droit d’auteur",
    latestVideos: "Dernières vidéos publiées",
    btnAllVideos: "Afficher toutes les vidéos",
    videoServiceError: "Le service vidéo est momentanément indisponible",
    noRecentVideos: "Aucune vidéo publique récente",
  },
  auth: {
    loginTitle: "Connexion à mon profil POD",
    loginRequired: "Vous devez être connecté pour accéder à cette page.",
    username: "Nom d’utilisateur",
    usernameRequired: "Le nom d’utilisateur est obligatoire",
    password: "Mot de passe",
    passwordRequired: "Le mot de passe est obligatoire",
    submitLogin: "Connexion",
    unknownUser: "Utilisateur inconnu",
    passwordMinLength:
      "Le mot de passe doit contenir au moins {min} caractères.",
    loginSuccess: "Vous êtes désormais connecté.",
    logoutSuccess: "Vous êtes désormais déconnecté.",
  },
  webtv: {
    webtv: "WebTV",
    liveTitle: "Direct",
    noLive: "Aucun direct en cours",
    loadingContent: "Chargement des contenus WebTV…",
    noContent: "Aucun contenu disponible",
    climateActu: "Actu : Climat",
    seriesEmission: "Séries / Émissions",
    actuCollections: "Collections d’actualités",
    latestCollections: "Dernières collections",
    mostViewed: "Vidéos les plus vues",
    searchContent: "Rechercher des contenus",
  },
  blocks: {
    // Bloc Collections
    collectionTitle: "Bloc général de collections",
    collectionDescription:
      "Affiche une sélection paramétrable de collections (chaînes, thèmes, playlists).",
    collectionTypeLabel: "Type de collection à afficher",
    collectionTypeChannels: "Chaînes (Channels)",
    collectionTypeThemes: "Thèmes (Catégories)",
    collectionTypeAll: "Toutes les collections",
    collectionIdsLabel:
      "Identifiants ou Slugs de collections à afficher (séparés par virgule)",
    collectionSortCreated: "Date de création (Récents)",

    // Bloc Texte personnalisé
    customTextDescription: "Affiche un paragraphe ou contenu personnalisé.",
    customTextContentLabel: "Contenu texte ou HTML",

    // Bloc Directs
    liveDescription:
      "Affiche la liste des directs en cours avec un indicateur actif rouge.",
    liveSortLabel: "Ordre de tri des directs",
    liveSortStartUpcoming: "Date de début (Prochainement)",
    liveSortStartRecent: "Date de début (Récents)",
    liveSortPopularity: "Popularité (Nombre de spectateurs)",

    // Bloc Grille de vidéos
    videoGridTitle: "Bloc Grille de Vidéos",
    videoGridDescription:
      "Affiche une rangée ou grille de cartes vidéos paramétrable.",
    videoGridSortLabel: "Ordre de tri des vidéos",
    videoGridSortLatest: "Dernières ajoutées",
  },
  preferences: {
    settingsHeader: "Paramètres",
    title: "Affichage et accessibilité",
    dressing: "Filigranes",
    languageSectionTitle: "Langue de l’application",
    languageSelectLabel: "Choisissez la langue de l’interface :",
    themeSectionTitle: "Thème visuel",
    darkModeLabel: "Mode sombre",
    lightModeLabel: "Mode clair",
  },
  filters: {
    // Recherche
    searchPlaceholder: "Rechercher une vidéo…",
    search: "Recherche",
    advancedFilters: "Filtres avancés",
    showResults: "Afficher",
    clearFilters: "Effacer les filtres",

    // Critères
    author: "Auteur",
    types: "Types",
    cursus: "Niveau d’études",
    keywords: "Mots-clés",

    // Tri
    sort: "Tri",
    newest: "Plus récentes",
    oldest: "Plus anciennes",
    titleAZ: "Titre A-Z",
    titleZA: "Titre Z-A",

    // Dates
    creationDate: "Date de création",
    activeCreationDate: "Date (filtre actif)",
    selectPeriod: "Sélectionnez une période",
    createdAfter: "Créé après",
    createdBefore: "Créé avant",
  },
  bulk: {
    // Général
    title: "Modifier en lot",
    checkVideosPrompt: "Cocher des vidéos pour activer les actions",
    chooseAction: "Choisir une action…",
    deselectAll: "Tout désélectionner",
    modalTitle: "Modifier en lot : {action}",
    newValueFor: "Nouvelle valeur pour :",
    affectedVideos: "Vidéos concernées ({count})",
    confirmEdit: "Confirmer la modification",
    unavailableForSelection: "Non disponible pour cette sélection",
    encodingInProgressTooltip:
      "Certaines vidéos sont en cours d’encodage. Les actions nécessitant l’encodage complet sont désactivées.",
    encodingWarning:
      "Attention : certaines vidéos sont actuellement en cours d’encodage.",
    errorBadge: "Erreur",

    // Modification
    editGroup: "MODIFIER LES VIDÉOS",
    changeType: "Changer le type",
    changeChannel: "Changer la chaîne",
    editDescription: "Modifier la description",
    changeLicense: "Changer la licence",
    setEventDate: "Définir la date de l’événement",
    addReplaceKeywords: "Ajouter / Remplacer des mots-clés",
    changeDiscipline: "Changer la discipline",
    changeCursus: "Changer le niveau d’études",
    keywordsHelper:
      "Séparez les mots-clés par des virgules. Ils remplaceront les mots-clés existants.",

    // Visibilité & options
    publishUnpublish: "Publier / Dépublier",
    restrictAuth: "Restreindre aux membres connectés",
    allowDownloading: "Autoriser / Interdire le téléchargement",
    disableComments: "Activer / Désactiver les commentaires",
    scheduleDeletion: "Programmer une suppression automatique",
    scheduleDeletionNotice:
      "La vidéo sera automatiquement supprimée à la date choisie.",

    // Suppression
    dangerZone: "ZONE DE DANGER",
    deleteSelected: "Supprimer les vidéos sélectionnées",
    confirmDelete: "Confirmer la suppression",
    deleteWarning:
      "Vous êtes sur le point de supprimer définitivement les vidéos sélectionnées.",
    deletePermanently: "Supprimer définitivement",

    // Licences
    licenseCopyright: "Copyright / Droits réservés",
    licenseCcByNcSa:
      "CC BY-NC-SA — Partage à l’identique, pas d’usage commercial",
    licenseCcBySa: "CC BY-SA — Partage à l’identique",

    // Options de valeur
    optionPublic: "Publique — visible par tous",
    optionPrivate: "Privée — brouillon, non visible",
    optionAuthYes: "Oui — connexion requise pour accéder",
    optionAuthNo: "Non — accessible sans connexion",
    optionDownloadYes: "Oui — autoriser le téléchargement",
    optionDownloadNo: "Non — désactiver le téléchargement",
    optionCommentsOn: "Activer les commentaires",
    optionCommentsOff: "Désactiver les commentaires",

    // Retours
    deleteSuccess:
      "{count, plural, one {# vidéo supprimée} other {# vidéos supprimées}} avec succès.",
    updateSuccess:
      "{count, plural, one {# vidéo mise à jour} other {# vidéos mises à jour}} avec succès.",
    actionError:
      "Une erreur est survenue lors de l’exécution de l’action groupée.",
    errorPublishNotEncoded:
      "Impossible : une ou plusieurs vidéos sélectionnées ne sont pas encore encodées. Attendez la fin de l’encodage pour modifier le statut de publication.",
    errorRestrictNotEncoded:
      "Impossible : la restriction d’accès ne peut être définie que sur des vidéos entièrement encodées.",
    errorDownloadNotEncoded:
      "Impossible : le téléchargement ne peut être configuré que sur des vidéos encodées.",
    errorCommentsNotEncoded:
      "Impossible : les paramètres de commentaires ne s’appliquent qu’aux vidéos encodées.",
  },
  table: {
    // Colonnes
    title: "Titre",
    duration: "Durée",
    dateAdded: "Date d’ajout",
    status: "Statut",

    // Visibilité
    public: "Public",
    restricted: "Restreint",
    password: "Mot de passe",
    privateVideo: "Vidéo privée",
    passwordProtectedVideo: "Vidéo protégée par mot de passe",

    // États d’encodage
    pendingEncoding: "Vidéo en attente d’encodage",
    encodingCompleted: "Encodage terminé",
    encodingError: "Erreur d’encodage",

    // Résultats
    noVideosFound: "Aucune vidéo trouvée.",
  },
  videoAction: {
    edit: "Éditer la vidéo",
    duplicate: "Dupliquer",
    duplicating: "Duplication…",
    delete: "Supprimer la vidéo",
    deleteConfirm:
      "Êtes-vous sûr·e de vouloir supprimer la vidéo « {title} » ?",
  },
  videoPlayer: {
    unableToLoad: "Impossible de charger la vidéo.",
    unableToDownload: "Impossible de télécharger la vidéo.",
    encodingInProgress: "Vidéo en cours d’encodage…",
    retry: "Réessayer",
  },
  videoDressing: {
    // Habillage
    dressing: "Habillage de la vidéo",
    title: "Titre de l'habillage",
    unique: "Nom unique permettant d'identifier l'habillage",
    loading: "Chargement de l'habillage…",
    noDressing: "Aucun habillage disponible pour le moment.",
    noConfig: "Aucun élément configuré",

    // Éléments
    watermark: "Filigrane",
    opacity: "Opacité",
    start: "Amorce de début",
    end: "Amorce de fin",
    addWatermark:
      "Pour ajouter un filigrane ou des amorces, créez un nouvel habillage puis éditez-le.",

    // Actions & retours
    create: "Créer un nouvel habillage",
    creation: "Création…",
    successCreate: "Habillage appliqué avec succès",
    errorUpdate: "Erreur lors de la mise à jour de l'habillage",
  },
  videoPage: {
    // Actions
    back: "Retour",
    share: "Partager",
    playlist: "Playlist",
    favorite: "Favori",
    report: "Signaler",
    editVideo: "Éditer la vidéo",
    addToPlaylist: "Ajouter à une liste de lecture",
    copyLink: "Copier le lien",
    linkCopied: "Lien copié !",
    seeMore: "Voir plus",
    seeLess: "Voir moins",
    download: "Télécharger",
    chooseQuality: "Choisir la qualité :",
    shareOn: "Partager sur {network}",

    // Informations
    about: "À propos",
    type: "Type",
    channel: "Chaîne",
    channelWithId: "Chaîne {id}",
    creator: "Créateur",
    mainLanguage: "Langue principale",
    keywords: "Mots clés",
    keywordsloading: "Chargement des mots-clés…",
    discipline: "Discipline(s)",
    contributors: "Intervenants",
    license: "Licence",
    cursus: "Cursus",
    eventDate: "Date de l’événement",
    resources: "Ressources",
    updatedAt: "Mis à jour le :",
    views: "vues",
    none: "Aucune",

    // États & messages
    notFound: "Vidéo introuvable.",
    noPlaylistsAvailable: "Aucune playlist disponible",
    protectedByPassword: "Cette vidéo est protégée par un mot de passe.",
    unlock: "Déverrouiller la vidéo",
    unlocking: "Déverrouillage…",
    videoAddedToPlaylist: "Vidéo ajoutée à la playlist « {title} ».",
    videoRemovedFromPlaylist: "Vidéo retirée de la playlist « {title} ».",
    videoAddedToFavorites: "Vidéo ajoutée à vos favoris.",
    videoRemovedFromFavorites: "Vidéo retirée de vos favoris.",
  },
  contributors: {
    // Formulaire
    defaultRole: "Réalisateur",
    searchLabel: "Rechercher un contributeur…",
    roleLabel: "Rôle",
    functionLabel: "Fonction / Titre",

    // Messages
    addError:
      "Impossible d’ajouter ce contributeur (peut-être déjà ajouté avec ce rôle ?)",
    noContributors: "Aucun contributeur associé.",
  },
  documents: {
    // Formulaire
    addTitle: "Ajouter un document",
    titleLabel: "Titre du document",
    dropzone: "Glissez et déposez un fichier ici",
    selectedFile: "Fichier sélectionné :",
    privateLabel:
      "Document privé (visible uniquement par le propriétaire et les co-propriétaires)",
    addBtn: "Ajouter le document",

    // Liste
    loading: "Chargement des documents…",
    addedOn: "{title} - Ajouté le {date}",
    private: "Privé",
    noDocuments: "Aucun document n’est rattaché à cette vidéo pour le moment.",

    // Messages
    fillTitleAndFile:
      "Veuillez renseigner un titre et sélectionner un fichier.",
    uploadError: "Erreur lors de l’upload du document.",
    deleteConfirm: "Voulez-vous vraiment supprimer ce document ?",
    deleteError: "Erreur lors de la suppression.",
    loadError: "Impossible de charger les documents.",
  },
  chapters: {
    // Ajout
    addTitle: "Ajouter un chapitre",
    titleLabel: "Titre du chapitre",
    titlePlaceholder: "Ex : Introduction, Démo, Conclusion…",
    captureMoment: "Capturer ce moment",
    captureTooltip: "Copie le temps actuel dans le champ Temps",

    // Liste
    noChapters:
      "Aucun chapitre. Lisez la vidéo et cliquez sur <bold>Capturer ce moment</bold> pour ajouter une entrée.",
    goToMoment: "Cliquer pour aller à ce moment",
    deleteChapter: "Supprimer ce chapitre",

    // Messages
    titleRequired: "Veuillez saisir un titre.",
    timestampTooLong: "Le timestamp dépasse la durée de la vidéo ({duration}).",
    playerUnavailable:
      "Le lecteur sera disponible une fois l’encodage terminé. Vous pouvez saisir les timestamps manuellement.",
  },
  comments: {
    // Liste
    title: "Commentaires",
    count: "{count} commentaire",
    countPlural: "{count} commentaires",
    noCommentsYet: "Aucun commentaire pour le moment.",
    disabled: "Les commentaires sont désactivés pour cette vidéo.",
    loginToComment: "Connectez-vous pour ajouter un commentaire.",

    // Saisie
    addPlaceholder: "Ajouter un commentaire",
    submit: "Commenter",
    submitting: "Publication…",
    yourReply: "Votre réponse",

    // Actions
    reply: "Répondre",
    delete: "Supprimer",
    voteForComment: "Voter pour ce commentaire",
    liked: "Vous aimez ce commentaire",

    // Réponses
    hideReplies: "Masquer les réponses",
    showReplies: "{count} réponse",
    showRepliesPlural: "{count} réponses",
  },
  socialNetworks: {
    unableToLoad: "Impossible de charger les réseaux sociaux.",
    loading: "Chargement des réseaux sociaux…",
    errorSaveSocial:
      "Une erreur est survenue lors de l’enregistrement du réseau social.",
    saved: "Réseau social enregistré avec succès.",
    authorizedShare: "Réseau social autorisé pour le partage.",
    choice: "Sélectionnez un réseau social",
  },
  videoEdit: {
    // En-tête & actions
    pageTitle: "Éditer la vidéo « {title} »",
    pageTitleDefault: "Éditer la vidéo",
    duplicate: "Dupliquer",
    save: "Enregistrer",
    quit: "Quitter la page",
    previous: "Précédent",
    next: "Suivant",
    requiredFieldsPrompt: "Les champs marqués d’un * sont obligatoires.",

    // Étapes
    stepImport: "Importation",
    stepDetails: "Détails",
    stepElements: "Éléments Vidéo",
    stepVisibility: "Visibilité",

    // Stepper & badges
    noSourceFileBadge: "Information : Fichier source non importé",
    incompleteBadge: "Incomplet",
    completedBadge: "Complété",
    stepInProgress: "Étape en cours",
    mediaAttached: "Source disponible",
    titleFilled: "Titre renseigné",
    titleRequired: "Titre obligatoire",
    subtitlesAndDocs: "Sous-titres & enrichissements",
    draftOrPublic: "Brouillon, restreint ou public",

    // Étape Détails
    titleLabel: "Titre",
    titlePlaceholder: "Titre de la vidéo",
    titleHelper:
      "Un titre aussi court et précis que possible, reflétant le sujet principal / le contexte de ce contenu.",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Description de la vidéo en Français",
    descriptionHelper:
      "Décrivez votre contenu, ajoutez toutes les informations nécessaires, et mettez en forme le résultat.",
    mainLanguageLabel: "Langue principale",
    mainLanguageHelper: "La langue principalement utilisée dans ce contenu.",
    thumbnailLabel: "Vignettes",
    uploadThumbnailBtn: "+ Importer une vignette",
    thumbnailDimensionsHint: "JPG ou PNG · Recommandé : 1280 × 720 px",
    thumbnailCopyrightHelper:
      "La vignette doit respecter les règles de la communauté. Assurez-vous que l’image a le bon droit d’auteur.",
    changeBtn: "Changer",
    deleteBtn: "Supprimer",
    ownerLabel: "Propriétaire",
    ownerHelper:
      "Un super‑utilisateur peut changer le propriétaire d’une vidéo.",
    coOwnersLabel: "Propriétaires additionnels",
    coOwnersHelper:
      "Les propriétaires additionnels auront les mêmes droits que vous, sauf qu’ils ne peuvent pas supprimer ce contenu.",
    licenseLabel: "Licence",
    licenseHelper: "Droits d’utilisation de votre contenu.",
    channelLabel: "Chaîne",
    channelHelper:
      "Vous avez les permissions pour associer cette vidéo à une chaîne.",
    noneOption: "Aucune",
    themesLabel: "Thèmes",
    themesHelper:
      "Vous pouvez sélectionner un ou plusieurs thèmes liés à la chaîne.",
    dateToDeleteLabel: "Date de suppression",
    dateToDeleteHelper: "Date planifiée de suppression de la vidéo.",
    dateOfEventLabel: "Date de l’événement",
    dateOfEventHelper: "Date de l’événement lié à cette vidéo.",
    publicationDateLabel: "Date et heure de publication planifiée",
    publicationDateHelper:
      "Définissez une date/heure dans le futur à laquelle la vidéo sera rendue publique.",
    statusLabel: "Statut de la vidéo",
    themesPlaceholder: "Sélectionnez un ou plusieurs thèmes",

    // Étape Importation
    importHeaderTitle: "Ajouter un fichier vidéo",
    importHeaderSub: "Gérez la vidéo source et l’encodage de votre média.",
    noSourceWarningTitle: "Fiche vide sans source vidéo",
    noSourceWarningDesc:
      "Cette vidéo n’a pas encore de fichier source associé. Vous pouvez compléter les métadonnées (titre, description, etc.), mais vous devez ajouter une vidéo ci-dessous avant de pouvoir la publier.",
    publicNoSourceAlert:
      "Vous avez sélectionné le statut Public mais aucun fichier source n’est importé. Importation obligatoire pour publication publique.",
    selectVideoFile:
      "Sélectionnez un fichier vidéo depuis votre ordinateur. Un nouveau processus d’encodage sera automatiquement lancé.",
    addVideoFileBtn: "Ajouter la vidéo",

    // Étape Éléments vidéo
    elementsHeaderSub:
      "Enrichissez votre vidéo avec des sous-titres, documents et contributeurs.",
    subtitlesTitle: "Sous-titres manuels",
    subtitlesDesc:
      "Ajoutez des fichiers de sous-titres (.vtt, .srt) dans une ou plusieurs langues.",
    documentsTitle: "Documents joints",
    documentsDesc:
      "Associez des fichiers PDF, diaporamas ou autres documents téléchargeables.",
    contributorsTitle: "Contributeurs & Intervenants",
    contributorsDesc:
      "Ajoutez des auteurs, réalisateurs ou intervenants à votre vidéo.",
    chaptersTitle: "Chapitrer la vidéo",
    chaptersDesc:
      "Découpez votre vidéo en chapitres avec des marqueurs temporels.",
    dressingTitle: "Habiller la vidéo",
    dressingDesc:
      "Appliquez un habillage (filigrane, amorce d’ouverture / fermeture).",
    position: "Position du filigrane",
    opacity: "Opacité du filigrane",
    trimTitle: "Découper la vidéo",
    trimDesc:
      "Délimitez un point d’entrée et de sortie pour raccourcir la vidéo.",
    chaptersDialogTitle: "Chapitres de la vidéo",

    // Étape Visibilité
    visibilityHeaderSub:
      "Choisissez quand publier votre vidéo et qui peut la voir.",
    restrictionsHeader: "Restrictions",
    restrictionsSub:
      "Choisissez de rendre votre vidéo publique, non répertoriée ou privée.",
    draftPrivateTitle: "Brouillon / Privé",
    draftPrivateDesc:
      "En mode « Brouillon / Privé », le contenu n’apparaît nulle part et personne d’autre que vous ne peut le voir.",
    restrictedTitle: "Accès restreint",
    restrictedDesc:
      "En mode « Accès restreint », vous pouvez choisir les restrictions pour la vidéo.",
    publicTitle: "Public",
    publicDesc:
      "Dans le mode « Public », le contenu est visible par tout le monde.",
    noSourceDraftNotice:
      "Sans fichier source, seuls les modes Brouillon / Privé sont autorisés. Les modes Accès restreint et Public sont désactivés.",
    restrictionOptions: "Options de restriction :",
    authRequiredLabel: "Authentification requise",
    authRequiredHelper: "Limiter l’accès aux personnes authentifiées.",
    authUserOnly: "Réservé aux utilisateurs authentifiés.",
    passwordRequiredLabel: "Mot de passe requis",
    passwordLabel: "Mot de passe de la vidéo",
    diffusionTitle: "Configuration de la Diffusion",
    allowDownloadLabel: "Autoriser le téléchargement",
    allowDownloadHelper: "Autoriser le téléchargement de votre vidéo.",
    disableCommentsLabel: "Désactiver les commentaires",
    disableCommentsHelper:
      "Désactiver l’ajout de commentaires sous votre vidéo.",
    advancedOptionsTitle: "Options avancées",
    is360Label: "Il s’agit d’une vidéo 360°",
    is360Helper: "Activer le lecteur 360° pour cette vidéo.",
    passwordKeepHelper:
      "Laissez vide pour ne pas modifier le mot de passe existant.",

    // Messages & validation
    fillRequiredFields:
      "Veuillez remplir le(s) champ(s) obligatoire(s) avant de continuer : {fields}.",
    fillRequiredFieldsStep:
      "Veuillez remplir le(s) champ(s) obligatoire(s) de l’étape « {step} » avant de continuer : {fields}.",
    restrictedNeedsOption:
      "Pour un statut restreint, choisissez au moins une restriction.",
    noPermission: "Vous n’avez pas les droits pour modifier cette vidéo.",
    loginRequired: "Vous devez être connecté·e pour modifier cette vidéo.",
    updateSuccess: "Vidéo mise à jour avec succès !",

    // Sous-titres
    addSubtitle: "Ajouter un sous-titre",
    noSubtitles: "Aucun sous-titre ajouté.",
    subtitleFileHint: "Sélectionner un fichier .vtt ou .srt",
    addSubtitleBtn: "Ajouter le sous-titre",
    cannotAddSubtitle: "Impossible d’ajouter un sous-titre à cette vidéo.",
    selectSubtitleFile: "Veuillez sélectionner un fichier de sous-titre.",

    // Changement de source
    changeSourceTitle: "Changer la source vidéo",
    changeSourceDesc:
      "Remplacez le fichier source de cette vidéo. Un nouveau processus d’encodage sera lancé.",
    selectNewVideoFile: "Sélectionner un nouveau fichier vidéo",
    replaceSourceBtn: "Remplacer la source",
    changeSourceError: "Erreur lors du changement de source.",
    sourceUpdated: "Source vidéo mise à jour. Re-encodage lancé.",
  },
  favorites: {
    title: "Mes vidéos favorites",
    startPlaylist: "Lancer la liste de lecture",
    noFavorites: "Aucune vidéo favorite pour le moment.",
    noMatchingFilters: "Aucune vidéo ne correspond à vos filtres.",
    favoriteUpdateError:
      "Une erreur est survenue lors de la mise à jour des favoris.",
  },
  playlists: {
    // Titres & libellés
    myTitle: "Mes listes de lecture",
    playlists: "Listes de lecture",
    playlist: "Liste de lecture",
    nowPlaying: "Lecture en cours",
    notFound: "Playlist introuvable.",
    unableToLoad: "Impossible de charger la playlist",
    backToMyPlaylists: "Retour à mes listes de lecture",

    // Création & édition
    addPlaylist: "Ajouter une liste de lecture",
    addThePlaylist: "Ajouter la liste de lecture",
    editPlaylist: "Éditer la liste de lecture",
    seePlaylist: "Voir la liste de lecture",
    playlistCreated: "La liste de lecture a été créée avec succès.",
    playlistUpdated: "Liste de lecture mise à jour avec succès !",
    noPermissionToEditPlaylist:
      "Vous n’avez pas les droits pour modifier cette liste de lecture.",

    // Suppression
    delete: "Supprimer la liste de lecture",
    deleteConfirm:
      "Êtes-vous sûr de vouloir supprimer cette liste de lecture ?",
    deleteSuccess: "La liste de lecture a été supprimée avec succès.",

    // Listes vides
    noVideos: "Aucune vidéo dans cette playlist",
    noPlaylists: "Vous n’avez encore aucune liste de lecture.",
    noMatchingFilters: "Aucune liste de lecture ne correspond à vos filtres.",
    noPublicPlaylists: "Aucune liste de lecture disponible pour le moment.",

    // Erreurs
    creationError:
      "Une erreur est survenue lors de la création de la liste de lecture.",
    deleteError:
      "Une erreur est survenue lors de la suppression de la liste de lecture.",
    playlistUpdateError:
      "Une erreur est survenue lors de la mise à jour de la playlist.",

    // Visibilité
    passwordProtected: "Playlist protégée par mot de passe",
    private: "Playlist privée",

    // Formulaire
    titleHelper: "Donnez un titre court et explicite à votre liste de lecture.",
    descriptionHelper:
      "Décrivez le contenu et/ou le contexte de votre liste de lecture.",
    accessRestrictions: "Restrictions d’accès",
    protectWithPassword: "Protéger ma liste de lecture par un mot de passe",
    addPassword: "Ajouter un mot de passe",
    passwordLabel: "Mot de passe de la liste de lecture",
    passwordHelper:
      "Ajouter un mot de passe pour accéder à la liste de lecture.",
    visibleToAll:
      "Votre liste de lecture sera visible par tous les utilisateurs.",
    visibleToOwner: "Votre liste de lecture sera visible uniquement par vous.",
    defaultSort: "Tri par défaut",
    defaultSortLabel: "Tri de l’affichage des vidéos par défaut.",
    defaultSortHelper: "Choisissez l’ordre d’affichage des vidéos.",
    publicPlaylist: "Liste de lecture publique",
  },
  channels: {
    // Général
    title: "Chaînes",
    content: "Contenus de la chaîne",
    unclassified: "Vidéos non classées",

    // Listes vides
    noChannels: "Aucune chaîne disponible pour le moment.",
    noMatchingFilters: "Aucune chaîne ne correspond à vos filtres.",
    noContent: "Cette chaîne n’a aucune vidéo ou thème associé.",
    noTheme: "Cette chaîne n’a aucun thème associé.",
    noThemes: "Aucun thème ne correspond à vos critères de recherche.",
    noVideos: "Cette chaîne n’a aucune vidéo associé.",
  },
  dressingPage: {
    title: "Habillages & Filigranes Vidéo",
    pageDescription:
      "Gérez vos filigranes (watermarks) et éléments visuels pour les incruster directement dans vos vidéos.",
    myWatermarks: "Mes Filigranes",
    addWatermark: "Ajouter un filigrane",
    uploading: "Envoi en cours…",
    noWatermarks: "Vous n’avez pas encore envoyé de filigrane.",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce filigrane ?",
    loadError: "Erreur lors du chargement des filigranes.",
    uploadError: "Erreur lors de l'upload de l'image",
  },

  // === Métadonnées des pages ===
  titles: {
    // Titres de pages
    platform: "Plateforme vidéo Esup-Pod",
    login: "Connexion | Esup-Pod",
    video: "Vidéo | Esup-Pod",
    allVideos: "Toutes les vidéos - Esup-Pod",
  },
  descriptions: {
    dashboard:
      "Gérez vos vidéos et paramètres sur votre tableau de bord Esup-Pod.",
    login:
      "Connectez-vous pour accéder à vos vidéos et votre espace personnel sur Esup-Pod.",
    playlists:
      "Découvrez et gérez les listes de lecture publiques de la plateforme Esup-Pod.",
    videos: "Découvrez toutes les vidéos publiques de la plateforme Esup-Pod.",
    watchVideo: "Regarder la vidéo sur Esup-Pod",
  },
};

export type TranslationKeys = typeof fr;

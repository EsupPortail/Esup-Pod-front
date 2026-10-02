import type { TranslationKeys } from "./fr";

export const es: TranslationKeys = {
  // === Commun ===
  common: {
    // Actions
    close: "Cerrar",
    save: "Guardar",
    cancel: "Cancelar",
    back: "Volver",
    update: "Actualizar",
    delete: "Eliminar",
    edit: "Editar",
    add: "Añadir",
    addVideo: "Añadir un vídeo",
    search: "Buscar",
    selectAll: "Seleccionar todo",
    stayOnPage: "Permanecer en la página",
    leaveWithoutSaving: "Salir sin guardar",

    // Statut & connexion
    login: "Iniciar sesión",
    logout: "Cerrar sesión",
    connected: "Conectado",
    disconnected: "Desconectado",
    loading: "Cargando…",
    error: "Se ha producido un error",

    // Navigation
    home: "Inicio",
    selectionReturn: "Volver a la selección",
    goToMainContent: "Ir al contenido principal",
    backToHomepage: "Volver a la página de inicio",
    tab: "Panel de control",
    commingSoon: "Funcionalidad próximamente disponible",

    // Entités (singulier / pluriel)
    video: "Vídeo",
    videos: "Vídeos",
    collection: "Colección",
    collections: "Colecciones",
    channel: "Canal",
    channels: "Canales",
    playlist: "Lista de reproducción",
    playlists: "Listas de reproducción",
    theme: "Tema",
    themes: "Temas",
    subtopic: "Subtema",
    subtopics: "Subtemas",
    discipline: "Disciplina",
    disciplines: "Disciplinas",
    series: "Serie / Programa",
    allVideos: "Todos los vídeos",
    direct: "Directo",
    directs: "Emisiones en directo",
    view: "visualización",
    views: "visualizaciones",

    // Affichage, recherche & pagination
    displayMode: "Visualización:",
    viewCards: "Tarjetas",
    viewTable: "Tabla",
    videosFound: "vídeo(s) encontrado(s)",
    found: "{count, plural, one {Encontrado} other {Encontrados}}",
    noResults: "No hay resultados para su búsqueda",
    paginationInfo:
      "Mostrando del {start} al {end} de {count, plural, one {# vídeo{pageInfo}} other {# vídeos{pageInfo}}}",
    paginationPage: " (Página {page} de {pagesCount})",
    opacity: "Opacidad",

    // Métadonnées
    createdBy: "Creado por",
    latestUpdate: "Actualizado el:",
    contributors: "Colaboradores y ponentes",
    addContributorsDesc: "Añada autores, realizadores o ponentes a su vídeo.",
    infos: "Información",
    configBase: "Configuración de la base",

    // Visibilité
    public: "Público",
    private: "Privado",
    passwordProtected:
      "Ha activado la protección mediante contraseña. Introduzca una contraseña.",

    // Validation & confirmations
    titleRequired: "El título es obligatorio",
    descRequired: "La descripción es obligatoria.",
    permanentAction: "Esta acción es permanente.",
    unsavedChangesLeaveConfirmation:
      "Tiene cambios sin guardar. ¿Está seguro de que desea abandonar esta página?",
    unsavedChangesTitle: "Cambios sin guardar",

    // Divers
    recently: "Recientemente",
    default: "Por defecto",
  },
  errors: {
    // Général
    error: "Se ha producido un error",
    update: "Error al actualizar",
    save: "Error al guardar",
    create: "Error al crear",
    loadError: "Error de carga",
    loadConfig: "Error al cargar la configuración",
    loadInfo: "Error al cargar la información",
    notFound: "Página no encontrada",
    notFoundDesc: "La página que busca no existe o ha sido eliminada.",
    serverError: "Error del servidor",
    serverErrorDesc:
      "Se ha producido un error en el servidor. Inténtelo de nuevo más tarde.",
    notConnected: "Usuario no conectado",
    error401: "Acceso no autorizado (401). Inicie sesión.",
    notConfigured:
      "La página solicitada no existe o todavía no ha sido configurada para este establecimiento.",
    formFieldsError:
      "{count, plural, =1 {Corrija el siguiente campo: {fields}.} other {Corrija los siguientes # campos: {fields}.}}",
    savingFormError: "Error al guardar el formulario",
    accessDenied: "No puede acceder a esta página",

    // Vidéos
    loadErrorVideo: "Error al cargar el vídeo",
    loadErrorVideos: "Error al cargar los vídeos {status}.",
    deleteErrorVideo: "Se ha producido un error al eliminar el vídeo",
    dupErrorVideo: "Se ha producido un error al duplicar el vídeo",

    // Images
    chooseImage: "Seleccione una imagen",
    imageSendError: "Error al enviar la imagen",
    imageDeleteError: "Error al eliminar la imagen",

    // Pages & sections
    loadPage: "Error al cargar la página",
    getBlocks: "Error al obtener los bloques de diseño.",
    unableToSection: "No se puede cargar esta sección de la aplicación",
    unableToTheme: "No se puede cargar este tema.",

    // Chaînes & thèmes
    getChannels:
      "Error al obtener {count, plural, one {el canal} other {los canales}}",
    getThemeError:
      "Error al obtener {count, plural, one {el tema} other {los temas}}",

    // Mots-clés
    tagsLoadError: "Error al cargar las palabras clave: {error}",
    noKeywords: "No hay palabras clave disponibles por el momento.",

    // Sous-titres
    addSubtitleError: "Error al añadir el subtítulo",
    deleteSubtitleError: "Error al eliminar el subtítulo",

    // Playlists
    loadPlaylist:
      "Error al cargar {count, plural, one {la lista de reproducción} other {las listas de reproducción}}.",
    updatePlaylist: "Error al actualizar la lista de reproducción",
    deletePlaylist: "Error al eliminar la lista de reproducción",
    addVideoToPlaylist: "Error al añadir el vídeo a la lista de reproducción",
    deleteVideoFromPlaylist:
      "Error al retirar el vídeo de la lista de reproducción",

    // Favoris
    loadFavorites: "Error al cargar los favoritos",
    addFavorite: "Error al añadir el vídeo a los favoritos",
    deleteFavorite: "Error al eliminar el vídeo de los favoritos",

    // Commentaires & votes
    loadComments: "Error al cargar los comentarios",
    addComment: "Error al añadir el comentario",
    deleteComment: "Error al eliminar el comentario",
    addVote: "Error al añadir el voto",

    // Chapitres
    loadChapters: "Error al cargar los capítulos",
    addChapter: "Error al añadir el capítulo",
    deleteChapter: "Error al eliminar el capítulo",
  },
  pending: {
    sending: "Enviando…",
    deleting: "Eliminando…",
    updating: "Actualizando…",
    loading: "Cargando…",
    encoding: "Codificando…",
    processing: "Procesando…",
    saving: "Guardando…",
    publishing: "Publicando…",
  },
  providers: {
    // Hooks de contexte
    auth: "useAuth debe estar envuelto en un proveedor AuthProvider",
    sidebar: "useSidebar debe estar envuelto en un proveedor SidebarProvider",
    playlistCreation:
      "usePlaylistCreationContext debe estar envuelto en un proveedor PlaylistCreationProvider",
    cunninghamTheme:
      "useCunninghamTheme debe estar envuelto en un proveedor CunninghamStyleProvider",

    // Erreurs
    getChannels:
      "Error al obtener {count, plural, one {el canal} other {los canales}}",
  },
  a11y: {
    // Logos
    institutionLogo: "Logotipo de la institución",
    homeLogo: "Logotipo de Esup-Pod, volver al inicio",
    facebookLogo: "Logotipo de Facebook",
    xLogo: "Logotipo de X",
    linkedinLogo: "Logotipo de LinkedIn",
    blueskyLogo: "Logotipo de Bluesky",
    mastodonLogo: "Logotipo de Mastodon",

    // Bannières, logos & vignettes
    channelBanner: "Banner del canal {title}",
    channelLogo: "Logotipo del canal {title}",
    themeBanner: "Banner del tema {title}",
    videoThumbnail: "Miniatura del vídeo {title}",
    collectionThumbnail: "Miniatura de la colección {title}",
    playlistThumbnail: "Miniatura de la lista de reproducción {title}",
    thumbnail: "Miniatura",
    preview: "Vista previa",
    watermark: "Marca de agua",

    // Photo de profil
    profilePreview: "Vista previa de la foto de perfil",
    currentProfilePicture: "Foto de perfil actual",
    changeProfilePicture: "Cambiar mi foto de perfil",
    deleteProfilePicture: "Eliminar la foto actual",
    newProfilePictureSuccess: "Foto de perfil actualizada correctamente",
    deleteProfilePictureSuccess: "Foto de perfil eliminada correctamente",
    noProfilePicture: "Todavía no tiene foto de perfil.",
    chooseImage: "Seleccione una imagen",

    // Import de vidéo
    importVideo: "Importar un vídeo",
    chooseFile: "Seleccione un archivo de vídeo",
    chooseVideo: "Seleccionar este vídeo",
    chooseVideoOrAudioFile: "Seleccione un archivo de audio o vídeo",
    supportedFormats: "Formatos compatibles: ",
    fileSizeLimit:
      "El tamaño del archivo debe ser <bold>inferior a {maxSize} GB.</bold>",
    uploadTimeInfo:
      "El tiempo de carga depende del tamaño de su archivo y de su velocidad de descarga.",
    uploadWarning:
      "Durante la carga, no cierre el navegador hasta recibir un mensaje de éxito o de error.",
    videoProcessingMessage:
      "Su vídeo está siendo procesado. No cierre la página…",
    skipImportCreateEmpty: "Omitir la importación (Crear una ficha vacía)",
    createEmptyRecord: "Crear una ficha vacía",
    emptyRecordWarning:
      "Está a punto de crear una ficha de vídeo sin archivo multimedia de origen. Podrá añadir el vídeo de origen posteriormente desde el paso <b>«Importación»</b> de la página de edición.",
    clearDescriptiveTitle: "Introduzca un título claro y descriptivo.",

    // Conditions d’utilisation & propriété intellectuelle
    termsOfUse: "Condiciones de uso",
    acceptTermsRequired: "Acepte las condiciones de uso.",
    intellectualPropertyWarning:
      "¡Atención! Asegúrese de respetar la legislación sobre propiedad intelectual antes de publicar un vídeo:",
    intellectualPropertyAcknowledgement:
      "Declaro que respeto la legislación sobre propiedad intelectual al publicar mi vídeo.",
    publicationAuthorizations:
      "Confirmo que dispongo de las autorizaciones necesarias firmadas por las partes implicadas en la publicación de este contenido multimedia, incluido el consentimiento relativo al derecho a la imagen y al tratamiento de datos personales. Certifico que todas las personas afectadas han recibido información completa sobre el tratamiento de sus datos personales, de conformidad con los artículos 13 y 14 del RGPD.",

    // Contrôles & menus
    collectionsDisplayMode: "Modo de visualización de las colecciones",
    videosDisplayMode: "Modo de visualización de los vídeos",
    videoActions: "Acciones del vídeo",
  },

  // === Données de référence ===
  languages: {
    fr: "Francés",
    en: "Inglés",
    es: "Español",
  },
  cursus: {
    "0": "Otro",
    L1: "Grado 1",
    L2: "Grado 2",
    L3: "Grado 3",
    M1: "Máster 1",
    M2: "Máster 2",
    D: "Doctorado",
  },
  type: {
    cours: "Curso",
    conference: "Conferencia",
    tutoriel: "Tutorial",
    colloque: "Coloquio",
    seminaire: "Seminario",
    interview: "Entrevista",
    autre: "Otro",
  },
  discipline: {
    informatique: "Informática",
    droit: "Derecho",
    medecine: "Medicina",
    sciences: "Ciencias",
    histoire: "Historia",
    langues: "Idiomas",
  },

  // === Mise en page ===
  navbar: {
    searchPlaceholder: "Buscar…",
    addVideo: "Añadir un vídeo",
    settings: "Visualización y accesibilidad",
    login: "Iniciar sesión",
    myProfileImage: "Cambiar mi foto de perfil",
    administration: "Administración",
    openProfileMenu: "Abrir el menú de perfil",
    closeSearch: "Cerrar la búsqueda",
  },
  sidebar: {
    // Navigation
    mainMenu: "Menú principal",
    closeMenu: "Cerrar el menú",
    browseVideos: "Consultar vídeos",
    mySpace: "Mi espacio",
    dashboard: "Mi panel de control",
    myFavorites: "Mis vídeos favoritos",
    favorites: "Vídeos favoritos",
    myPlaylists: "Mis listas de reproducción",
    playlists: "Lista de reproducción",
    videoBranding: "Diseños y marcas de agua",

    // Accueil & lecture
    welcome: "Bienvenido",
    welcomeUser: "¡Bienvenido {name}!",
    nowPlaying: "Reproduciendo",
  },
  footer: {
    legalNotice: "Aviso legal",
    accessibilityPartially: "Accesibilidad: Parcialmente conforme",
    siteMap: "Mapa del sitio",
    esupProject: "Proyecto Esup-Pod",
    esupPortal: "Portal Esup",
    videoPlatform: "Plataforma de vídeo",
  },

  // === Pages & fonctionnalités ===
  home: {
    welcomeSubtitle: "¡Bienvenido a su plataforma POD!",
    welcomeIntro:
      "El vídeo es un medio excelente para comunicar, enseñar y aprender. Estos son algunos usos que podrían interesarle.",
    howToTitle: "¿Cómo hacerlo?",
    howToDescPrefix: "¿Quiere publicar sus propios contenidos? Esta ",
    quickGuideLink: "guía de inicio rápido",
    howToDescSuffix: " le presentará las funcionalidades básicas de Pod.",
    btnUsePod: "Usar Pod",
    btnHowTo: "Cómo hacerlo",
    btnCopyright: "Derechos de autor",
    latestVideos: "Últimos vídeos publicados",
    btnAllVideos: "Mostrar todos los vídeos",
    videoServiceError: "El servicio de vídeo no está disponible temporalmente",
    noRecentVideos: "No hay vídeos públicos recientes",
  },
  auth: {
    loginTitle: "Iniciar sesión en mi perfil POD",
    loginRequired: "Debe iniciar sesión para acceder a esta página.",
    username: "Nombre de usuario",
    usernameRequired: "El nombre de usuario es obligatorio",
    password: "Contraseña",
    passwordRequired: "La contraseña es obligatoria",
    submitLogin: "Iniciar sesión",
    unknownUser: "Usuario desconocido",
    passwordMinLength: "La contraseña debe tener al menos {min} caracteres.",
    loginSuccess: "Ahora ha iniciado sesión.",
    logoutSuccess: "Ha cerrado sesión.",
  },
  webtv: {
    webtv: "WebTV",
    liveTitle: "Directo",
    noLive: "No hay ningún directo en curso",
    loadingContent: "Cargando contenidos de WebTV…",
    noContent: "No hay contenido disponible",
    climateActu: "Actualidad: Clima",
    seriesEmission: "Series / Programas",
    actuCollections: "Colecciones de actualidad",
    latestCollections: "Últimas colecciones",
    mostViewed: "Vídeos más vistos",
    searchContent: "Buscar contenidos",
  },
  blocks: {
    // Bloc Collections
    collectionTitle: "Bloque general de colecciones",
    collectionDescription:
      "Muestra una selección configurable de colecciones (canales, temas, listas de reproducción).",
    collectionTypeLabel: "Tipo de colección que se mostrará",
    collectionTypeChannels: "Canales",
    collectionTypeThemes: "Temas (Categorías)",
    collectionTypeAll: "Todas las colecciones",
    collectionIdsLabel:
      "Identificadores o slugs de las colecciones que se mostrarán (separados por comas)",
    collectionSortCreated: "Fecha de creación (Más recientes)",

    // Bloc Texte personnalisé
    customTextDescription: "Muestra un párrafo o contenido personalizado.",
    customTextContentLabel: "Contenido de texto o HTML",

    // Bloc Directs
    liveDescription:
      "Muestra la lista de directos en curso con un indicador activo rojo.",
    liveSortLabel: "Orden de clasificación de los directos",
    liveSortStartUpcoming: "Fecha de inicio (Próximamente)",
    liveSortStartRecent: "Fecha de inicio (Más recientes)",
    liveSortPopularity: "Popularidad (Número de espectadores)",

    // Bloc Grille de vidéos
    videoGridTitle: "Bloque de cuadrícula de vídeos",
    videoGridDescription:
      "Muestra una fila o cuadrícula configurable de tarjetas de vídeo.",
    videoGridSortLabel: "Orden de clasificación de los vídeos",
    videoGridSortLatest: "Últimos añadidos",
  },
  preferences: {
    settingsHeader: "Configuración",
    title: "Visualización y accesibilidad",
    dressing: "Marcas de agua",
    languageSectionTitle: "Idioma de la aplicación",
    languageSelectLabel: "Seleccione el idioma de la interfaz:",
    themeSectionTitle: "Tema visual",
    darkModeLabel: "Modo oscuro",
    lightModeLabel: "Modo claro",
  },
  filters: {
    // Recherche
    searchPlaceholder: "Buscar un vídeo…",
    search: "Búsqueda",
    advancedFilters: "Filtros avanzados",
    showResults: "Mostrar",
    clearFilters: "Borrar filtros",

    // Critères
    author: "Autor",
    types: "Tipos",
    cursus: "Nivel de estudios",
    keywords: "Palabras clave",

    // Tri
    sort: "Ordenar",
    newest: "Más recientes",
    oldest: "Más antiguas",
    titleAZ: "Título A-Z",
    titleZA: "Título Z-A",

    // Dates
    creationDate: "Fecha de creación",
    activeCreationDate: "Fecha (filtro activo)",
    selectPeriod: "Seleccione un período",
    createdAfter: "Creado después de",
    createdBefore: "Creado antes de",
  },
  bulk: {
    // Général
    title: "Edición masiva",
    checkVideosPrompt: "Seleccione vídeos para activar las acciones",
    chooseAction: "Elija una acción…",
    deselectAll: "Deseleccionar todo",
    modalTitle: "Editar en lote: {action}",
    newValueFor: "Nuevo valor para:",
    affectedVideos: "Vídeos afectados ({count})",
    confirmEdit: "Confirmar la modificación",
    unavailableForSelection: "No disponible para esta selección",
    encodingInProgressTooltip:
      "Algunos vídeos se están codificando actualmente. Las acciones que requieren la codificación completa están desactivadas.",
    encodingWarning:
      "Atención: algunos vídeos se están codificando actualmente.",
    errorBadge: "Error",

    // Modification
    editGroup: "EDITAR LOS VÍDEOS",
    changeType: "Cambiar el tipo",
    changeChannel: "Cambiar el canal",
    editDescription: "Modificar la descripción",
    changeLicense: "Cambiar la licencia",
    setEventDate: "Definir la fecha del evento",
    addReplaceKeywords: "Añadir / Reemplazar palabras clave",
    changeDiscipline: "Cambiar la disciplina",
    changeCursus: "Cambiar el nivel de estudios",
    keywordsHelper:
      "Separe las palabras clave con comas. Sustituirán a las palabras clave existentes.",

    // Visibilité & options
    publishUnpublish: "Publicar / Despublicar",
    restrictAuth: "Restringir a los miembros conectados",
    allowDownloading: "Permitir / Prohibir la descarga",
    disableComments: "Activar / Desactivar los comentarios",
    scheduleDeletion: "Programar una eliminación automática",
    scheduleDeletionNotice:
      "El vídeo se eliminará automáticamente en la fecha elegida.",

    // Suppression
    dangerZone: "ZONA DE PELIGRO",
    deleteSelected: "Eliminar los vídeos seleccionados",
    confirmDelete: "Confirmar eliminación",
    deleteWarning:
      "Está a punto de eliminar permanentemente los vídeos seleccionados.",
    deletePermanently: "Eliminar definitivamente",

    // Licences
    licenseCopyright: "Copyright / Todos los derechos reservados",
    licenseCcByNcSa: "CC BY-NC-SA — Compartir igual, sin uso comercial",
    licenseCcBySa: "CC BY-SA — Compartir igual",

    // Options de valeur
    optionPublic: "Público — visible para todos",
    optionPrivate: "Privado — borrador, no visible",
    optionAuthYes: "Sí — se requiere inicio de sesión para acceder",
    optionAuthNo: "No — accesible sin iniciar sesión",
    optionDownloadYes: "Sí — permitir la descarga",
    optionDownloadNo: "No — desactivar la descarga",
    optionCommentsOn: "Activar los comentarios",
    optionCommentsOff: "Desactivar los comentarios",

    // Retours
    deleteSuccess:
      "{count, plural, one {# vídeo eliminado} other {# vídeos eliminados}} correctamente.",
    updateSuccess:
      "{count, plural, one {# vídeo actualizado} other {# vídeos actualizados}} correctamente.",
    actionError: "Se ha producido un error al ejecutar la acción en lote.",
    errorPublishNotEncoded:
      "Imposible: uno o varios de los vídeos seleccionados aún no están codificados. Espere a que finalice la codificación para modificar el estado de publicación.",
    errorRestrictNotEncoded:
      "Imposible: la restricción de acceso solo puede definirse en vídeos completamente codificados.",
    errorDownloadNotEncoded:
      "Imposible: la descarga solo puede configurarse en vídeos codificados.",
    errorCommentsNotEncoded:
      "Imposible: los ajustes de comentarios solo se aplican a los vídeos codificados.",
  },
  table: {
    // Colonnes
    title: "Título",
    duration: "Duración",
    dateAdded: "Fecha de adición",
    status: "Estado",

    // Visibilité
    public: "Público",
    restricted: "Restringido",
    password: "Contraseña",
    privateVideo: "Vídeo privado",
    passwordProtectedVideo: "Vídeo protegido con contraseña",

    // États d’encodage
    pendingEncoding: "Vídeo pendiente de codificación",
    encodingCompleted: "Codificación completada",
    encodingError: "Error de codificación",

    // Résultats
    noVideosFound: "No se han encontrado vídeos.",
  },
  videoAction: {
    edit: "Editar el vídeo",
    duplicate: "Duplicar",
    duplicating: "Duplicando…",
    delete: "Eliminar el vídeo",
    deleteConfirm: "¿Está seguro/a de que desea eliminar el vídeo «{title}»?",
  },
  videoPlayer: {
    unableToLoad: "No se puede cargar el vídeo.",
    unableToDownload: "No se puede descargar el vídeo.",
    encodingInProgress: "Vídeo en proceso de codificación…",
    retry: "Reintentar",
  },
  videoDressing: {
    // Habillage
    dressing: "Diseño",
    title: "Diseño de vídeo",
    unique: "Diseño único",
    loading: "Cargando…",
    noDressing: "No hay ningún diseño disponible.",
    noConfig: "No hay ninguna configuración disponible.",

    // Éléments
    watermark: "Marca de agua",
    opacity: "Opacidad",
    start: "Inicio",
    end: "Fin",
    addWatermark: "Añadir una marca de agua",

    // Actions & retours
    create: "Crear",
    creation: "Creación del diseño",
    successCreate: "El diseño se ha creado correctamente.",
    errorUpdate: "Error al actualizar el diseño.",
  },
  videoPage: {
    // Actions
    back: "Volver",
    share: "Compartir",
    playlist: "Lista de reproducción",
    favorite: "Favorito",
    report: "Informar",
    editVideo: "Editar el vídeo",
    addToPlaylist: "Añadir a una lista de reproducción",
    copyLink: "Copiar el enlace",
    linkCopied: "¡Enlace copiado!",
    seeMore: "Ver más",
    seeLess: "Ver menos",
    download: "Descargar",
    chooseQuality: "Elegir la calidad:",
    shareOn: "Compartir en",

    // Informations
    about: "Acerca de",
    type: "Tipo",
    channel: "Canal",
    channelWithId: "Canal {id}",
    creator: "Creador",
    mainLanguage: "Idioma principal",
    keywords: "Palabras clave",
    keywordsloading: "Cargando palabras clave…",
    discipline: "Disciplina(s)",
    contributors: "Ponentes",
    license: "Licencia",
    cursus: "Nivel de estudios",
    eventDate: "Fecha del evento",
    resources: "Recursos",
    updatedAt: "Actualizado el:",
    views: "visualizaciones",
    none: "Ninguna",

    // États & messages
    notFound: "Vídeo no encontrado.",
    noPlaylistsAvailable: "No hay listas de reproducción disponibles",
    protectedByPassword: "Este vídeo está protegido mediante contraseña.",
    unlock: "Desbloquear el vídeo",
    unlocking: "Desbloqueando…",
    videoAddedToPlaylist: "Vídeo añadido a la lista de reproducción «{title}».",
    videoRemovedFromPlaylist:
      "Vídeo retirado de la lista de reproducción «{title}».",
    videoAddedToFavorites: "Vídeo añadido a sus favoritos.",
    videoRemovedFromFavorites: "Vídeo eliminado de sus favoritos.",
  },
  contributors: {
    // Formulaire
    defaultRole: "Realizador",
    searchLabel: "Buscar un colaborador…",
    roleLabel: "Rol",
    functionLabel: "Función / Cargo",

    // Messages
    addError:
      "No se puede añadir este colaborador (¿quizás ya se añadió con este rol?)",
    noContributors: "Ningún colaborador asociado.",
  },
  documents: {
    // Formulaire
    addTitle: "Añadir un documento",
    titleLabel: "Título del documento",
    dropzone: "Arrastre y suelte un archivo aquí",
    selectedFile: "Archivo seleccionado:",
    privateLabel:
      "Documento privado (visible únicamente para el propietario y los copropietarios)",
    addBtn: "Añadir el documento",

    // Liste
    loading: "Cargando documentos…",
    addedOn: "{title} - Añadido el {date}",
    private: "Privado",
    noDocuments: "Ningún documento está asociado a este vídeo por el momento.",

    // Messages
    fillTitleAndFile: "Indique un título y seleccione un archivo.",
    uploadError: "Error al subir el documento.",
    deleteConfirm: "¿Realmente desea eliminar este documento?",
    deleteError: "Error al eliminar.",
    loadError: "No se pueden cargar los documentos.",
  },
  chapters: {
    // Ajout
    addTitle: "Añadir un capítulo",
    titleLabel: "Título del capítulo",
    titlePlaceholder: "Ej.: Introducción, Demostración, Conclusión…",
    captureMoment: "Capturar este momento",
    captureTooltip: "Copia el tiempo actual en el campo Tiempo",

    // Liste
    noChapters:
      "Ningún capítulo. Reproduzca el vídeo y haga clic en <bold>Capturar este momento</bold> para añadir una entrada.",
    goToMoment: "Haga clic para ir a este momento",
    deleteChapter: "Eliminar este capítulo",

    // Messages
    titleRequired: "Introduzca un título.",
    timestampTooLong:
      "La marca de tiempo supera la duración del vídeo ({duration}).",
    playerUnavailable:
      "El reproductor estará disponible una vez finalizada la codificación. Puede introducir las marcas de tiempo manualmente.",
  },
  comments: {
    // Liste
    title: "Comentarios",
    count: "{count} comentario",
    countPlural: "{count} comentarios",
    noCommentsYet: "Todavía no hay comentarios.",
    disabled: "Los comentarios están desactivados para este vídeo.",
    loginToComment: "Inicie sesión para añadir un comentario.",

    // Saisie
    addPlaceholder: "Añadir un comentario",
    submit: "Comentar",
    submitting: "Publicando…",
    yourReply: "Su respuesta",

    // Actions
    reply: "Responder",
    delete: "Eliminar",
    voteForComment: "Votar por el comentario",
    liked: "Le gusta este comentario",

    // Réponses
    hideReplies: "Ocultar respuestas",
    showReplies: "{count} respuesta",
    showRepliesPlural: "{count} respuestas",
  },
  socialNetworks: {
    unableToLoad: "No se pueden cargar las redes sociales.",
    loading: "Cargando redes sociales…",
    errorSaveSocial: "Se ha producido un error al guardar la red social.",
    saved: "Red social guardada correctamente.",
    authorizedShare: "Red social autorizada para compartir.",
    choice: "Seleccione una red social",
  },
  videoEdit: {
    // En-tête & actions
    pageTitle: "Editar el vídeo «{title}»",
    pageTitleDefault: "Editar el vídeo",
    duplicate: "Duplicar",
    save: "Guardar",
    quit: "Salir de la página",
    previous: "Anterior",
    next: "Siguiente",
    requiredFieldsPrompt: "Los campos marcados con un * son obligatorios.",

    // Étapes
    stepImport: "Importación",
    stepDetails: "Detalles",
    stepElements: "Elementos del vídeo",
    stepVisibility: "Visibilidad",

    // Stepper & badges
    noSourceFileBadge: "Información: Archivo de origen no importado",
    incompleteBadge: "Incompleto",
    completedBadge: "Completado",
    stepInProgress: "Paso en curso",
    mediaAttached: "Fuente disponible",
    titleFilled: "Título indicado",
    titleRequired: "Título obligatorio",
    subtitlesAndDocs: "Subtítulos y enriquecimientos",
    draftOrPublic: "Borrador, restringido o público",

    // Étape Détails
    titleLabel: "Título",
    titlePlaceholder: "Título del vídeo",
    titleHelper:
      "Un título lo más corto y preciso posible, que refleje el tema principal / el contexto de este contenido.",
    descriptionLabel: "Descripción",
    descriptionPlaceholder: "Descripción del vídeo en español",
    descriptionHelper:
      "Describa su contenido, añada toda la información necesaria y dé formato al resultado.",
    mainLanguageLabel: "Idioma principal",
    mainLanguageHelper: "El idioma utilizado principalmente en este contenido.",
    thumbnailLabel: "Miniaturas",
    uploadThumbnailBtn: "+ Importar una miniatura",
    thumbnailDimensionsHint: "JPG o PNG · Recomendado: 1280 × 720 px",
    thumbnailCopyrightHelper:
      "La miniatura debe respetar las normas de la comunidad. Asegúrese de disponer de los derechos de autor adecuados.",
    changeBtn: "Cambiar",
    deleteBtn: "Eliminar",
    ownerLabel: "Propietario",
    ownerHelper: "Un superusuario puede cambiar el propietario de un vídeo.",
    coOwnersLabel: "Propietarios adicionales",
    coOwnersHelper:
      "Los propietarios adicionales tendrán los mismos derechos que usted, excepto que no podrán eliminar este contenido.",
    licenseLabel: "Licencia",
    licenseHelper: "Derechos de uso de su contenido.",
    channelLabel: "Canal",
    channelHelper: "Tiene permiso para asociar este vídeo a un canal.",
    noneOption: "Ninguna",
    themesLabel: "Temas",
    themesHelper:
      "Puede seleccionar uno o varios temas relacionados con el canal.",
    dateToDeleteLabel: "Fecha de eliminación",
    dateToDeleteHelper: "Fecha programada para la eliminación del vídeo.",
    dateOfEventLabel: "Fecha del evento",
    dateOfEventHelper: "Fecha del evento relacionado con este vídeo.",
    publicationDateLabel: "Fecha y hora de publicación programada",
    publicationDateHelper:
      "Defina una fecha/hora futura en la que el vídeo se hará público.",
    statusLabel: "Estado del vídeo",
    themesPlaceholder: "Seleccione uno o varios temas",

    // Étape Importation
    importHeaderTitle: "Añadir un archivo de vídeo",
    importHeaderSub:
      "Gestione el vídeo de origen y la codificación del contenido multimedia.",
    noSourceWarningTitle: "Ficha vacía sin vídeo de origen",
    noSourceWarningDesc:
      "Este vídeo todavía no tiene ningún archivo de origen asociado. Puede completar los metadatos (título, descripción, etc.), pero debe añadir un vídeo a continuación antes de poder publicarlo.",
    publicNoSourceAlert:
      "Ha seleccionado el estado Público, pero no se ha importado ningún archivo de origen. La importación es obligatoria para la publicación pública.",
    selectVideoFile:
      "Seleccione un archivo de vídeo de su ordenador. Se iniciará automáticamente un nuevo proceso de codificación.",
    addVideoFileBtn: "Añadir el vídeo",

    // Étape Éléments vidéo
    elementsHeaderSub:
      "Enriquezca su vídeo con subtítulos, documentos y colaboradores.",
    subtitlesTitle: "Subtítulos manuales",
    subtitlesDesc:
      "Añada archivos de subtítulos (.vtt, .srt) en uno o varios idiomas.",
    documentsTitle: "Documentos adjuntos",
    documentsDesc:
      "Asocie archivos PDF, presentaciones u otros documentos descargables.",
    contributorsTitle: "Colaboradores y ponentes",
    contributorsDesc: "Añada autores, realizadores o ponentes a su vídeo.",
    chaptersTitle: "Capitular el vídeo",
    chaptersDesc: "Divida su vídeo en capítulos con marcadores temporales.",
    dressingTitle: "Personalizar el vídeo",
    dressingDesc: "Aplique un diseño (marca de agua, introducción / cierre).",
    position: "Posición de la marca de agua",
    opacity: "Opacidad de la marca de agua",
    trimTitle: "Recortar el vídeo",
    trimDesc: "Delimite un punto de entrada y de salida para acortar el vídeo.",
    chaptersDialogTitle: "Capítulos del vídeo",

    // Étape Visibilité
    visibilityHeaderSub: "Elija cuándo publicar su vídeo y quién puede verlo.",
    restrictionsHeader: "Restricciones",
    restrictionsSub:
      "Elija si desea que su vídeo sea público, no listado o privado.",
    draftPrivateTitle: "Borrador / Privado",
    draftPrivateDesc:
      "En el modo «Borrador / Privado», el contenido no aparece en ningún lugar y nadie más que usted puede verlo.",
    restrictedTitle: "Acceso restringido",
    restrictedDesc:
      "En el modo «Acceso restringido», puede elegir las restricciones para el vídeo.",
    publicTitle: "Público",
    publicDesc:
      "En el modo «Público», el contenido es visible para todo el mundo.",
    noSourceDraftNotice:
      "Sin archivo de origen, solo se permiten los modos Borrador / Privado. Los modos Acceso restringido y Público están desactivados.",
    restrictionOptions: "Opciones de restricción:",
    authRequiredLabel: "Autenticación requerida",
    authRequiredHelper: "Limitar el acceso a las personas autenticadas.",
    authUserOnly: "Reservado a usuarios autenticados.",
    passwordRequiredLabel: "Contraseña requerida",
    passwordLabel: "Contraseña del vídeo",
    diffusionTitle: "Configuración de la difusión",
    allowDownloadLabel: "Permitir la descarga",
    allowDownloadHelper: "Permitir la descarga de su vídeo.",
    disableCommentsLabel: "Desactivar los comentarios",
    disableCommentsHelper:
      "Desactivar la posibilidad de añadir comentarios a su vídeo.",
    advancedOptionsTitle: "Opciones avanzadas",
    is360Label: "Se trata de un vídeo 360°",
    is360Helper: "Activar el reproductor 360° para este vídeo.",
    passwordKeepHelper:
      "Déjelo vacío para no modificar la contraseña existente.",

    // Messages & validation
    fillRequiredFields:
      "Rellene el/los campo(s) obligatorio(s) antes de continuar: {fields}.",
    fillRequiredFieldsStep:
      "Rellene el/los campo(s) obligatorio(s) del paso «{step}» antes de continuar: {fields}.",
    restrictedNeedsOption:
      "Para un estado restringido, elija al menos una restricción.",
    noPermission: "No tiene permisos para editar este vídeo.",
    loginRequired: "Debe iniciar sesión para editar este vídeo.",
    updateSuccess: "¡Vídeo actualizado correctamente!",

    // Sous-titres
    addSubtitle: "Añadir un subtítulo",
    noSubtitles: "Ningún subtítulo añadido.",
    subtitleFileHint: "Seleccionar un archivo .vtt o .srt",
    addSubtitleBtn: "Añadir el subtítulo",
    cannotAddSubtitle: "No se puede añadir un subtítulo a este vídeo.",
    selectSubtitleFile: "Seleccione un archivo de subtítulos.",

    // Changement de source
    changeSourceTitle: "Cambiar el origen del vídeo",
    changeSourceDesc:
      "Sustituya el archivo de origen de este vídeo. Se iniciará un nuevo proceso de codificación.",
    selectNewVideoFile: "Seleccionar un nuevo archivo de vídeo",
    replaceSourceBtn: "Sustituir el origen",
    changeSourceError: "Error al cambiar el origen.",
    sourceUpdated: "Origen del vídeo actualizado. Recodificación iniciada.",
  },
  favorites: {
    title: "Mis vídeos favoritos",
    startPlaylist: "Iniciar la lista de reproducción",
    noFavorites: "Todavía no hay vídeos favoritos.",
    noMatchingFilters: "Ningún vídeo coincide con sus filtros.",
    favoriteUpdateError:
      "Se ha producido un error al actualizar los favoritos.",
  },
  playlists: {
    // Titres & libellés
    myTitle: "Mis listas de reproducción",
    playlists: "Listas de reproducción",
    playlist: "Lista de reproducción",
    nowPlaying: "Reproduciendo",
    notFound: "Lista de reproducción no encontrada.",
    unableToLoad: "No se puede cargar la lista de reproducción",
    backToMyPlaylists: "Volver a mis listas de reproducción",

    // Création & édition
    addPlaylist: "Añadir una lista de reproducción",
    addThePlaylist: "Añadir la lista de reproducción",
    editPlaylist: "Editar la lista de reproducción",
    seePlaylist: "Ver la lista de reproducción",
    playlistCreated: "La lista de reproducción se ha creado correctamente.",
    playlistUpdated: "¡Lista de reproducción actualizada correctamente!",
    noPermissionToEditPlaylist:
      "No tiene permisos para modificar esta lista de reproducción.",

    // Suppression
    delete: "Eliminar la lista de reproducción",
    deleteConfirm:
      "¿Está seguro de que desea eliminar esta lista de reproducción?",
    deleteSuccess: "La lista de reproducción se ha eliminado correctamente.",

    // Listes vides
    noVideos: "No hay vídeos en esta lista de reproducción",
    noPlaylists: "Todavía no tiene ninguna lista de reproducción.",
    noMatchingFilters:
      "Ninguna lista de reproducción coincide con sus filtros.",
    noPublicPlaylists:
      "No hay listas de reproducción disponibles por el momento.",

    // Erreurs
    creationError:
      "Se ha producido un error al crear la lista de reproducción.",
    deleteError:
      "Se ha producido un error al eliminar la lista de reproducción.",
    playlistUpdateError:
      "Se ha producido un error al actualizar la lista de reproducción.",

    // Visibilité
    passwordProtected: "Lista de reproducción protegida con contraseña",
    private: "Lista de reproducción privada",

    // Formulaire
    titleHelper: "Dé a su lista de reproducción un título breve y explícito.",
    descriptionHelper:
      "Describa el contenido y/o el contexto de su lista de reproducción.",
    accessRestrictions: "Restricciones de acceso",
    protectWithPassword: "Proteger mi lista de reproducción con una contraseña",
    addPassword: "Añadir una contraseña",
    passwordLabel: "Contraseña de la lista de reproducción",
    passwordHelper:
      "Añada una contraseña para acceder a la lista de reproducción.",
    visibleToAll:
      "Su lista de reproducción será visible para todos los usuarios.",
    visibleToOwner:
      "Su lista de reproducción será visible únicamente para usted.",
    defaultSort: "Orden predeterminado",
    defaultSortLabel: "Orden de visualización de los vídeos predeterminado.",
    defaultSortHelper: "Elija el orden en que se muestran los vídeos.",
  },
  channels: {
    // Général
    title: "Canales",
    content: "Contenidos del canal",
    unclassified: "Vídeos sin clasificar",

    // Listes vides
    noChannels: "No hay canales disponibles por el momento.",
    noMatchingFilters: "Ningún canal coincide con sus filtros.",
    noContent: "Este canal no tiene vídeos ni temas asociados.",
    noTheme: "Este canal no tiene ningún tema asociado.",
    noThemes: "Ningún tema coincide con sus criterios de búsqueda.",
    noVideos: "Este canal no tiene ningún vídeo asociado.",
  },
  dressingPage: {
    title: "Diseños y marcas de agua de vídeo",
    pageDescription:
      "Gestione sus marcas de agua y elementos visuales para incrustarlos directamente en sus vídeos.",
    myWatermarks: "Mis marcas de agua",
    addWatermark: "Añadir una marca de agua",
    uploading: "Subiendo…",
    noWatermarks: "Todavía no ha subido ninguna marca de agua.",
    deleteConfirm: "¿Está seguro de que desea eliminar esta marca de agua?",
    loadError: "Error al cargar las marcas de agua.",
    uploadError: "Error al subir la imagen",
  },

  // === Métadonnées des pages ===
  titles: {
    // Titres de pages
    platform: "Plataforma de vídeo Esup-Pod",
    login: "Inicio de sesión | Esup-Pod",
    video: "Vídeo | Esup-Pod",
    allVideos: "Todos los vídeos - Esup-Pod",
  },
  descriptions: {
    dashboard:
      "Gestione sus vídeos y configuraciones en su panel de control de Esup-Pod.",
    login:
      "Inicie sesión para acceder a sus vídeos y a su espacio personal en Esup-Pod.",
    playlists:
      "Descubra y gestione las listas de reproducción públicas de la plataforma Esup-Pod.",
    videos: "Descubra todos los vídeos públicos de la plataforma Esup-Pod.",
    watchVideo: "Ver el vídeo en Esup-Pod",
  },
};

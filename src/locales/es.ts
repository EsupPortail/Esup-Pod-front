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
    adding: "Añadiendo…",
    addVideo: "Añadir un vídeo",
    search: "Buscar",
    selectAll: "Seleccionar todo",
    stayOnPage: "Permanecer en la página",
    leaveWithoutSaving: "Salir sin guardar",

    // Status & connection
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
    commingSoon: "Próximamente",

    // Entities (singular / plural)
    video: "Vídeo",
    videos: "Vídeos",
    pluralVideos: "{count, plural, one {# vídeo} other {# vídeos}}",
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
    directs: "Directos",
    view: "vista",
    views: "vistas",

    // Display, search & pagination
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

    // Metadata
    createdBy: "Creado por",
    latestUpdate: "Actualizado el:",
    contributors: "Colaboradores y participantes",
    addContributorsDesc:
      "Añada autores, realizadores o participantes a su vídeo.",
    infos: "Información",
    configBase: "Configure los ajustes básicos",

    // Visibility
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

    // Miscellaneous
    recently: "Recientemente",
    default: "Predeterminado",
  },

  errors: {
    // General
    error: "Se ha producido un error",
    update: "Se ha producido un error al actualizar",
    save: "Error al guardar",
    create: "Error al crear",
    loadError: "Error de carga",
    loadConfig: "Error al cargar la configuración",
    loadInfo: "Error al cargar la información",
    notFound: "Página no encontrada",
    notFoundDesc:
      "La página que busca no existe o ha sido eliminada.",
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

    // Videos
    loadErrorVideo: "Error al cargar el vídeo",
    loadErrorVideos: "Error al cargar los vídeos {status}.",
    deleteErrorVideo:
      "Se ha producido un error al eliminar el vídeo",
    dupErrorVideo:
      "Se ha producido un error al duplicar el vídeo",

    // Images
    chooseImage: "Seleccione una imagen",
    imageSendError: "Error al enviar la imagen",
    imageDeleteError: "Error al eliminar la imagen",

    // Pages & sections
    loadPage: "Error al cargar la página",
    getBlocks: "Error al obtener los bloques de diseño.",
    unableToSection: "No se puede cargar esta sección de la aplicación",
    unableToTheme: "No se puede cargar este tema.",

    // Channels & themes
    getChannels:
      "Error al obtener {count, plural, one {el canal} other {los canales}}",
    getThemeError:
      "Error al obtener {count, plural, one {el tema} other {los temas}}",

    // Keywords
    tagsLoadError: "Error al cargar las palabras clave: {error}",
    noKeywords: "No hay palabras clave disponibles actualmente.",

    // Subtitles
    addSubtitleError: "Error al añadir el subtítulo",
    deleteSubtitleError: "Error al eliminar el subtítulo",

    // Playlists
    loadPlaylist:
      "Error al cargar {count, plural, one {la lista de reproducción} other {las listas de reproducción}}.",
    updatePlaylist: "Error al modificar la lista de reproducción",
    deletePlaylist: "Error al eliminar la lista de reproducción",
    addVideoToPlaylist:
      "Error al añadir el vídeo a la lista de reproducción",
    deleteVideoFromPlaylist:
      "Error al retirar el vídeo de la lista de reproducción",

    // Favorites
    loadFavorites: "Error al cargar los favoritos",
    addFavorite: "Error al añadir el vídeo a los favoritos",
    deleteFavorite: "Error al eliminar el vídeo de los favoritos",

    // Comments & votes
    loadComments: "Error al cargar los comentarios",
    addComment: "Error al añadir el comentario",
    deleteComment: "Error al eliminar el comentario",
    addVote: "Error al añadir el voto",

    // Chapters
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
    // Context hooks
    auth: "useAuth debe utilizarse dentro de AuthProvider.",
    sidebar: "useSidebar debe utilizarse dentro de SidebarProvider.",
    playlistCreation:
      "usePlaylistCreationContext debe utilizarse dentro de PlaylistCreationProvider.",
    cunninghamTheme:
      "useCunninghamTheme debe utilizarse dentro de CunninghamStyleProvider.",

    // Errors
    getChannels:
      "Error al obtener {count, plural, one {el canal} other {los canales}}",
  },

  a11y: {
    // Logos
    institutionLogo: "Logotipo de la institución",
    homeLogo: "Logotipo de Esup-Pod, volver a la página de inicio",
    facebookLogo: "Logotipo de Facebook",
    xLogo: "Logotipo de X",
    linkedinLogo: "Logotipo de LinkedIn",
    blueskyLogo: "Logotipo de Bluesky",
    mastodonLogo: "Logotipo de Mastodon",

    // Banners, logos & thumbnails
    channelBanner: "Banner del canal {title}",
    channelLogo: "Logotipo del canal {title}",
    themeBanner: "Banner del tema {title}",
    videoThumbnail: "Miniatura del vídeo {title}",
    collectionThumbnail: "Miniatura de la colección {title}",
    playlistThumbnail: "Miniatura de la lista de reproducción {title}",
    thumbnail: "Miniatura",
    preview: "Vista previa",
    watermark: "Marca de agua",

    // Profile picture
    profilePreview: "Vista previa de la foto de perfil",
    currentProfilePicture: "Foto de perfil actual",
    changeProfilePicture: "Cambiar mi foto de perfil",
    deleteProfilePicture: "Eliminar la foto de perfil actual",
    newProfilePictureSuccess:
      "Foto de perfil actualizada correctamente",
    deleteProfilePictureSuccess:
      "Foto de perfil eliminada correctamente",
    noProfilePicture: "Todavía no tiene una foto de perfil.",
    chooseImage: "Seleccione una imagen",

    // Video import
    importVideo: "Importar un vídeo",
    chooseFile: "Seleccione un archivo de vídeo",
    chooseVideo: "Seleccionar este vídeo",
    chooseVideoOrAudioFile: "Elija un archivo de audio o vídeo",
    supportedFormats: "Formatos compatibles: ",
    fileSizeLimit:
      "El tamaño del archivo debe ser <bold>inferior a {maxSize} GB.</bold>",
    uploadTimeInfo:
      "El tiempo de carga depende del tamaño del archivo y de su velocidad de subida.",
    uploadWarning:
      "Durante la carga, no cierre el navegador hasta recibir un mensaje de éxito o error.",
    videoProcessingMessage:
      "Su vídeo se está procesando. No cierre la página…",
    skipImportCreateEmpty:
      "Omitir la importación (Crear una ficha vacía)",
    createEmptyRecord: "Crear una ficha vacía",
    emptyRecordWarning:
      "Está a punto de crear una ficha de vídeo sin archivo multimedia de origen. Podrá añadir el vídeo de origen posteriormente desde el paso <b>«Importación»</b> de la página de edición.",
    clearDescriptiveTitle:
      "Introduzca un título claro y descriptivo.",

    // Terms of use & intellectual property
    termsOfUse: "Condiciones de uso",
    acceptTermsRequired:
      "Acepte las condiciones de uso.",
    intellectualPropertyWarning:
      "¡Atención! Asegúrese de respetar la legislación sobre propiedad intelectual antes de publicar un vídeo:",
    intellectualPropertyAcknowledgement:
      "Certifico que respeto la legislación sobre propiedad intelectual al publicar mi vídeo.",
    publicationAuthorizations:
      "Confirmo que dispongo de las autorizaciones necesarias firmadas por las partes implicadas en la publicación de este contenido multimedia, incluido el consentimiento relativo al derecho a la imagen y al tratamiento de datos personales. Certifico que todas las personas afectadas han recibido información completa sobre el tratamiento de sus datos personales, de conformidad con lo dispuesto en los artículos 13 y 14 del RGPD.",

    // Controls & menus
    collectionsDisplayMode:
      "Modo de visualización de las colecciones",
    videosDisplayMode:
      "Modo de visualización de los vídeos",
    videoActions: "Acciones del vídeo",
  },

  // === Reference data ===
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

  // === Layout ===
  navbar: {
    searchPlaceholder: "Buscar…",
    addVideo: "Añadir un vídeo",
    settings: "Visualización y accesibilidad",
    login: "Iniciar sesión",
    myProfileImage: "Modificar mi foto de perfil",
    administration: "Administración",
    openProfileMenu: "Abrir el menú de perfil",
    closeSearch: "Cerrar la búsqueda",
  },

  sidebar: {
    // Navigation
    mainMenu: "Menú principal",
    closeMenu: "Cerrar el menú",
    browseVideos: "Consultar los vídeos",
    mySpace: "Mi espacio",
    dashboard: "Mi panel de control",
    myFavorites: "Mis vídeos favoritos",
    favorites: "Vídeos favoritos",
    myPlaylists: "Mis listas de reproducción",
    playlists: "Reproducción de la lista",
    videoBranding: "Diseños y marcas de agua",

    // Home & playback
    welcome: "Bienvenido",
    welcomeUser: "¡Bienvenido {name}!",
    nowPlaying: "Reproduciendo",
  },

  footer: {
    legalNotice: "Aviso legal",
    accessibilityPartially: "Accesibilidad: parcialmente conforme",
    siteMap: "Mapa del sitio",
    esupProject: "Proyecto Esup-Pod",
    esupPortal: "Portal Esup",
    videoPlatform: "Plataforma de vídeo",
  },

  // === Pages & features ===
  home: {
    welcomeSubtitle: "¡Bienvenido a su plataforma POD!",
    welcomeIntro:
      "El vídeo es un medio ideal para comunicar, enseñar y aprender. Estos son algunos usos que podrían interesarle.",
    howToTitle: "¿Cómo hacerlo?",
    howToDescPrefix:
      "¿Quiere poner sus propios contenidos en línea? Esta ",
    quickGuideLink: "guía rápida",
    howToDescSuffix:
      " le presentará las funciones básicas de Pod.",
    btnUsePod: "Utilizar Pod",
    btnHowTo: "Cómo hacerlo",
    btnCopyright: "Derechos de autor",
    latestVideos: "Últimos vídeos publicados",
    btnAllVideos: "Mostrar todos los vídeos",
    videoServiceError:
      "El servicio de vídeo no está disponible temporalmente",
    noRecentVideos: "No hay vídeos públicos recientes",
  },

  auth: {
    loginTitle: "Iniciar sesión en mi perfil POD",
    loginRequired:
      "Debe iniciar sesión para acceder a esta página.",
    username: "Nombre de usuario",
    usernameRequired: "El nombre de usuario es obligatorio",
    password: "Contraseña",
    passwordRequired: "La contraseña es obligatoria",
    submitLogin: "Iniciar sesión",
    unknownUser: "Usuario desconocido",
    passwordMinLength:
      "La contraseña debe contener al menos {min} caracteres.",
    loginSuccess: "Ha iniciado sesión correctamente.",
    logoutSuccess: "Ha cerrado sesión correctamente.",
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
    // Collections block
    collectionTitle: "Bloque general de colecciones",
    collectionDescription:
      "Muestra una selección configurable de colecciones (canales, temas, listas de reproducción).",
    collectionTypeLabel:
      "Tipo de colección que se mostrará",
    collectionTypeChannels: "Canales",
    collectionTypeThemes: "Temas (Categorías)",
    collectionTypeAll: "Todas las colecciones",
    collectionIdsLabel:
      "Identificadores o slugs de las colecciones que se mostrarán (separados por comas)",
    collectionSortCreated:
      "Fecha de creación (Más recientes)",

    // Custom text block
    customTextDescription:
      "Muestra un párrafo o contenido personalizado.",
    customTextContentLabel: "Contenido de texto o HTML",

    // Live streams block
    liveDescription:
      "Muestra la lista de directos en curso con un indicador rojo activo.",
    liveSortLabel: "Orden de clasificación de los directos",
    liveSortStartUpcoming:
      "Fecha de inicio (Próximamente)",
    liveSortStartRecent:
      "Fecha de inicio (Recientes)",
    liveSortPopularity:
      "Popularidad (Número de espectadores)",

    // Video grid block
    videoGridTitle: "Bloque de cuadrícula de vídeos",
    videoGridDescription:
      "Muestra una fila o cuadrícula configurable de tarjetas de vídeo.",
    videoGridSortLabel:
      "Orden de clasificación de los vídeos",
    videoGridSortLatest: "Añadidos recientemente",
  },

  preferences: {
    settingsHeader: "Configuración",
    title: "Visualización y accesibilidad",
    dressing: "Marcas de agua",
    languageSectionTitle: "Idioma de la aplicación",
    languageSelectLabel:
      "Elija el idioma de la interfaz:",
    themeSectionTitle: "Tema visual",
    darkModeLabel: "Modo oscuro",
    lightModeLabel: "Modo claro",
  },

  filters: {
    // Search
    searchPlaceholder: "Buscar un vídeo…",
    search: "Búsqueda",
    advancedFilters: "Filtros avanzados",
    showResults: "Mostrar",
    clearFilters: "Borrar filtros",

    // Criteria
    author: "Autor",
    types: "Tipos",
    cursus: "Nivel de estudios",
    keywords: "Palabras clave",

    // Sorting
    sort: "Ordenar",
    newest: "Más recientes",
    oldest: "Más antiguos",
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
    // General
    title: "Editar en lote",
    checkVideosPrompt:
      "Seleccione vídeos para activar las acciones",
    chooseAction: "Elegir una acción…",
    deselectAll: "Deseleccionar todo",
    modalTitle: "Editar en lote: {action}",
    newValueFor: "Nuevo valor para:",
    affectedVideos: "Vídeos afectados ({count})",
    confirmEdit: "Confirmar modificación",
    unavailableForSelection:
      "No disponible para esta selección",
    encodingInProgressTooltip:
      "Algunos vídeos están siendo codificados. Las acciones que requieren una codificación completa están desactivadas.",
    encodingWarning:
      "Atención: algunos vídeos están siendo codificados.",
    errorBadge: "Error",

    // Editing
    editGroup: "MODIFICAR LOS VÍDEOS",
    changeType: "Cambiar el tipo",
    changeChannel: "Cambiar el canal",
    editDescription: "Modificar la descripción",
    changeLicense: "Cambiar la licencia",
    setEventDate: "Definir la fecha del evento",
    addReplaceKeywords:
      "Añadir / Reemplazar palabras clave",
    changeDiscipline: "Cambiar la disciplina",
    changeCursus: "Cambiar el nivel de estudios",
    keywordsHelper:
      "Separe las palabras clave con comas. Sustituirán las palabras clave existentes.",

    // Visibility & options
    publishUnpublish: "Publicar / Despublicar",
    restrictAuth: "Restringir a usuarios conectados",
    allowDownloading:
      "Permitir / Prohibir la descarga",
    disableComments:
      "Activar / Desactivar los comentarios",
    scheduleDeletion:
      "Programar una eliminación automática",
    scheduleDeletionNotice:
      "El vídeo se eliminará automáticamente en la fecha seleccionada.",

    // Deletion
    dangerZone: "ZONA DE PELIGRO",
    deleteSelected: "Eliminar los vídeos seleccionados",
    confirmDelete: "Confirmar eliminación",
    deleteWarning:
      "Está a punto de eliminar definitivamente los vídeos seleccionados.",
    deletePermanently: "Eliminar definitivamente",

    // Licenses
    licenseCopyright: "Copyright / Todos los derechos reservados",
    licenseCcByNcSa:
      "CC BY-NC-SA — Compartir igual, sin uso comercial",
    licenseCcBySa: "CC BY-SA — Compartir igual",

    // Value options
    optionPublic: "Público — visible para todos",
    optionPrivate: "Privado — borrador, no visible",
    optionAuthYes:
      "Sí — se requiere iniciar sesión para acceder",
    optionAuthNo:
      "No — accesible sin iniciar sesión",
    optionDownloadYes:
      "Sí — permitir la descarga",
    optionDownloadNo:
      "No — desactivar la descarga",
    optionCommentsOn: "Activar los comentarios",
    optionCommentsOff: "Desactivar los comentarios",

    // Feedback
    deleteSuccess:
      "{count, plural, one {# vídeo eliminado} other {# vídeos eliminados}} correctamente.",
    updateSuccess:
      "{count, plural, one {# vídeo actualizado} other {# vídeos actualizados}} correctamente.",
    actionError:
      "Se ha producido un error al ejecutar la acción masiva.",
    errorPublishNotEncoded:
      "Imposible: uno o varios vídeos seleccionados todavía no han sido codificados. Espere a que finalice la codificación antes de modificar el estado de publicación.",
    errorRestrictNotEncoded:
      "Imposible: la restricción de acceso solo puede configurarse en vídeos completamente codificados.",
    errorDownloadNotEncoded:
      "Imposible: la descarga solo puede configurarse en vídeos codificados.",
    errorCommentsNotEncoded:
      "Imposible: la configuración de comentarios solo se aplica a vídeos codificados.",
  },

  table: {
    // Columns
    title: "Título",
    duration: "Duración",
    dateAdded: "Fecha de adición",
    status: "Estado",

    // Visibility
    public: "Público",
    restricted: "Restringido",
    password: "Contraseña",
    privateVideo: "Vídeo privado",
    passwordProtectedVideo:
      "Vídeo protegido por contraseña",

    // Encoding states
    pendingEncoding: "Vídeo pendiente de codificación",
    encodingCompleted: "Codificación completada",
    encodingError: "Error de codificación",

    // Results
    noVideosFound: "No se han encontrado vídeos.",
  },

  videoAction: {
    edit: "Editar vídeo",
    duplicate: "Duplicar",
    duplicating: "Duplicando…",
    delete: "Eliminar vídeo",
    deleteConfirm:
      "¿Está seguro de que desea eliminar el vídeo «{title}»?",
  },

  videoPlayer: {
    unableToLoad: "No se puede cargar el vídeo.",
    unableToDownload: "No se puede descargar el vídeo.",
    encodingInProgress: "Vídeo en proceso de codificación…",
    retry: "Reintentar",
  },

  videoDressing: {
    // Branding
    dressing: "Diseño del vídeo",
    title: "Título del diseño",
    unique:
      "Nombre único para identificar el diseño",
    loading: "Cargando el diseño…",
    noDressing:
      "No hay ningún diseño disponible actualmente.",
    noConfig: "Ningún elemento configurado",

    // Elements
    watermark: "Marca de agua",
    opacity: "Opacidad",
    start: "Introducción",
    end: "Cierre",
    addWatermark:
      "Para añadir una marca de agua o introducciones/cierres, cree un nuevo diseño y, a continuación, edítelo.",

    // Actions & feedback
    create: "Crear un nuevo diseño",
    creation: "Creando…",
    successCreate: "Diseño aplicado correctamente",
    errorUpdate:
      "Error al actualizar el diseño",
  },

  videoPage: {
    // Actions
    back: "Volver",
    share: "Compartir",
    playlist: "Lista de reproducción",
    favorite: "Favorito",
    report: "Denunciar",
    editVideo: "Editar vídeo",
    addToPlaylist:
      "Añadir a una lista de reproducción",
    copyLink: "Copiar enlace",
    linkCopied: "¡Enlace copiado!",
    seeMore: "Ver más",
    seeLess: "Ver menos",
    download: "Descargar",
    chooseQuality: "Elegir calidad:",
    shareOn: "Compartir en {network}",

    // Information
    about: "Acerca de",
    type: "Tipo",
    channel: "Canal",
    channelWithId: "Canal {id}",
    creator: "Creador",
    mainLanguage: "Idioma principal",
    keywords: "Palabras clave",
    keywordsloading:
      "Cargando las palabras clave…",
    discipline: "Disciplina(s)",
    contributors: "Participantes",
    license: "Licencia",
    cursus: "Nivel de estudios",
    eventDate: "Fecha del evento",
    resources: "Recursos",
    updatedAt: "Actualizado el:",
    views: "vistas",
    none: "Ninguna",

    // States & messages
    notFound: "Vídeo no encontrado.",
    noPlaylistsAvailable:
      "No hay listas de reproducción disponibles",
    protectedByPassword:
      "Este vídeo está protegido por contraseña.",
    unlock: "Desbloquear el vídeo",
    unlocking: "Desbloqueando…",
    videoAddedToPlaylist:
      "Vídeo añadido a la lista de reproducción «{title}».",
    videoRemovedFromPlaylist:
      "Vídeo retirado de la lista de reproducción «{title}».",
    videoAddedToFavorites:
      "Vídeo añadido a sus favoritos.",
    videoRemovedFromFavorites:
      "Vídeo eliminado de sus favoritos.",
  },

  contributors: {
    // Form
    defaultRole: "Realizador",
    searchLabel:
      "Buscar un colaborador…",
    roleLabel: "Rol",
    functionLabel: "Función / Título",

    // Messages
    addError:
      "No se puede añadir este colaborador (¿quizás ya está añadido con este rol?)",
    noContributors:
      "No hay colaboradores asociados.",
  },

  documents: {
    // Form
    addTitle: "Añadir un documento",
    titleLabel: "Título del documento",
    dropzone:
      "Arrastre y suelte un archivo aquí",
    selectedFile: "Archivo seleccionado:",
    privateLabel:
      "Documento privado (visible únicamente para el propietario y los copropietarios)",
    addBtn: "Añadir el documento",

    // List
    loading: "Cargando documentos…",
    addedOn: "{title} - Añadido el {date}",
    private: "Privado",
    noDocuments:
      "No hay ningún documento asociado a este vídeo actualmente.",

    // Messages
    fillTitleAndFile:
      "Introduzca un título y seleccione un archivo.",
    uploadError:
      "Error al cargar el documento.",
    deleteConfirm:
      "¿Realmente desea eliminar este documento?",
    deleteError: "Error al eliminar.",
    loadError:
      "No se pueden cargar los documentos.",
  },

  chapters: {
    // Adding
    addTitle: "Añadir un capítulo",
    titleLabel: "Título del capítulo",
    titlePlaceholder:
      "Ej.: Introducción, Demostración, Conclusión…",
    captureMoment: "Capturar este momento",
    captureTooltip:
      "Copia el tiempo actual en el campo Tiempo",

    // List
    noChapters:
      "No hay capítulos. Reproduzca el vídeo y haga clic en <bold>Capturar este momento</bold> para añadir una entrada.",
    goToMoment:
      "Haga clic para ir a este momento",
    deleteChapter: "Eliminar este capítulo",

    // Messages
    titleRequired: "Introduzca un título.",
    timestampTooLong:
      "La marca de tiempo supera la duración del vídeo ({duration}).",
    playerUnavailable:
      "El reproductor estará disponible una vez finalizada la codificación. Puede introducir las marcas de tiempo manualmente.",
  },

  comments: {
    // List
    title: "Comentarios",
    count: "{count} comentario",
    countPlural: "{count} comentarios",
    noCommentsYet:
      "Todavía no hay comentarios.",
    disabled:
      "Los comentarios están desactivados para este vídeo.",
    loginToComment:
      "Inicie sesión para añadir un comentario.",

    // Input
    addPlaceholder: "Añadir un comentario",
    submit: "Comentar",
    submitting: "Publicando…",
    yourReply: "Su respuesta",

    // Actions
    reply: "Responder",
    delete: "Eliminar",
    voteForComment:
      "Votar por este comentario",
    liked: "Le gusta este comentario",

    // Replies
    hideReplies: "Ocultar respuestas",
    showReplies: "{count} respuesta",
    showRepliesPlural: "{count} respuestas",
  },

  socialNetworks: {
    unableToLoad:
      "No se pueden cargar las redes sociales.",
    loading: "Cargando las redes sociales…",
    errorSaveSocial:
      "Se ha producido un error al guardar la red social.",
    saved:
      "Red social guardada correctamente.",
    authorizedShare:
      "Red social autorizada para compartir.",
    choice: "Seleccione una red social",
  },

  videoEdit: {
    // Header & actions
    pageTitle: "Editar el vídeo «{title}»",
    pageTitleDefault: "Editar el vídeo",
    duplicate: "Duplicar",
    save: "Guardar",
    quit: "Salir de la página",
    previous: "Anterior",
    next: "Siguiente",
    requiredFieldsPrompt:
      "Los campos marcados con * son obligatorios.",

    // Steps
    stepImport: "Importación",
    stepDetails: "Detalles",
    stepElements: "Elementos del vídeo",
    stepVisibility: "Visibilidad",

    // Stepper & badges
    noSourceFileBadge:
      "Información: archivo fuente no importado",
    incompleteBadge: "Incompleto",
    completedBadge: "Completado",
    stepInProgress: "Paso en curso",
    mediaAttached: "Fuente disponible",
    titleFilled: "Título introducido",
    titleRequired: "Título obligatorio",
    subtitlesAndDocs:
      "Subtítulos y enriquecimientos",
    draftOrPublic:
      "Borrador, restringido o público",

    // Details step
    titleLabel: "Título",
    titlePlaceholder: "Título del vídeo",
    titleHelper:
      "Un título lo más breve y preciso posible, que refleje el tema principal / contexto de este contenido.",
    descriptionLabel: "Descripción",
    descriptionPlaceholder:
      "Descripción del vídeo en español",
    descriptionHelper:
      "Describa su contenido, añada toda la información necesaria y dé formato al resultado.",
    mainLanguageLabel: "Idioma principal",
    mainLanguageHelper:
      "El idioma utilizado principalmente en este contenido.",
    thumbnailLabel: "Miniaturas",
    uploadThumbnailBtn:
      "+ Importar una miniatura",
    thumbnailDimensionsHint:
      "JPG o PNG · Recomendado: 1280 × 720 px",
    thumbnailCopyrightHelper:
      "La miniatura debe respetar las normas de la comunidad. Asegúrese de que la imagen tiene los derechos de autor adecuados.",
    changeBtn: "Cambiar",
    deleteBtn: "Eliminar",
    ownerLabel: "Propietario",
    ownerHelper:
      "Un superusuario puede cambiar el propietario de un vídeo.",
    coOwnersLabel: "Propietarios adicionales",
    coOwnersHelper:
      "Los propietarios adicionales tendrán los mismos derechos que usted, excepto que no podrán eliminar este contenido.",
    licenseLabel: "Licencia",
    licenseHelper:
      "Derechos de uso de su contenido.",
    channelLabel: "Canal",
    channelHelper:
      "Tiene permisos para asociar este vídeo a un canal.",
    noneOption: "Ninguno",
    themesLabel: "Temas",
    themesHelper:
      "Puede seleccionar uno o varios temas relacionados con el canal.",
    dateToDeleteLabel: "Fecha de eliminación",
    dateToDeleteHelper:
      "Fecha programada para eliminar el vídeo.",
    dateOfEventLabel: "Fecha del evento",
    dateOfEventHelper:
      "Fecha del evento relacionado con este vídeo.",
    publicationDateLabel:
      "Fecha y hora de publicación programada",
    publicationDateHelper:
      "Defina una fecha/hora futura en la que el vídeo se hará público.",
    statusLabel: "Estado del vídeo",
    themesPlaceholder:
      "Seleccione uno o varios temas",

    // Import step
    importHeaderTitle: "Añadir un archivo de vídeo",
    importHeaderSub:
      "Gestione el vídeo fuente y la codificación de su contenido multimedia.",
    noSourceWarningTitle:
      "Ficha vacía sin fuente de vídeo",
    noSourceWarningDesc:
      "Este vídeo todavía no tiene un archivo fuente asociado. Puede completar los metadatos (título, descripción, etc.), pero debe añadir un vídeo a continuación antes de poder publicarlo.",
    publicNoSourceAlert:
      "Ha seleccionado el estado Público, pero no se ha importado ningún archivo fuente. La importación es obligatoria para la publicación pública.",
    selectVideoFile:
      "Seleccione un archivo de vídeo de su ordenador. Se iniciará automáticamente un nuevo proceso de codificación.",
    addVideoFileBtn: "Añadir el vídeo",

    // Video elements step
    elementsHeaderSub:
      "Enriquezca su vídeo con subtítulos, documentos y colaboradores.",
    subtitlesTitle: "Subtítulos manuales",
    subtitlesDesc:
      "Añada archivos de subtítulos (.vtt, .srt) en uno o varios idiomas.",
    documentsTitle: "Documentos adjuntos",
    documentsDesc:
      "Asocie archivos PDF, presentaciones u otros documentos descargables.",
    contributorsTitle:
      "Colaboradores y participantes",
    contributorsDesc:
      "Añada autores, realizadores o participantes a su vídeo.",
    chaptersTitle: "Capitular el vídeo",
    chaptersDesc:
      "Divida el vídeo en capítulos mediante marcadores de tiempo.",
    dressingTitle: "Aplicar diseño al vídeo",
    dressingDesc:
      "Aplique un diseño (marca de agua, introducción / cierre).",
    position: "Posición de la marca de agua",
    opacity: "Opacidad de la marca de agua",
    trimTitle: "Recortar el vídeo",
    trimDesc:
      "Defina un punto de entrada y salida para acortar el vídeo.",
    chaptersDialogTitle:
      "Capítulos del vídeo",

    // Visibility step
    visibilityHeaderSub:
      "Elija cuándo publicar su vídeo y quién puede verlo.",
    restrictionsHeader: "Restricciones",
    restrictionsSub:
      "Elija si desea que su vídeo sea público, no listado o privado.",
    draftPrivateTitle: "Borrador / Privado",
    draftPrivateDesc:
      "En modo «Borrador / Privado», el contenido no aparece en ningún lugar y nadie excepto usted puede verlo.",
    restrictedTitle: "Acceso restringido",
    restrictedDesc:
      "En modo «Acceso restringido», puede elegir las restricciones para el vídeo.",
    publicTitle: "Público",
    publicDesc:
      "En modo «Público», el contenido es visible para todo el mundo.",
    noSourceDraftNotice:
      "Sin un archivo fuente, solo se permiten los modos Borrador / Privado. Los modos Acceso restringido y Público están desactivados.",
    restrictionOptions:
      "Opciones de restricción:",
    authRequiredLabel:
      "Autenticación obligatoria",
    authRequiredHelper:
      "Limitar el acceso a personas autenticadas.",
    authUserOnly:
      "Reservado a usuarios autenticados.",
    passwordRequiredLabel:
      "Contraseña obligatoria",
    passwordLabel:
      "Contraseña del vídeo",
    diffusionTitle:
      "Configuración de la difusión",
    allowDownloadLabel:
      "Permitir la descarga",
    allowDownloadHelper:
      "Permitir la descarga de su vídeo.",
    disableCommentsLabel:
      "Desactivar los comentarios",
    disableCommentsHelper:
      "Desactivar la posibilidad de añadir comentarios debajo del vídeo.",
    advancedOptionsTitle:
      "Opciones avanzadas",
    is360Label:
      "Se trata de un vídeo 360°",
    is360Helper:
      "Activar el reproductor 360° para este vídeo.",
    passwordKeepHelper:
      "Déjelo vacío para no modificar la contraseña existente.",

    // Messages & validation
    fillRequiredFields:
      "Complete los campos obligatorios antes de continuar: {fields}.",
    fillRequiredFieldsStep:
      "Complete los campos obligatorios del paso «{step}» antes de continuar: {fields}.",
    restrictedNeedsOption:
      "Para un estado restringido, seleccione al menos una restricción.",
    noPermission:
      "No tiene permisos para modificar este vídeo.",
    loginRequired:
      "Debe iniciar sesión para modificar este vídeo.",
    updateSuccess:
      "¡Vídeo actualizado correctamente!",

    // Subtitles
    addSubtitle: "Añadir un subtítulo",
    noSubtitles: "No se ha añadido ningún subtítulo.",
    subtitleFileHint:
      "Seleccione un archivo .vtt o .srt",
    addSubtitleBtn:
      "Añadir el subtítulo",
    cannotAddSubtitle:
      "No se puede añadir un subtítulo a este vídeo.",
    selectSubtitleFile:
      "Seleccione un archivo de subtítulos.",

    // Source change
    changeSourceTitle:
      "Cambiar la fuente del vídeo",
    changeSourceDesc:
      "Sustituya el archivo fuente de este vídeo. Se iniciará un nuevo proceso de codificación.",
    selectNewVideoFile:
      "Seleccionar un nuevo archivo de vídeo",
    replaceSourceBtn:
      "Sustituir la fuente",
    changeSourceError:
      "Error al cambiar la fuente.",
    sourceUpdated:
      "Fuente del vídeo actualizada. Se ha iniciado la recodificación.",
  },

  favorites: {
    title: "Mis vídeos favoritos",
    startPlaylist:
      "Iniciar la lista de reproducción",
    noFavorites:
      "No hay vídeos favoritos actualmente.",
    noMatchingFilters:
      "Ningún vídeo coincide con sus filtros.",
    favoriteUpdateError:
      "Se ha producido un error al actualizar los favoritos.",
  },

  playlists: {
    // Titles & labels
    myTitle: "Mis listas de reproducción",
    playlists: "Listas de reproducción",
    playlist: "Lista de reproducción",
    nowPlaying: "Reproduciendo",
    notFound:
      "Lista de reproducción no encontrada.",
    unableToLoad:
      "No se puede cargar la lista de reproducción",
    backToMyPlaylists:
      "Volver a mis listas de reproducción",

    // Creation & editing
    addPlaylist:
      "Añadir una lista de reproducción",
    addThePlaylist:
      "Añadir la lista de reproducción",
    editPlaylist:
      "Editar la lista de reproducción",
    seePlaylist:
      "Ver la lista de reproducción",
    playlistCreated:
      "La lista de reproducción se ha creado correctamente.",
    playlistUpdated:
      "¡Lista de reproducción actualizada correctamente!",
    noPermissionToEditPlaylist:
      "No tiene permisos para modificar esta lista de reproducción.",

    // Deletion
    delete:
      "Eliminar la lista de reproducción",
    deleteConfirm:
      "¿Está seguro de que desea eliminar esta lista de reproducción?",
    deleteSuccess:
      "La lista de reproducción se ha eliminado correctamente.",

    // Empty lists
    noVideos:
      "No hay vídeos en esta lista de reproducción",
    noPlaylists:
      "Todavía no tiene ninguna lista de reproducción.",
    noMatchingFilters:
      "Ninguna lista de reproducción coincide con sus filtros.",
    noPublicPlaylists:
      "No hay listas de reproducción disponibles actualmente.",

    // Errors
    creationError:
      "Se ha producido un error al crear la lista de reproducción.",
    deleteError:
      "Se ha producido un error al eliminar la lista de reproducción.",
    playlistUpdateError:
      "Se ha producido un error al actualizar la lista de reproducción.",

    // Visibility
    passwordProtected:
      "Lista de reproducción protegida por contraseña",
    private:
      "Lista de reproducción privada",

    // Form
    titleHelper:
      "Dé un título breve y claro a su lista de reproducción.",
    descriptionHelper:
      "Describa el contenido y/o el contexto de su lista de reproducción.",
    accessRestrictions:
      "Restricciones de acceso",
    protectWithPassword:
      "Proteger mi lista de reproducción con una contraseña",
    addPassword:
      "Añadir una contraseña",
    passwordLabel:
      "Contraseña de la lista de reproducción",
    passwordHelper:
      "Añada una contraseña para acceder a la lista de reproducción.",
    visibleToAll:
      "Su lista de reproducción será visible para todos los usuarios.",
    visibleToOwner:
      "Su lista de reproducción solo será visible para usted.",
    defaultSort:
      "Orden predeterminado",
    defaultSortLabel:
      "Orden predeterminado de visualización de los vídeos.",
    defaultSortHelper:
      "Elija el orden de visualización de los vídeos.",
    publicPlaylist:
      "Lista de reproducción pública",
  },

  channels: {
    // General
    title: "Canales",
    content: "Contenido del canal",
    unclassified: "Vídeos sin clasificar",

    // Empty lists
    noChannels:
      "No hay canales disponibles actualmente.",
    noMatchingFilters:
      "Ningún canal coincide con sus filtros.",
    noContent:
      "Este canal no tiene vídeos ni temas asociados.",
    noTheme:
      "Este canal no tiene ningún tema asociado.",
    noThemes:
      "Ningún tema coincide con sus criterios de búsqueda.",
    noVideos:
      "Este canal no tiene ningún vídeo asociado.",
  },

  dressingPage: {
    title: "Diseños y marcas de agua de vídeo",
    pageDescription:
      "Gestione sus marcas de agua y elementos visuales para integrarlos directamente en sus vídeos.",
    myWatermarks:
      "Mis marcas de agua",
    addWatermark:
      "Añadir una marca de agua",
    uploading: "Enviando…",
    noWatermarks:
      "Todavía no ha enviado ninguna marca de agua.",
    deleteConfirm:
      "¿Está seguro de que desea eliminar esta marca de agua?",
    loadError:
      "Error al cargar las marcas de agua.",
    uploadError:
      "Error al cargar la imagen",
  },

  // === Page metadata ===
  titles: {
    // Page titles
    platform: "Plataforma de vídeo Esup-Pod",
    login: "Iniciar sesión | Esup-Pod",
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
    videos:
      "Descubra todos los vídeos públicos de la plataforma Esup-Pod.",
    watchVideo:
      "Ver el vídeo en Esup-Pod",
  },
};

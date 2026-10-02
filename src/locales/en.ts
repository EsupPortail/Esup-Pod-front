import type { TranslationKeys } from "./fr";

export const en: TranslationKeys = {
  // === Commun ===
  common: {
    // Actions
    close: "Close",
    save: "Save",
    cancel: "Cancel",
    back: "Back",
    update: "Update",
    delete: "Delete",
    edit: "Edit",
    add: "Add",
    addVideo: "Add a video",
    search: "Search",
    selectAll: "Select all",
    stayOnPage: "Stay on page",
    leaveWithoutSaving: "Leave without saving",

    // Statut & connexion
    login: "Log in",
    logout: "Log out",
    connected: "Connected",
    disconnected: "Disconnected",
    loading: "Loading…",
    error: "An error occurred",

    // Navigation
    home: "Home",
    selectionReturn: "Return to selection",
    goToMainContent: "Go to main content",
    backToHomepage: "Back to homepage",
    tab: "Dashboard",
    commingSoon: "Coming soon",

    // Entités (singulier / pluriel)
    video: "Video",
    videos: "Videos",
    collection: "Collection",
    collections: "Collections",
    channel: "Channel",
    channels: "Channels",
    playlist: "Playlist",
    playlists: "Playlists",
    theme: "Theme",
    themes: "Themes",
    subtopic: "Subtopic",
    subtopics: "Subtopics",
    discipline: "Discipline",
    disciplines: "Disciplines",
    series: "Series / Programme",
    allVideos: "All videos",
    direct: "Live",
    directs: "Live streams",
    view: "view",
    views: "views",

    // Affichage, recherche & pagination
    displayMode: "Display:",
    viewCards: "Cards",
    viewTable: "Table",
    videosFound: "video(s) found",
    found: "{count, plural, one {Found} other {Found}}",
    noResults: "No results for your search",
    paginationInfo:
      "Displaying {start} to {end} of {count, plural, one {# video{pageInfo}} other {# videos{pageInfo}}}",
    paginationPage: " (Page {page} of {pagesCount})",
    opacity: "Opacity",

    // Métadonnées
    createdBy: "Created by",
    latestUpdate: "Updated on:",
    contributors: "Contributors & Speakers",
    addContributorsDesc: "Add authors, directors or speakers to your video.",
    infos: "Information",
    configBase: "Configure the basic settings",

    // Visibilité
    public: "Public",
    private: "Private",
    passwordProtected:
      "You have enabled password protection. Please enter a password.",

    // Validation & confirmations
    titleRequired: "Title is required",
    descRequired: "Description is required.",
    permanentAction: "This action is permanent.",
    unsavedChangesLeaveConfirmation:
      "You have unsaved changes. Are you sure you want to leave this page?",
    unsavedChangesTitle: "Unsaved changes",

    // Divers
    recently: "Recently",
    default: "Default",
  },
  errors: {
    // Général
    error: "An error occurred",
    update: "Update error",
    save: "Saving error",
    create: "Creation error",
    loadError: "Loading error",
    loadConfig: "Error while loading the configuration",
    loadInfo: "Error while loading the information",
    notFound: "Page not found",
    notFoundDesc:
      "The page you are looking for does not exist or has been deleted.",
    serverError: "Server error",
    serverErrorDesc: "A server-side error occurred. Please try again later.",
    notConnected: "User not logged in",
    error401: "Unauthorized access (401). Please log in.",
    notConfigured:
      "The requested page does not exist or has not yet been configured for this institution.",
    formFieldsError:
      "{count, plural, =1 {Please correct the following field: {fields}.} other {Please correct the following # fields: {fields}.}}",
    savingFormError: "Error while saving the form",
    accessDenied: "You cannot access this page",

    // Vidéos
    loadErrorVideo: "Error while loading the video",
    loadErrorVideos: "Error while loading videos {status}.",
    deleteErrorVideo: "An error occurred while deleting the video",
    dupErrorVideo: "An error occurred while duplicating the video",

    // Images
    chooseImage: "Please choose an image",
    imageSendError: "Failed to send the image",
    imageDeleteError: "Failed to delete the image",

    // Pages & sections
    loadPage: "Error while loading the page",
    getBlocks: "Error while retrieving layout blocks.",
    unableToSection: "Unable to load this application section",
    unableToTheme: "Unable to load this theme.",

    // Chaînes & thèmes
    getChannels:
      "Error while retrieving {count, plural, one {the channel} other {the channels}}",
    getThemeError:
      "Error while retrieving {count, plural, one {the theme} other {the themes}}",

    // Mots-clés
    tagsLoadError: "Error while loading keywords: {error}",
    noKeywords: "No keywords available at the moment.",

    // Sous-titres
    addSubtitleError: "Error while adding the subtitle",
    deleteSubtitleError: "Error while deleting the subtitle",

    // Playlists
    loadPlaylist:
      "Error while loading {count, plural, one {the playlist} other {the playlists}}.",
    updatePlaylist: "Error while updating the playlist",
    deletePlaylist: "Error while deleting the playlist",
    addVideoToPlaylist: "Error while adding the video to the playlist",
    deleteVideoFromPlaylist: "Error while removing the video from the playlist",

    // Favoris
    loadFavorites: "Error while loading favorites",
    addFavorite: "Error while adding the video to favorites",
    deleteFavorite: "Error while removing the video from favorites",

    // Commentaires & votes
    loadComments: "Error while loading comments",
    addComment: "Error while adding the comment",
    deleteComment: "Error while deleting the comment",
    addVote: "Error while adding the vote",

    // Chapitres
    loadChapters: "Error while loading chapters",
    addChapter: "Error while adding the chapter",
    deleteChapter: "Error while deleting the chapter",
  },
  pending: {
    sending: "Sending…",
    deleting: "Deleting…",
    updating: "Updating…",
    loading: "Loading…",
    encoding: "Encoding…",
    processing: "Processing…",
    saving: "Saving…",
    publishing: "Publishing…",
  },
  providers: {
    // Hooks de contexte
    auth: "useAuth must be used within an AuthProvider.",
    sidebar: "useSidebar must be used within a SidebarProvider.",
    playlistCreation:
      "usePlaylistCreationContext must be used within a PlaylistCreationProvider.",
    cunninghamTheme:
      "useCunninghamTheme must be used within a CunninghamStyleProvider.",

    // Erreurs
    getChannels:
      "Error while retrieving {count, plural, one {the channel} other {the channels}}",
  },
  a11y: {
    // Logos
    institutionLogo: "Institution logo",
    homeLogo: "Esup-Pod logo, back to home",
    facebookLogo: "Facebook logo",
    xLogo: "X logo",
    linkedinLogo: "LinkedIn logo",
    blueskyLogo: "Bluesky logo",
    mastodonLogo: "Mastodon logo",

    // Bannières, logos & vignettes
    channelBanner: "Banner of channel {title}",
    channelLogo: "Logo of channel {title}",
    themeBanner: "Banner of theme {title}",
    videoThumbnail: "Thumbnail of video {title}",
    collectionThumbnail: "Thumbnail of collection {title}",
    playlistThumbnail: "Thumbnail of playlist {title}",
    thumbnail: "Thumbnail",
    preview: "Preview",
    watermark: "Watermark",

    // Photo de profil
    profilePreview: "Profile picture preview",
    currentProfilePicture: "Current profile picture",
    changeProfilePicture: "Change my profile picture",
    deleteProfilePicture: "Delete current profile picture",
    newProfilePictureSuccess: "Profile picture updated successfully",
    deleteProfilePictureSuccess: "Profile picture deleted successfully",
    noProfilePicture: "You do not have a profile picture yet.",
    chooseImage: "Please select an image",

    // Import de vidéo
    importVideo: "Import a video",
    chooseFile: "Please select a video file",
    chooseVideo: "Select this video",
    chooseVideoOrAudioFile: "Choose an audio or video file",
    supportedFormats: "Supported formats: ",
    fileSizeLimit: "The file size must be <bold>less than {maxSize} GB.</bold>",
    uploadTimeInfo:
      "Upload time depends on the size of your file and your download speed.",
    uploadWarning:
      "During the upload, do not close your browser until you receive a success or failure message.",
    videoProcessingMessage:
      "Your video is being processed. Do not close the page…",
    skipImportCreateEmpty: "Skip import (Create an empty record)",
    createEmptyRecord: "Create an empty record",
    emptyRecordWarning:
      "You are about to create a video record without a source media file. You can add the source video later from the <b>“Import”</b> step of the editing page.",
    clearDescriptiveTitle: "Enter a clear and descriptive title.",

    // Conditions d’utilisation & propriété intellectuelle
    termsOfUse: "Terms of use",
    acceptTermsRequired: "Please accept the terms of use.",
    intellectualPropertyWarning:
      "Warning! Make sure you comply with intellectual property law before publishing a video:",
    intellectualPropertyAcknowledgement:
      "I certify that I comply with intellectual property law when publishing my video.",
    publicationAuthorizations:
      "I confirm that I have the necessary signed authorizations from the parties concerned by the publication of this media, including consent regarding image rights and the processing of personal data. I certify that all persons concerned have been fully informed about the processing of their personal data, in accordance with Articles 13 and 14 of the GDPR.",

    // Contrôles & menus
    collectionsDisplayMode: "Collections display mode",
    videosDisplayMode: "Videos display mode",
    videoActions: "Video actions",
  },

  // === Données de référence ===
  languages: {
    fr: "French",
    en: "English",
    es: "Spanish",
  },
  cursus: {
    "0": "Other",
    L1: "Bachelor's Year 1",
    L2: "Bachelor's Year 2",
    L3: "Bachelor's Year 3",
    M1: "Master's Year 1",
    M2: "Master's Year 2",
    D: "PhD",
  },
  type: {
    cours: "Course",
    conference: "Conference",
    tutoriel: "Tutorial",
    colloque: "Symposium",
    seminaire: "Seminar",
    interview: "Interview",
    autre: "Other",
  },
  discipline: {
    informatique: "Computer Science",
    droit: "Law",
    medecine: "Medicine",
    sciences: "Science",
    histoire: "History",
    langues: "Languages",
  },

  // === Mise en page ===
  navbar: {
    searchPlaceholder: "Search…",
    addVideo: "Add a video",
    settings: "Display and accessibility",
    login: "Log in",
    myProfileImage: "Change my profile picture",
    administration: "Administration",
    openProfileMenu: "Open profile menu",
    closeSearch: "Close search",
  },
  sidebar: {
    // Navigation
    mainMenu: "Main menu",
    closeMenu: "Close menu",
    browseVideos: "Browse videos",
    mySpace: "My space",
    dashboard: "My dashboard",
    myFavorites: "My favorite videos",
    favorites: "Favorite videos",
    myPlaylists: "My playlists",
    playlists: "Playlist",
    videoBranding: "Branding & Watermarks",

    // Accueil & lecture
    welcome: "Welcome",
    welcomeUser: "Welcome {name}!",
    nowPlaying: "Now playing",
  },
  footer: {
    legalNotice: "Legal notice",
    accessibilityPartially: "Accessibility: Partially compliant",
    siteMap: "Sitemap",
    esupProject: "Esup-Pod Project",
    esupPortal: "Esup portal",
    videoPlatform: "Video platform",
  },

  // === Pages & fonctionnalités ===
  home: {
    welcomeSubtitle: "Welcome to your POD platform!",
    welcomeIntro:
      "Video is an excellent medium for communicating, teaching and learning. Here are some uses that might interest you.",
    howToTitle: "How does it work?",
    howToDescPrefix: "Would you like to upload your own content? This ",
    quickGuideLink: "quick start guide",
    howToDescSuffix: " will introduce you to Pod's basic features.",
    btnUsePod: "Use Pod",
    btnHowTo: "How does it work",
    btnCopyright: "Copyright",
    latestVideos: "Latest published videos",
    btnAllVideos: "Show all videos",
    videoServiceError: "The video service is temporarily unavailable",
    noRecentVideos: "No recent public videos",
  },
  auth: {
    loginTitle: "Log in to my POD profile",
    loginRequired: "You must be logged in to access this page.",
    username: "Username",
    usernameRequired: "Username is required",
    password: "Password",
    passwordRequired: "Password is required",
    submitLogin: "Log in",
    unknownUser: "Unknown user",
    passwordMinLength: "The password must contain at least {min} characters.",
    loginSuccess: "You are now logged in.",
    logoutSuccess: "You are now logged out.",
  },
  webtv: {
    webtv: "WebTV",
    liveTitle: "Live",
    noLive: "No live stream currently",
    loadingContent: "Loading WebTV content…",
    noContent: "No content available",
    climateActu: "News: Climate",
    seriesEmission: "Series / Programmes",
    actuCollections: "News collections",
    latestCollections: "Latest collections",
    mostViewed: "Most viewed videos",
    searchContent: "Search for content",
  },
  blocks: {
    // Bloc Collections
    collectionTitle: "General collections block",
    collectionDescription:
      "Displays a configurable selection of collections (channels, themes, playlists).",
    collectionTypeLabel: "Type of collection to display",
    collectionTypeChannels: "Channels",
    collectionTypeThemes: "Themes (Categories)",
    collectionTypeAll: "All collections",
    collectionIdsLabel:
      "IDs or slugs of collections to display (comma-separated)",
    collectionSortCreated: "Creation date (Newest)",

    // Bloc Texte personnalisé
    customTextDescription: "Displays a custom paragraph or content.",
    customTextContentLabel: "Text or HTML content",

    // Bloc Directs
    liveDescription:
      "Displays the list of ongoing live streams with a red active indicator.",
    liveSortLabel: "Live stream sort order",
    liveSortStartUpcoming: "Start date (Upcoming)",
    liveSortStartRecent: "Start date (Most recent)",
    liveSortPopularity: "Popularity (Number of viewers)",

    // Bloc Grille de vidéos
    videoGridTitle: "Video grid block",
    videoGridDescription: "Displays a configurable row or grid of video cards.",
    videoGridSortLabel: "Video sort order",
    videoGridSortLatest: "Latest added",
  },
  preferences: {
    settingsHeader: "Settings",
    title: "Display and accessibility",
    dressing: "Watermarks",
    languageSectionTitle: "Application language",
    languageSelectLabel: "Choose the interface language:",
    themeSectionTitle: "Visual theme",
    darkModeLabel: "Dark mode",
    lightModeLabel: "Light mode",
  },
  filters: {
    // Recherche
    searchPlaceholder: "Search for a video…",
    search: "Search",
    advancedFilters: "Advanced filters",
    showResults: "Show",
    clearFilters: "Clear filters",

    // Critères
    author: "Author",
    types: "Types",
    cursus: "Education level",
    keywords: "Keywords",

    // Tri
    sort: "Sort",
    newest: "Newest",
    oldest: "Oldest",
    titleAZ: "Title A-Z",
    titleZA: "Title Z-A",

    // Dates
    creationDate: "Creation date",
    activeCreationDate: "Date (active filter)",
    selectPeriod: "Select a period",
    createdAfter: "Created after",
    createdBefore: "Created before",
  },
  bulk: {
    // Général
    title: "Bulk edit",
    checkVideosPrompt: "Select videos to enable actions",
    chooseAction: "Choose an action…",
    deselectAll: "Deselect all",
    modalTitle: "Bulk edit: {action}",
    newValueFor: "New value for:",
    affectedVideos: "Affected videos ({count})",
    confirmEdit: "Confirm the change",
    unavailableForSelection: "Not available for this selection",
    encodingInProgressTooltip:
      "Some videos are currently being encoded. Actions requiring complete encoding are disabled.",
    encodingWarning: "Warning: some videos are currently being encoded.",
    errorBadge: "Error",

    // Modification
    editGroup: "EDIT VIDEOS",
    changeType: "Change type",
    changeChannel: "Change channel",
    editDescription: "Edit description",
    changeLicense: "Change license",
    setEventDate: "Set event date",
    addReplaceKeywords: "Add / Replace keywords",
    changeDiscipline: "Change discipline",
    changeCursus: "Change education level",
    keywordsHelper:
      "Separate keywords with commas. They will replace the existing keywords.",

    // Visibilité & options
    publishUnpublish: "Publish / Unpublish",
    restrictAuth: "Restrict to logged-in members",
    allowDownloading: "Allow / Disable downloading",
    disableComments: "Enable / Disable comments",
    scheduleDeletion: "Schedule automatic deletion",
    scheduleDeletionNotice:
      "The video will be automatically deleted on the chosen date.",

    // Suppression
    dangerZone: "DANGER ZONE",
    deleteSelected: "Delete selected videos",
    confirmDelete: "Confirm deletion",
    deleteWarning: "You are about to permanently delete the selected videos.",
    deletePermanently: "Delete permanently",

    // Licences
    licenseCopyright: "Copyright / All rights reserved",
    licenseCcByNcSa: "CC BY-NC-SA — Share alike, no commercial use",
    licenseCcBySa: "CC BY-SA — Share alike",

    // Options de valeur
    optionPublic: "Public — visible to everyone",
    optionPrivate: "Private — draft, not visible",
    optionAuthYes: "Yes — login required to access",
    optionAuthNo: "No — accessible without logging in",
    optionDownloadYes: "Yes — allow downloading",
    optionDownloadNo: "No — disable downloading",
    optionCommentsOn: "Enable comments",
    optionCommentsOff: "Disable comments",

    // Retours
    deleteSuccess:
      "{count, plural, one {# video deleted} other {# videos deleted}} successfully.",
    updateSuccess:
      "{count, plural, one {# video updated} other {# videos updated}} successfully.",
    actionError: "An error occurred while running the bulk action.",
    errorPublishNotEncoded:
      "Not possible: one or more selected videos have not been encoded yet. Wait for encoding to finish before changing the publication status.",
    errorRestrictNotEncoded:
      "Not possible: access restriction can only be set on fully encoded videos.",
    errorDownloadNotEncoded:
      "Not possible: downloading can only be configured on encoded videos.",
    errorCommentsNotEncoded:
      "Not possible: comment settings only apply to encoded videos.",
  },
  table: {
    // Colonnes
    title: "Title",
    duration: "Duration",
    dateAdded: "Date added",
    status: "Status",

    // Visibilité
    public: "Public",
    restricted: "Restricted",
    password: "Password",
    privateVideo: "Private video",
    passwordProtectedVideo: "Password-protected video",

    // États d’encodage
    pendingEncoding: "Video awaiting encoding",
    encodingCompleted: "Encoding completed",
    encodingError: "Encoding error",

    // Résultats
    noVideosFound: "No videos found.",
  },
  videoAction: {
    edit: "Edit video",
    duplicate: "Duplicate",
    duplicating: "Duplicating…",
    delete: "Delete video",
    deleteConfirm: "Are you sure you want to delete the video “{title}”?",
  },
  videoPlayer: {
    unableToLoad: "Unable to load the video.",
    unableToDownload: "Unable to download the video.",
    encodingInProgress: "Video encoding in progress…",
    retry: "Retry",
  },
  videoDressing: {
    // Habillage
    dressing: "Video dressing",
    title: "Video Dressing",
    unique: "Unique dressing",
    loading: "Loading video dressing...",
    noDressing: "No video dressing configured.",
    noConfig: "No configuration available.",

    // Éléments
    watermark: "Watermark",
    opacity: "Opacity",
    start: "Start",
    end: "End",
    addWatermark: "Add a watermark",

    // Actions & retours
    create: "Create",
    creation: "Create video dressing",
    successCreate: "Video dressing created successfully.",
    errorUpdate: "Error while updating video dressing.",
  },
  videoPage: {
    // Actions
    back: "Back",
    share: "Share",
    playlist: "Playlist",
    favorite: "Favorite",
    report: "Report",
    editVideo: "Edit video",
    addToPlaylist: "Add to a playlist",
    copyLink: "Copy link",
    linkCopied: "Link copied!",
    seeMore: "See more",
    seeLess: "See less",
    download: "Download",
    chooseQuality: "Choose the quality:",
    shareOn: "Share on",

    // Informations
    about: "About",
    type: "Type",
    channel: "Channel",
    channelWithId: "Channel {id}",
    creator: "Creator",
    mainLanguage: "Main language",
    keywords: "Keywords",
    keywordsloading: "Loading keywords…",
    discipline: "Discipline(s)",
    contributors: "Speakers",
    license: "License",
    cursus: "Education level",
    eventDate: "Event date",
    resources: "Resources",
    updatedAt: "Updated on:",
    views: "views",
    none: "None",

    // États & messages
    notFound: "Video not found.",
    noPlaylistsAvailable: "No playlists available",
    protectedByPassword: "This video is password protected.",
    unlock: "Unlock video",
    unlocking: "Unlocking…",
    videoAddedToPlaylist: "Video added to playlist “{title}”.",
    videoRemovedFromPlaylist: "Video removed from playlist “{title}”.",
    videoAddedToFavorites: "Video added to your favorites.",
    videoRemovedFromFavorites: "Video removed from your favorites.",
  },
  contributors: {
    // Formulaire
    defaultRole: "Director",
    searchLabel: "Search for a contributor…",
    roleLabel: "Role",
    functionLabel: "Function / Title",

    // Messages
    addError:
      "Unable to add this contributor (maybe already added with this role?)",
    noContributors: "No contributor associated.",
  },
  documents: {
    // Formulaire
    addTitle: "Add a document",
    titleLabel: "Document title",
    dropzone: "Drag and drop a file here",
    selectedFile: "Selected file:",
    privateLabel: "Private document (visible only to the owner and co-owners)",
    addBtn: "Add the document",

    // Liste
    loading: "Loading documents…",
    addedOn: "{title} - Added on {date}",
    private: "Private",
    noDocuments: "No document is attached to this video at the moment.",

    // Messages
    fillTitleAndFile: "Please enter a title and select a file.",
    uploadError: "Error while uploading the document.",
    deleteConfirm: "Do you really want to delete this document?",
    deleteError: "Error while deleting.",
    loadError: "Unable to load the documents.",
  },
  chapters: {
    // Ajout
    addTitle: "Add a chapter",
    titleLabel: "Chapter title",
    titlePlaceholder: "E.g.: Introduction, Demo, Conclusion…",
    captureMoment: "Capture this moment",
    captureTooltip: "Copies the current time into the Time field",

    // Liste
    noChapters:
      "No chapters. Play the video and click <bold>Capture this moment</bold> to add an entry.",
    goToMoment: "Click to go to this moment",
    deleteChapter: "Delete this chapter",

    // Messages
    titleRequired: "Please enter a title.",
    timestampTooLong: "The timestamp exceeds the video duration ({duration}).",
    playerUnavailable:
      "The player will be available once encoding is complete. You can enter the timestamps manually.",
  },
  comments: {
    // Liste
    title: "Comments",
    count: "{count} comment",
    countPlural: "{count} comments",
    noCommentsYet: "No comments yet.",
    disabled: "Comments are disabled for this video.",
    loginToComment: "Log in to add a comment.",

    // Saisie
    addPlaceholder: "Add a comment",
    submit: "Comment",
    submitting: "Publishing…",
    yourReply: "Your reply",

    // Actions
    reply: "Reply",
    delete: "Delete",
    voteForComment: "Vote for this comment",
    liked: "You like this comment",

    // Réponses
    hideReplies: "Hide replies",
    showReplies: "{count} reply",
    showRepliesPlural: "{count} replies",
  },
  socialNetworks: {
    unableToLoad: "Unable to load social networks.",
    loading: "Loading social networks…",
    errorSaveSocial: "An error occurred while saving the social network.",
    saved: "Social network saved successfully.",
    authorizedShare: "Social network authorized for sharing.",
    choice: "Select a social network",
  },
  videoEdit: {
    // En-tête & actions
    pageTitle: "Edit video “{title}”",
    pageTitleDefault: "Edit video",
    duplicate: "Duplicate",
    save: "Save",
    quit: "Leave page",
    previous: "Previous",
    next: "Next",
    requiredFieldsPrompt: "Fields marked with * are required.",

    // Étapes
    stepImport: "Import",
    stepDetails: "Details",
    stepElements: "Video Elements",
    stepVisibility: "Visibility",

    // Stepper & badges
    noSourceFileBadge: "Information: Source file not imported",
    incompleteBadge: "Incomplete",
    completedBadge: "Completed",
    stepInProgress: "Step in progress",
    mediaAttached: "Source available",
    titleFilled: "Title entered",
    titleRequired: "Title required",
    subtitlesAndDocs: "Subtitles & enrichments",
    draftOrPublic: "Draft, restricted or public",

    // Étape Détails
    titleLabel: "Title",
    titlePlaceholder: "Video title",
    titleHelper:
      "A title that is as short and precise as possible, reflecting the main subject / context of this content.",
    descriptionLabel: "Description",
    descriptionPlaceholder: "Video description in English",
    descriptionHelper:
      "Describe your content, add all necessary information, and format the result.",
    mainLanguageLabel: "Main language",
    mainLanguageHelper: "The language mainly used in this content.",
    thumbnailLabel: "Thumbnails",
    uploadThumbnailBtn: "+ Upload a thumbnail",
    thumbnailDimensionsHint: "JPG or PNG · Recommended: 1280 × 720 px",
    thumbnailCopyrightHelper:
      "The thumbnail must comply with community guidelines. Make sure you have the appropriate copyright.",
    changeBtn: "Change",
    deleteBtn: "Delete",
    ownerLabel: "Owner",
    ownerHelper: "A superuser can change the owner of a video.",
    coOwnersLabel: "Additional owners",
    coOwnersHelper:
      "Additional owners will have the same rights as you, except that they cannot delete this content.",
    licenseLabel: "License",
    licenseHelper: "Usage rights for your content.",
    channelLabel: "Channel",
    channelHelper:
      "You have permission to associate this video with a channel.",
    noneOption: "None",
    themesLabel: "Themes",
    themesHelper: "You can select one or more themes related to the channel.",
    dateToDeleteLabel: "Deletion date",
    dateToDeleteHelper: "Scheduled deletion date for the video.",
    dateOfEventLabel: "Event date",
    dateOfEventHelper: "Date of the event related to this video.",
    publicationDateLabel: "Scheduled publication date and time",
    publicationDateHelper:
      "Set a future date/time when the video will become public.",
    statusLabel: "Video status",
    themesPlaceholder: "Select one or more themes",

    // Étape Importation
    importHeaderTitle: "Add a video file",
    importHeaderSub: "Manage the source video and media encoding.",
    noSourceWarningTitle: "Empty record without video source",
    noSourceWarningDesc:
      "This video does not yet have an associated source file. You can complete the metadata (title, description, etc.), but you must add a video below before you can publish it.",
    publicNoSourceAlert:
      "You selected the Public status, but no source file has been imported. Import is required for public publication.",
    selectVideoFile:
      "Select a video file from your computer. A new encoding process will start automatically.",
    addVideoFileBtn: "Add video",

    // Étape Éléments vidéo
    elementsHeaderSub:
      "Enrich your video with subtitles, documents and contributors.",
    subtitlesTitle: "Manual subtitles",
    subtitlesDesc: "Add subtitle files (.vtt, .srt) in one or more languages.",
    documentsTitle: "Attached documents",
    documentsDesc:
      "Attach PDF files, slide decks or other downloadable documents.",
    contributorsTitle: "Contributors & Speakers",
    contributorsDesc: "Add authors, directors or speakers to your video.",
    chaptersTitle: "Add chapters",
    chaptersDesc: "Divide your video into chapters with time markers.",
    dressingTitle: "Brand the video",
    dressingDesc: "Apply branding (watermark, opening / closing sequence).",
    position: "Watermark position",
    opacity: "Watermark opacity",
    trimTitle: "Trim the video",
    trimDesc: "Set an entry and exit point to shorten the video.",
    chaptersDialogTitle: "Video chapters",

    // Étape Visibilité
    visibilityHeaderSub:
      "Choose when to publish your video and who can see it.",
    restrictionsHeader: "Restrictions",
    restrictionsSub:
      "Choose whether to make your video public, unlisted or private.",
    draftPrivateTitle: "Draft / Private",
    draftPrivateDesc:
      "In “Draft / Private” mode, the content does not appear anywhere and no one other than you can see it.",
    restrictedTitle: "Restricted access",
    restrictedDesc:
      "In “Restricted access” mode, you can choose restrictions for the video.",
    publicTitle: "Public",
    publicDesc: "In “Public” mode, the content is visible to everyone.",
    noSourceDraftNotice:
      "Without a source file, only Draft / Private modes are allowed. Restricted access and Public modes are disabled.",
    restrictionOptions: "Restriction options:",
    authRequiredLabel: "Authentication required",
    authRequiredHelper: "Limit access to authenticated users.",
    authUserOnly: "For authenticated users only.",
    passwordRequiredLabel: "Password required",
    passwordLabel: "Video password",
    diffusionTitle: "Streaming configuration",
    allowDownloadLabel: "Allow downloading",
    allowDownloadHelper: "Allow downloading your video.",
    disableCommentsLabel: "Disable comments",
    disableCommentsHelper: "Disable adding comments under your video.",
    advancedOptionsTitle: "Advanced options",
    is360Label: "This is a 360° video",
    is360Helper: "Enable the 360° player for this video.",
    passwordKeepHelper: "Leave empty to keep the existing password.",

    // Messages & validation
    fillRequiredFields:
      "Please fill in the required field(s) before continuing: {fields}.",
    fillRequiredFieldsStep:
      "Please fill in the required field(s) of the “{step}” step before continuing: {fields}.",
    restrictedNeedsOption:
      "For a restricted status, choose at least one restriction.",
    noPermission: "You do not have permission to edit this video.",
    loginRequired: "You must be logged in to edit this video.",
    updateSuccess: "Video updated successfully!",

    // Sous-titres
    addSubtitle: "Add a subtitle",
    noSubtitles: "No subtitles added.",
    subtitleFileHint: "Select a .vtt or .srt file",
    addSubtitleBtn: "Add the subtitle",
    cannotAddSubtitle: "Unable to add a subtitle to this video.",
    selectSubtitleFile: "Please select a subtitle file.",

    // Changement de source
    changeSourceTitle: "Change the video source",
    changeSourceDesc:
      "Replace the source file of this video. A new encoding process will be started.",
    selectNewVideoFile: "Select a new video file",
    replaceSourceBtn: "Replace the source",
    changeSourceError: "Error while changing the source.",
    sourceUpdated: "Video source updated. Re-encoding started.",
  },
  favorites: {
    title: "My favorite videos",
    startPlaylist: "Start playlist",
    noFavorites: "No favorite videos yet.",
    noMatchingFilters: "No videos match your filters.",
    favoriteUpdateError: "An error occurred while updating favorites.",
  },
  playlists: {
    // Titres & libellés
    myTitle: "My playlists",
    playlists: "Playlists",
    playlist: "Playlist",
    nowPlaying: "Now playing",
    notFound: "Playlist not found.",
    unableToLoad: "Unable to load the playlist",
    backToMyPlaylists: "Back to my playlists",

    // Création & édition
    addPlaylist: "Add a playlist",
    addThePlaylist: "Add the playlist",
    editPlaylist: "Edit playlist",
    seePlaylist: "View playlist",
    playlistCreated: "The playlist was created successfully.",
    playlistUpdated: "Playlist updated successfully!",
    noPermissionToEditPlaylist:
      "You do not have permission to edit this playlist.",

    // Suppression
    delete: "Delete playlist",
    deleteConfirm: "Are you sure you want to delete this playlist?",
    deleteSuccess: "The playlist has been deleted successfully.",

    // Listes vides
    noVideos: "No videos in this playlist",
    noPlaylists: "You do not have any playlists yet.",
    noMatchingFilters: "No playlists match your filters.",
    noPublicPlaylists: "No playlists available at the moment.",

    // Erreurs
    creationError: "An error occurred while creating the playlist.",
    deleteError: "An error occurred while deleting the playlist.",
    playlistUpdateError: "An error occurred while updating the playlist.",

    // Visibilité
    passwordProtected: "Password-protected playlist",
    private: "Private playlist",

    // Formulaire
    titleHelper: "Give your playlist a short, explicit title.",
    descriptionHelper: "Describe the content and/or context of your playlist.",
    accessRestrictions: "Access restrictions",
    protectWithPassword: "Protect my playlist with a password",
    addPassword: "Add a password",
    passwordLabel: "Playlist password",
    passwordHelper: "Add a password to access the playlist.",
    visibleToAll: "Your playlist will be visible to all users.",
    visibleToOwner: "Your playlist will be visible only to you.",
    defaultSort: "Default sort",
    defaultSortLabel: "Default video display order.",
    defaultSortHelper: "Choose the order in which videos are displayed.",
  },
  channels: {
    // Général
    title: "Channels",
    content: "Channel content",
    unclassified: "Unclassified videos",

    // Listes vides
    noChannels: "No channels available at the moment.",
    noMatchingFilters: "No channels match your filters.",
    noContent: "This channel has no associated videos or themes.",
    noTheme: "This channel has no associated themes.",
    noThemes: "No themes match your search criteria.",
    noVideos: "This channel has no associated videos.",
  },
  dressingPage: {
    title: "Video Branding & Watermarks",
    pageDescription:
      "Manage your watermarks and visual elements to embed them directly into your videos.",
    myWatermarks: "My Watermarks",
    addWatermark: "Add a watermark",
    uploading: "Uploading…",
    noWatermarks: "You have not uploaded any watermarks yet.",
    deleteConfirm: "Are you sure you want to delete this watermark?",
    loadError: "Error while loading watermarks.",
    uploadError: "Error while uploading the image",
  },

  // === Métadonnées des pages ===
  titles: {
    // Titres de pages
    platform: "Esup-Pod video platform",
    login: "Login | Esup-Pod",
    video: "Video | Esup-Pod",
    allVideos: "All videos - Esup-Pod",
  },
  descriptions: {
    dashboard: "Manage your videos and settings on your Esup-Pod dashboard.",
    login: "Log in to access your videos and personal space on Esup-Pod.",
    playlists:
      "Discover and manage the public playlists on the Esup-Pod platform.",
    videos: "Discover all the public videos on the Esup-Pod platform.",
    watchVideo: "Watch the video on Esup-Pod",
  },
};

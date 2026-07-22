export const getRoutes = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_BACK_URL ?? "http://pod.localhost:8000/";
  const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return {
    auth: {
      token: {
        create: url + "api/auth/token/",
        verify: url + "api/auth/token/verify/",
        refresh: url + "api/auth/token/refresh/",
      },
      user: {
        logout: url + "api/auth/logout-info/",
        data: url + "api/auth/users/me/",
        update: (id: number) => url + `api/auth/users/${id}/`,
        picture: (id: number) => url + `api/auth/owners/${id}/picture/`,
      },
    },
    video: {
      list: url + "api/videos/",
      me: url + "api/videos/me/",
      get: (slug: string) => url + `api/videos/${slug}/`,
      update: (slug: string) => url + `api/videos/${slug}/`,
      add: url + "api/videos/",
      delete: (slug: string) => url + `api/videos/${slug}/`,
      stream: (slug: string) => url + `api/videos/${slug}/stream/`,
      unlock: (slug: string) => url + `api/videos/${slug}/unlock/`,
      registerView: (slug: string) => url + `api/videos/${slug}/register_view/`,
      stats: (slug: string) => url + `api/videos/${slug}/stats/`,
      duplicate: (slug: string) => url + `api/videos/${slug}/duplicate/`,
      bulk: url + "api/videos/bulk/",
      dublinCore: (slug: string) => url + `api/videos/${slug}/dublin-core/`,
      tokens: url + "api/video-access-tokens/",
      hyperlinks: url + "api/video-hyperlinks/",
      markerTime: url + "api/user-marker-time/",
      videoCuts: url + "api/video-cuts/",
    },
    user: {
      list: url + "api/auth/users/",
      get: (id: number) => url + `api/auth/users/${id}/`,
    },
    conf: {
      get: url + "api/info/conf",
    },
    info: {
      get: url + "api/info",
    },
    discipline: {
      list: url + "api/disciplines/",
    },
    types: {
      list: url + "api/types/",
    },
    tags: {
      list: url + "api/tags/",
    },
    subtitles: {
      delete: (id: number) => url + `api/subtitles/${id}/`,
      add: url + "api/subtitles/",
    },
    comment: {
      list: (videoSlug: string) => url + `api/comment/${videoSlug}/`,
      parents: (videoSlug: string) =>
        url + `api/comment/${videoSlug}/?only=parents`,
      get: (commentId: string | number, videoSlug: string) =>
        url + `api/comment/${commentId}/${videoSlug}/`,
      add: (videoSlug: string, commentId?: string | number) =>
        commentId != null
          ? url + `api/comment/add/${videoSlug}/${commentId}/`
          : url + `api/comment/add/${videoSlug}/`,
      delete: (videoSlug: string, commentId: string | number) =>
        url + `api/comment/del/${videoSlug}/${commentId}/`,
      votes: (videoSlug: string) => url + `api/comment/vote/${videoSlug}/`,
      vote: (videoSlug: string, commentId: string | number) =>
        url + `api/comment/vote/${videoSlug}/${commentId}/`,
    },
    channel: {
      list: url + "api/collections/channels/",
      get: (slug: string) => url + `api/collections/channels/${slug}/`,
    },
    theme: {
      list: url + "api/collections/themes/",
      get: (slug: string) => url + `api/collections/themes/${slug}/`,
    },
    playlist: {
      list: url + "api/collections/playlists/",
      get: (slug: string) => url + `api/collections/playlists/${slug}/`,
      delete: (slug: string) => url + `api/collections/playlists/${slug}/`,
      add: url + `api/collections/playlists/`,
      update: (slug: string) => url + `api/collections/playlists/${slug}/`,
      addVideo: (slug: string) =>
        url + `api/collections/playlists/${slug}/add_video/`,
      deleteVideo: (slug: string) =>
        url + `api/collections/playlists/${slug}/remove_video/`,
      reorder: (slug: string) =>
        url + `api/collections/playlists/${slug}/reorder/`,
    },
    favorite: {
      list: url + "api/collections/favorites/",
      add: url + "api/collections/favorites/",
      get: (id: number | string) => url + `api/collections/favorites/${id}/`,
      delete: (id: number | string) => url + `api/collections/favorites/${id}/`,
    },
    documents: {
      list: (videoId?: number) => videoId ? url + `api/documents/?video=${videoId}` : url + "api/documents/",
      add: url + "api/documents/",
      delete: (id: number) => url + `api/documents/${id}/`,
    },
    contributions: {
      list: (videoId?: number) => videoId ? url + `api/contributions/?video=${videoId}` : url + "api/contributions/",
      add: url + "api/contributions/",
      delete: (id: number) => url + `api/contributions/${id}/`,
    },
    contributors: {
      search: (query: string) => url + `api/contributors/?search=${encodeURIComponent(query)}`,
    },
    chapters: {
      list: url + "api/chapters/",
      get: (id: number) => url + `api/chapters/${id}/`,
    },
    dressing: {
      watermarks: url + "api/dressing/watermarks/",
      watermark: (id: number) => url + `api/dressing/watermarks/${id}/`,
      dressings: url + "api/dressing/dressing/",
      dressing: (id: number) => url + `api/dressing/dressing/${id}/`,
    },

    administration: url + "admin",
  };
};

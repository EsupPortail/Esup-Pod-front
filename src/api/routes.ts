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
        config: url + "api/auth/config/",
        logout: url + "api/auth/logout-info/",
        data: url + "api/auth/users/me/",
        update: (id: number) => url + `api/auth/users/${id}/`,
      },
    },
    video: {
      list: url + "api/videos/",
      get: (slug: string) => url + `api/videos/${slug}/`,
      update: (slug: string) => url + `api/videos/${slug}/`,
      add: url + "api/videos/",
    },
    conf: {
      get: url + "api/info/conf",
    },
    info: {
      get: url + "api/info",
    },
    administration: url + "admin",
  };
};

export const getRoutes = () => {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL ?? "http://pod.localhost:8000/api/";
  const url = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return {
    auth: {
      token: {
        create: url + "auth/token/",
        verify: url + "auth/token/verify/",
        refresh: url + "auth/token/refresh/",
      },
      user: {
        config: url + "auth/config/",
        logout: url + "auth/logout-info/",
        data: url + "auth/users/me/",
        update: (id: number) => url + `auth/users/${id}/`,
      },
    },
  };
};

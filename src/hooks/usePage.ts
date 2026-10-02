import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@/src/api/routes";
import { useTranslation } from "./useTranslation";

export interface FlatPage {
  id: number;
  url: string;
  title: string;
  content: string;
}

/** Loads a configured flat page by slug. */
export const usePage = (slug: string) => {
  const { t } = useTranslation();
  return useQuery({
    queryKey: ["page", slug],
    queryFn: async () => {
      // In Django flatpages, URLs are like /about/ or /mentions-legales/
      const cleanSlug = slug.startsWith("/") ? slug : `/${slug}/`;
      const encodedSlug = encodeURIComponent(cleanSlug);
      const url = `${getRoutes().conf.get.replace("/conf", "/pages/")}${encodedSlug}/`;
      

      const res = await fetch(url);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(t("errors.pageNotFound"));
        }
        throw new Error(t("errors.loadPage"));
      }

      const data = await res.json();
      return data as FlatPage;
    },
    enabled: !!slug,
    retry: false,
  });
};

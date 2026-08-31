import { useQuery } from "@tanstack/react-query";
import { getRoutes } from "@/src/api/routes";

export interface FlatPage {
  id: number;
  url: string;
  title: string;
  content: string;
}

export const usePage = (slug: string) => {
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
          throw new Error("Page introuvable");
        }
        throw new Error("Erreur de chargement de la page");
      }
      
      const data = await res.json();
      return data as FlatPage;
    },
    enabled: !!slug,
    retry: false,
  });
};

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // On utilise useState pour s'assurer que le client n'est créé qu'une seule fois
  // par session utilisateur et non recréé à chaque rendu du layout.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // Les données sont fraîches pendant 5 minutes
            refetchOnWindowFocus: false, // Empêche de re-fetcher en changeant d'onglet
            retry: 1, // Une seule tentative en cas d'erreur
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Devtools invisibles en prod, très utiles en dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
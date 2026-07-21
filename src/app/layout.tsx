import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Footer from "../components/Footer/Footer";
import Breadcrumb from "../components/Breadcrumbs/Breadcrumbs";
import SidebarProvider from "../context/SidebarProvider";
import AuthProvider from "../context/AuthProvider";
import CunninghamStyleProvider from "../context/CunninghamProvider";
import DatePickerProvider from "../context/DatePickerProvider";
import AuthStatusAlert from "../components/Notifications/AuthStatusAlert";
import { PlaylistCreationProvider } from "../context/PlaylistCreationContext";
import { QueryProvider } from "../context/QueryProvider";

export const metadata: Metadata = {
  title: {
    template: "%s | Esup POD V5",
    default: "Esup POD V5",
  },
  description: "Plateforme vidéo Esup-Pod V5",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /*maximumScale: 1,*/
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body>
        <a href="#main" className="skip-link">Aller au contenu principal</a>
        <div className="layout">
          <CunninghamStyleProvider>
            <DatePickerProvider>
              <QueryProvider>
                <AuthProvider>
                  <PlaylistCreationProvider>
                    <SidebarProvider>
                      <Navbar />
                      <Sidebar />
                      <main id="main" className="main">
                        <Breadcrumb />
                        <div className="content">
                          <Suspense fallback={null}>
                            <AuthStatusAlert autoDismissMs={5000} />
                          </Suspense>
                          {children}
                        </div>
                      </main>
                      <Footer />
                    </SidebarProvider>
                  </PlaylistCreationProvider>
                </AuthProvider>
              </QueryProvider>
            </DatePickerProvider>
          </CunninghamStyleProvider>
        </div>
      </body>
    </html>
  );
}
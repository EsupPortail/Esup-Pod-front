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

import { AppConfigProvider } from "../context/AppConfigProvider";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { getTranslations } from "next-intl/server";

export const metadata: Metadata = {
  title: {
    template: "%s | Esup-Pod",
    default: "Esup-Pod",
  },
  description: "Plateforme vidéo Esup-Pod",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /*maximumScale: 1,*/
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const t = await getTranslations();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('pod_theme');
                  if (saved === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                    document.documentElement.classList.add('cunningham-theme--dark', 'dark-mode');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          {t("common.goToMainContent")}
        </a>
        <div className="layout">
          <CunninghamStyleProvider>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <AppConfigProvider>
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
              </AppConfigProvider>
            </NextIntlClientProvider>
          </CunninghamStyleProvider>
        </div>
      </body>
    </html>
  );
}

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import AuthProvider, { useAuth } from "./AuthProvider";
import { useTranslation } from "../hooks/useTranslation";
import { dictionaries } from "../locales";

// Composant de test pour consommer le contexte
const TestComponent = () => {
  const { isAuthenticated, logoutUrl } = useAuth();
  const { t } = useTranslation();
  return (
    <div>
      <span data-testid="auth-status">
        {isAuthenticated ? t("common.connected") : t("common.disconnected")}
      </span>
      <span data-testid="logout-url">{logoutUrl}</span>
    </div>
  );
};

// Mock de useAppConfig
vi.mock("../hooks/useAppConfig", () => ({
  useAppConfig: () => ({
    config: {
      use_local: true,
      use_cas: false,
    },
  }),
}));

describe("AuthProvider", () => {
  it("renders children without crashing and defaults to disconnected", () => {
    render(
      <NextIntlClientProvider locale="fr" messages={dictionaries.fr}>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </NextIntlClientProvider>,
    );
    expect(screen.getByTestId("auth-status").textContent).toBe(
      dictionaries.fr.common.disconnected,
    );
  });
});

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthProvider, { useAuth } from "./AuthProvider";
import { useTranslation } from "../hooks/useTranslation";

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
  const { t } = useTranslation();
  it("renders children without crashing and defaults to disconnected", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );
    expect(screen.getByTestId("auth-status").textContent).toBe(t("common.disconnected"));
  });
});

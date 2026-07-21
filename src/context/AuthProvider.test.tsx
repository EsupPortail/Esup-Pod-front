import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import AuthProvider, { useAuth } from "./AuthProvider";

// Composant de test pour consommer le contexte
const TestComponent = () => {
  const { isAuthenticated, logoutUrl } = useAuth();
  return (
    <div>
      <span data-testid="auth-status">{isAuthenticated ? "Connecté" : "Déconnecté"}</span>
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
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId("auth-status").textContent).toBe("Déconnecté");
  });
});

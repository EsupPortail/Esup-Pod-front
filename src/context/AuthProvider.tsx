"use client";

import {
  useContext,
  createContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { requestJson } from "../utils/requestJson";
import { authFetch } from "../api/authFetch";
import type { User } from "@/src/types";
import { getRoutes } from "../api/routes";
import { useAppConfig } from "../hooks/useAppConfig";

import { useRouter } from "next/navigation";
type AuthConfig = {
  use_local: boolean;
  use_cas: boolean;
  use_shibboleth: boolean;
  use_oidc: boolean;
};

type LogoutInfo = {
  local: string | null;
  cas: string | null;
  shibboleth: string | null;
  oidc: string | null;
};

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  user: User | null;
  authConfig: AuthConfig | null;
  logoutUrl: string;
  isAuthDataLoading: boolean;
  logIn: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<string | null>;
  verify: () => Promise<boolean>;
  reloadAuthData: () => Promise<void>;
};
type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

const getConfigFlag = (config: Record<string, unknown> | null, key: string) => {
  if (!config) return false;
  const lowerValue = config[key];
  if (typeof lowerValue === "boolean") return lowerValue;
  const upperValue = config[key.toUpperCase()];
  if (typeof upperValue === "boolean") return upperValue;
  return false;
};

const normalizeAuthConfig = (
  config: Record<string, unknown> | null,
): AuthConfig | null => {
  if (!config) return null;

  return {
    use_local: getConfigFlag(config, "use_local"),
    use_cas: getConfigFlag(config, "use_cas"),
    use_shibboleth: getConfigFlag(config, "use_shibboleth"),
    use_oidc: getConfigFlag(config, "use_oidc"),
  };
};

// Priorite: local > cas > shibboleth > oidc.
const resolveLogoutUrl = (
  config: AuthConfig | null,
  logoutInfo: LogoutInfo | null,
) => {
  if (!config || !logoutInfo) return "/";
  if (config.use_local) return logoutInfo.local || "/";
  if (config.use_cas) return logoutInfo.cas || "/";
  if (config.use_shibboleth) return logoutInfo.shibboleth || "/";
  if (config.use_oidc) return logoutInfo.oidc || "/";
  return "/";
};

export default function AuthProvider(props: AuthProviderProps) {
  const { config } = useAppConfig();

  // Router Next.js pour pouvoir rediriger en cas d'expiration de session
  const router = useRouter();

  // Permet d'éviter de déclencher plusieurs fois de suite
  // la logique de "session expirée" lorsque plusieurs requêtes
  // concurrentes échouent en même temps.
  const hasForcedLogoutRef = useRef(false);

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [logoutUrl, setLogoutUrl] = useState<string>("/");
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [logoutInfo, setLogoutInfo] = useState<LogoutInfo | null>(null);
  const [isAuthDataLoading, setIsAuthDataLoading] = useState(false);

  useEffect(() => {
    setAuthConfig(
      normalizeAuthConfig((config as Record<string, unknown>) ?? null),
    );
  }, [config]);

  useEffect(() => {
    setLogoutUrl(resolveLogoutUrl(authConfig, logoutInfo));
  }, [authConfig, logoutInfo]);

  useEffect(() => {
    const init = async () => {
      const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);

      let validAccess: string | null = storedAccess;

      if (storedAccess) {
        const accessTokenIsValid = await verify(storedAccess);
        if (!accessTokenIsValid && storedRefresh) {
          validAccess = await refresh(storedRefresh);
          if (!validAccess) {
            setIsInitializing(false);
            return;
          }
        }
      } else if (storedRefresh) {
        validAccess = await refresh(storedRefresh);
      }

      if (validAccess) {
        await loadAuthDataWithToken(validAccess, () => refresh(storedRefresh));
      } else {
        setUser(null);
        setLogoutInfo(null);
        setLogoutUrl("/");
      }

      setIsInitializing(false);
    };

    init();
  }, []);

  const persistTokens = (token: string | null, refreshValue: string | null) => {
    setAccessToken(token);
    setRefreshToken(refreshValue);

    // Si on enregistre de nouveaux tokens (login ou refresh réussi),
    // on réinitialise le flag pour permettre une future détection
    // d'expiration de session.
    if (token && refreshValue) {
      hasForcedLogoutRef.current = false;
    }
    token
      ? localStorage.setItem(ACCESS_TOKEN_KEY, token)
      : localStorage.removeItem(ACCESS_TOKEN_KEY);
    refreshValue
      ? localStorage.setItem(REFRESH_TOKEN_KEY, refreshValue)
      : localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const logout = () => {
    persistTokens(null, null);
    setUser(null);
    setLogoutInfo(null);
    setLogoutUrl("/");
  };

  /**
   * Déconnexion forcée + redirection vers la page de login
   * lorsqu'on détecte une expiration de session (échec du refresh).
   *
   * On protège cette logique avec un ref pour ne pas la déclencher
   * plusieurs fois en cas de multiples requêtes concurrentes qui
   * échouent en même temps.
   */
  const forceLogoutAndRedirectToLogin = () => {
    if (hasForcedLogoutRef.current) {
      return;
    }

    hasForcedLogoutRef.current = true;

    // Nettoyage local de l'état d'authentification
    logout();

    // Redirection vers la page de login en conservant la page courante
    // pour pouvoir y revenir après reconnexion.
    const currentPath =
      typeof window !== "undefined"
        ? window.location.pathname + window.location.search
        : "/";

    router.replace(
      `/login?reason=auth&redirect=${encodeURIComponent(currentPath)}`,
    );
  };

  const verify = async (token?: string | null) => {
    const tokenToVerify = token ?? accessToken;
    if (!tokenToVerify) return false;
    try {
      await requestJson(getRoutes().auth.token.verify, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });
      return true;
    } catch {
      return false;
    }
  };

  const refresh = async (token?: string | null) => {
    const tokenToRefresh = token ?? refreshToken;
    if (!tokenToRefresh) return null;
    try {
      const data = await requestJson<{ access: string }>(
        getRoutes().auth.token.refresh,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: tokenToRefresh }),
        },
      );
      const newAccess = data.access;
      persistTokens(newAccess, tokenToRefresh);
      return newAccess;
    } catch {
      // Si le refresh échoue (401 typiquement), on considère que la
      // session est expirée : on force la déconnexion et on redirige
      // l'utilisateur vers la page de login.
      forceLogoutAndRedirectToLogin();
      return null;
    }
  };

  const loadAuthDataWithToken = async (
    token: string,
    onRefresh?: () => Promise<string | null>,
  ) => {
    setIsAuthDataLoading(true);
    try {
      const [userRes, logoutInfoRes] = await Promise.all([
        authFetch(getRoutes().auth.user.data, {
          accessToken: token,
          onRefresh,
        }),
        authFetch(getRoutes().auth.user.logout, {
          accessToken: token,
          onRefresh,
        }),
      ]);

      const [userData, logoutInfoData] = await Promise.all([
        requestJson<User>(userRes),
        requestJson<LogoutInfo>(logoutInfoRes),
      ]);
      setUser(userData);
      setLogoutInfo(logoutInfoData);
      setLogoutUrl(resolveLogoutUrl(authConfig, logoutInfoData));
    } catch {
      setUser(null);
      setLogoutInfo(null);
      setLogoutUrl("/");
    } finally {
      setIsAuthDataLoading(false);
    }
  };

  const reloadAuthData = async () => {
    if (!accessToken) {
      setUser(null);
      setLogoutInfo(null);
      setLogoutUrl("/");
      return;
    }
    await loadAuthDataWithToken(accessToken, refresh);
  };

  const logIn = async (username: string, password: string) => {
    const data = await requestJson<{ access: string; refresh: string }>(
      getRoutes().auth.token.create,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );

    persistTokens(data.access, data.refresh);
    await loadAuthDataWithToken(data.access, () => refresh(data.refresh));
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      user,
      authConfig,
      logoutUrl,
      isAuthDataLoading,
      logIn,
      logout,
      refresh,
      verify,
      reloadAuthData,
    }),
    [
      accessToken,
      refreshToken,
      isInitializing,
      user,
      authConfig,
      logoutUrl,
      isAuthDataLoading,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth doit etre utilise dans AuthProvider.");
  }
  return ctx;
};

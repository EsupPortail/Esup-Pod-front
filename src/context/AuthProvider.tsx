"use client";
import { useContext, createContext, useEffect, useMemo, useState } from "react";
import { requestJson } from "../utils/requestJson";
import { authFetch } from "../api/authFetch";
import type { User } from "../types/interface";
import { getRoutes } from "../api/routes";

type AuthConfig = {
  use_local: boolean;
  use_cas: boolean;
  use_shibboleth: boolean;
  use_oidc: boolean;
  shibboleth_name: string;
  oidc_name: string;
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

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Tokens
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

//(si plusieurs authConfig sont à true priorité au local, puis cas, puis shibboleth, puis oidc).
const resolveLogoutUrl = (config: AuthConfig, logoutInfo: LogoutInfo) => {
  if (config.use_local) return logoutInfo.local || "/";
  if (config.use_cas) return logoutInfo.cas || "/";
  if (config.use_shibboleth) return logoutInfo.shibboleth || "/";
  if (config.use_oidc) return logoutInfo.oidc || "/";
  return "/";
};

export default function AuthProvider(props: any) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [logoutUrl, setLogoutUrl] = useState<string>("/");
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authConfig, setAuthConfig] = useState<AuthConfig | null>(null);
  const [isAuthDataLoading, setIsAuthDataLoading] = useState(false);

  console.log(user);
  console.log(authConfig);

  // Réhydrate les tokens depuis localStorage
  // Vérifie/rafraîchit automatiquement au démarrage pour garder la session active
  // S'éxecute une fois au chargement du Provider
  useEffect(() => {
    const init = async () => {
      const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);

      let validAccess: string | null = storedAccess;

      if (storedAccess) {
        //Verification du access tocken
        const accessTokenIsValid = await verify(storedAccess);
        //Si la verification échoue, tentative de refresh si on a un refresh token
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
        setAuthConfig(null);
        setLogoutUrl("/");
      }

      setIsInitializing(false);
    };

    init();
  }, []);

  //stocke ou supprime auth_access_token et auth_refresh_token en fonction de l'etat react
  const persistTokens = (token: string | null, refresh: string | null) => {
    setAccessToken(token);
    setRefreshToken(refresh);
    token
      ? localStorage.setItem(ACCESS_TOKEN_KEY, token)
      : localStorage.removeItem(ACCESS_TOKEN_KEY);
    refresh
      ? localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
      : localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const logout = () => {
    persistTokens(null, null);
    setUser(null);
    setAuthConfig(null);
    setLogoutUrl("/");
  };

  //Verification des access token
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

  //Refresh du access token avec le refresh token
  //Enregistre le nouveau access dans le local storage
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
      logout();
      return null;
    }
  };

  //Récupère les données du user
  const loadAuthDataWithToken = async (
    token: string,
    onRefresh?: () => Promise<string | null>,
  ) => {
    setIsAuthDataLoading(true);
    try {
      const [userRes, configRes, logoutInfoRes] = await Promise.all([
        authFetch(getRoutes().auth.user.data, {
          accessToken: token,
          onRefresh,
        }),
        authFetch(getRoutes().auth.user.config, {
          accessToken: token,
          onRefresh,
        }),
        authFetch(getRoutes().auth.user.logout, {
          accessToken: token,
          onRefresh,
        }),
      ]);

      const [userData, configData, logoutInfoData] = await Promise.all([
        requestJson<User>(userRes),
        requestJson<AuthConfig>(configRes),
        requestJson<LogoutInfo>(logoutInfoRes),
      ]);

      setUser(userData);
      setAuthConfig(configData);
      setLogoutUrl(resolveLogoutUrl(configData, logoutInfoData));
    } catch {
      setUser(null);
      setAuthConfig(null);
      setLogoutUrl("/");
    } finally {
      setIsAuthDataLoading(false);
    }
  };

  // Si !accessToken : reset état auth data.
  // Sinon recharge via avec loadAuthDataWithToken
  const reloadAuthData = async () => {
    if (!accessToken) {
      setUser(null);
      setAuthConfig(null);
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

  //Créer l’objet value envoyé au Provider
  //Si access, refresh et isInitializing etc.. ne changent pas, value garde la même valeur.
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

"use client";
import { useContext, createContext, useEffect, useMemo, useState } from "react";
import { requestJson } from "../utils/requestJson";
import { authFetch } from "../api/authFetch";

type AuthContextValue = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  logIn: (username: string, password: string) => Promise<void>;
  logOut: () => void;
  refresh: () => Promise<string | null>;
  verify: () => Promise<boolean>;
};

type LogoutInfo = {
  local: string | null;
  cas: string | null;
  shibboleth: string | null;
  oidc: string | null;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Tokens
const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const API_URL =
  process.env.REACT_APP_API_URL || "http://pod.localhost:8000/api/";

export default function AuthProvider(props: any) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [logOutUrl, setlogOutUrl] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Réhydrate les tokens depuis localStorage
  // Vérifie/rafraîchit automatiquement au démarrage pour garder la session active
  // S'éxecute une fois au chargement du Provider
  useEffect(() => {
    const init = async () => {
      //on récupère les données du localStorage
      const storedAccess = localStorage.getItem(ACCESS_TOKEN_KEY);
      const storedRefresh = localStorage.getItem(REFRESH_TOKEN_KEY);
      setAccessToken(storedAccess);
      setRefreshToken(storedRefresh);
      getLogOutUrl();
      if (storedAccess) {
        //Verification du access tocken
        const accessTokenIsValid = await verify(storedAccess);
        //Si la verification échoue, tentative de refresh si on a un refresh token
        if (!accessTokenIsValid && storedRefresh) {
          const accessTokenIsRefresh = await refresh(storedRefresh);
          //Si on a pas reçu d'access, on déconnecte l'utilisateur
          if (!accessTokenIsRefresh) logOut();
        }
      } else if (storedRefresh) {
        //si pas de access, mais qu'on a un refresh, recuperation d'un access
        await refresh(storedRefresh);
      }

      setIsInitializing(false);
    };
    init();
  }, []);

  //Stocke les tokens dans le localStorage et dans l'état React, ou les supprime si null
  const persistTokens = (token: string | null, refreshToken: string | null) => {
    setAccessToken(token);
    setRefreshToken(refreshToken);
    token
      ? localStorage.setItem(ACCESS_TOKEN_KEY, token)
      : localStorage.removeItem(ACCESS_TOKEN_KEY);
    refreshToken
      ? localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
      : localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  //Supprime tout les tokens
  const logOut = () => {
    persistTokens(null, null);
  };

  const getLogOutUrl = async () => {
    try {
      const res = await authFetch(API_URL + "auth/logout-info/", {
        accessToken: accessToken,
        onRefresh: refresh,
      });
      const data = await requestJson<LogoutInfo>(res);
      setlogOutUrl("/");
    } catch (err) {
      console.log(err);
      setlogOutUrl("/");
    }
  };

  //Verification des access token
  const verify = async (token?: string | null) => {
    const tokenToVerify = token ?? accessToken;
    if (!tokenToVerify) return false;
    try {
      await requestJson(API_URL + "auth/token/verify/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenToVerify }),
      });
      return true;
    } catch (e) {
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
        API_URL + "auth/token/refresh/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        },
      );
      const newAccess = data.access;
      persistTokens(newAccess, refreshToken);
      return newAccess;
    } catch {
      logOut();
      return null;
    }
  };

  //Récupère un access et refresh avec username et passwd
  const logIn = async (username: string, password: string) => {
    const data = await requestJson<{ access: string; refresh: string }>(
      API_URL + "auth/token/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      },
    );
    persistTokens(data.access, data.refresh);
  };

  //Créer l’objet value envoyé au Provider
  //Si access, refresh et isInitializing ne changent pas, value garde la même valeur.
  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated: Boolean(accessToken),
      isInitializing,
      logIn,
      logOut,
      refresh,
      verify,
    }),
    [accessToken, refreshToken, isInitializing],
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

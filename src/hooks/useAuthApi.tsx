import { useState } from "react";

export function useAuthApi() {
  const API_URL =
    process.env.REACT_APP_API_URL || "http://pod.localhost:8000/api/";

  const getAuthToken = async (user: string, passwd: string) => {
    const res = await fetch(API_URL + "auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user, password: passwd }),
    });
    if (!res.ok) throw new Error("Erreur lors de la récupération du token");
    const data = await res.json();
    console.log(data);
    return data;
  };

  const checkAuthToken = async (token: string) => {
    try {
      const res = await fetch(API_URL + "auth/token/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token }),
      });
      if (!res.ok) throw new Error("Erreur lors de la vérification du token");
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err: any) {
    } finally {
    }

    const refreshAuthToken = async (token: string) => {
      try {
        const res = await fetch(API_URL + "auth/token/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: token }),
        });
        if (!res.ok)
          throw new Error("Erreur lors de la renouvellement du token");
        const data = await res.json();
        console.log(data);
        return data;
      } catch (err: any) {
      } finally {
      }
    };

    return { getAuthToken, checkAuthToken, refreshAuthToken };
  };
}

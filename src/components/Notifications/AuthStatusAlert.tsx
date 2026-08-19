"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert, VariantType } from "@openfun/cunningham-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/src/context/AuthProvider";
import styles from "./AuthStatusAlert.module.css";

const AUTH_STATUS_MESSAGES = {
  login: "Vous êtes désormais connecté.",
  logout: "Vous êtes désormais déconnecté.",
} as const;

type AuthStatusAlertProps = {
  autoDismissMs?: number;
};

export default function AuthStatusAlert({
  autoDismissMs,
}: AuthStatusAlertProps) {
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { user, isInitializing } = useAuth();
  const isAuthenticated = Boolean(user);

  const { message, shouldShow, shouldClear } = useMemo(() => {
    const loginSuccess = params.get("login") === "success";
    const logoutSuccess = params.get("logout") === "success";
    const message = loginSuccess
      ? AUTH_STATUS_MESSAGES.login
      : logoutSuccess
        ? AUTH_STATUS_MESSAGES.logout
        : null;
    const shouldShow =
      (loginSuccess && isAuthenticated) || (logoutSuccess && !isAuthenticated);

    return {
      message,
      shouldShow,
      shouldClear: loginSuccess || logoutSuccess,
    };
  }, [isAuthenticated, params]);

  const handleClose = () => {
    if (!shouldClear) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setIsClosing(false);
      const nextParams = new URLSearchParams(params.toString());
      nextParams.delete("login");
      nextParams.delete("logout");
      const nextQuery = nextParams.toString();
      const nextUrl = nextQuery ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl);
    }, 250);
  };

  useEffect(() => {
    if (!autoDismissMs || isInitializing || !message || !shouldShow) return;
    const timeout = window.setTimeout(() => {
      handleClose();
    }, autoDismissMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [autoDismissMs, handleClose, isInitializing, message, shouldShow]);

  if (isInitializing || !message || !shouldShow) {
    return null;
  }

  return (
    <Alert
      canClose
      type={VariantType.SUCCESS}
      onClose={handleClose}
      className={`${styles.authStatusAlert} ${
        isClosing ? styles.isClosing : ""
      }`.trim()}
    >
      {message}
    </Alert>
  );
}

"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Input,
  InputPassword,
  Button,
  Alert,
  VariantType,
} from "@openfun/cunningham-react";
import styles from "./styles.module.css";
import { useTranslation } from "@/src/hooks/useTranslation";
import { useAuth } from "../../context/AuthProvider";
import { useAppConfig } from "@/src/hooks/useAppConfig";

export const breadcrumbLabel = "Connexion à mon profil POD";

function LoginContent() {
  const { logIn } = useAuth();
  const { t } = useTranslation();
  const { config } = useAppConfig();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();
  const authRequired = params.get("reason") === "auth";
  const redirect = params.get("redirect");
  const backUrl = process.env.NEXT_PUBLIC_BACK_URL || "";

  type LoginFormValues = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  /* ------------------------------------------------------------------ */
  const safeRedirect =
    redirect && redirect.startsWith("/") && redirect !== "/login"
      ? redirect
      : "/?login=success";

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await logIn(data.username.trim(), data.password.trim());
      // Prevent this forced login page from remaining in the BackButton history
      if (authRequired) {
        router.replace(safeRedirect);
      } else {
        router.push(safeRedirect);
      }
    } catch (err: any) {
      setError(err?.message ?? t("common.error"));
    }
  };
  /* ------------------------------------------------------------------ */

  return (
    <div className={styles["login-content"]}>
      {/* ==== Warning ==== */}
      {authRequired && (
        <div role="alert" aria-live="polite">
          <Alert canClose type={VariantType.WARNING}>
            {t("auth.loginRequired")}
          </Alert>
        </div>
      )}

      {/* ==== Server Error ==== */}
      {error && (
        <div role="alert" aria-live="assertive">
          <Alert canClose type={VariantType.ERROR}>
            {error}
          </Alert>
        </div>
      )}

      <h1>{t("common.login")}</h1>

      {/* ==== SSO Buttons ==== */}
      <div className={styles["sso-button"]}>
        {config?.authentication?.use_cas && (
          <Button
            onClick={() => (window.location.href = `${backUrl}/login/cas/`)}
            variant="secondary"
          >
            {t("navbar.login")} CAS
          </Button>
        )}
        {config?.authentication?.use_shib && (
          <Button
            onClick={() =>
              (window.location.href = `${backUrl}/login/shibboleth/`)
            }
            variant="secondary"
          >
            {t("navbar.login")} {config?.authentication?.shibboleth_name || "Shibboleth"}
          </Button>
        )}
        {config?.authentication?.use_oidc && (
          <Button
            onClick={() => (window.location.href = `${backUrl}/login/oidc/`)}
            variant="secondary"
          >
            {t("navbar.login")} {config?.authentication?.oidc_name || "OIDC"}
          </Button>
        )}
      </div>

      {config?.authentication?.use_local_auth !== false && (
        <form
          className={styles["login-form"]}
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* ==== Form ==== */}
          <Input
            id="login-username"
            label={`${t("auth.username")} *`}
            autoComplete="login"
            state={errors.username ? "error" : "default"}
            aria-describedby="username-error"
            aria-required="true"
            {...register("username", {
              required: t("auth.usernameRequired"),
              validate: (value) =>
                value.trim().length > 0 || t("auth.usernameRequired"),
            })}
          />
          {errors.username && (
            <p id="username-error" className={styles["error"]}>
              {errors.username.message}
            </p>
          )}

          {/* ==== Password ==== */}
          <InputPassword
            id="login-password"
            label={`${t("auth.password")} *`}
            autoComplete="password"
            state={errors.password ? "error" : "default"}
            aria-describedby="password-error"
            aria-required="true"
            {...register("password", {
              required: t("auth.passwordRequired"),
              validate: (value) =>
                value.trim().length > 0 || t("auth.passwordRequired"),
            })}
          />
          {errors.password && (
            <p
              id="password-error"
              className={styles["error"]}
            >
              {errors.password.message}
            </p>
          )}

          {/* ==== Submit button ==== */}
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("common.loading") : t("auth.submitLogin")}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}

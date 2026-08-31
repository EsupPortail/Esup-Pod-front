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
      // Ne pas laisser cette page de login forcée dans l'historique du BackButton
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
    <div className={styles.login_content}>
      {/* ==== Avertissement ==== */}
      {authRequired && (
        <div role="alert" aria-live="polite">
          <Alert canClose type={VariantType.WARNING}>
            {t("auth.loginRequired")}
          </Alert>
        </div>
      )}

      {/* ==== Erreur serveur ==== */}
      {error && (
        <div role="alert" aria-live="assertive">
          <Alert canClose type={VariantType.ERROR}>
            {error}
          </Alert>
        </div>
      )}

      <h1>{t("common.login")}</h1>

      {/* ==== SSO Buttons ==== */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px", width: "100%" }}>
        {config?.authentication?.use_cas && (
          <Button
            onClick={() => window.location.href = `${backUrl}/login/cas/`}
            variant="secondary"
          >
            Connexion CAS
          </Button>
        )}
        {config?.authentication?.use_shib && (
          <Button
            onClick={() => window.location.href = `${backUrl}/login/shibboleth/`}
            variant="secondary"
          >
            Connexion {config?.authentication?.shibboleth_name || "Shibboleth"}
          </Button>
        )}
        {config?.authentication?.use_oidc && (
          <Button
            onClick={() => window.location.href = `${backUrl}/login/oidc/`}
            variant="secondary"
          >
            Connexion {config?.authentication?.oidc_name || "OIDC"}
          </Button>
        )}
      </div>

      {config?.authentication?.use_local_auth !== false && (
        <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
          {/* ==== Formulaire ==== */}
        <Input
          id="login-username"
          label={`${t("auth.username")} *`}
          autoComplete="login"
          state={errors.username ? "error" : "default"}
          aria-describedby="username-error"
          aria-required="true"
          {...register("username", {
            required: "Ce champ est requis.",
            validate: (value) =>
              value.trim().length > 0 || "Ce champ est requis.",
          })}
        />
        {errors.username && (
          <p id="username-error" style={{ color: "red", marginTop: "0.25rem" }}>
            {errors.username.message}
          </p>
        )}

        {/* ==== Mot de passe ==== */}
        <InputPassword
          id="login-password"
          label={`${t("auth.password")} *`}
          autoComplete="password"
          state={errors.password ? "error" : "default"}
          aria-describedby="password-error"
          aria-required="true"
          {...register("password", {
            required: "Ce champ est requis.",
            validate: (value) =>
              value.trim().length > 0 || "Ce champ est requis.",
          })}
        />
        {errors.password && (
          <p id="password-error" style={{ color: "red", marginTop: "0.25rem" }}>
            {errors.password.message}
          </p>
        )}

        {/* ==== Bouton de soumission ==== */}
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

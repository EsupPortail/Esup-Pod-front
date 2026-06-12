"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input, InputPassword, Button, Alert } from "@openfun/cunningham-react";
import styles from "./styles.module.css";
import { useAuth } from "../../context/AuthProvider";

export const breadcrumbLabel = "Connexion à mon profil POD";

export default function Login() {
  const { logIn } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const params = useSearchParams();
  const authRequired = params.get("reason") === "auth";
  const redirect = params.get("redirect");

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
      router.push(safeRedirect);
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue.");
    }
  };
  /* ------------------------------------------------------------------ */

  return (
    <div className={styles.login_content}>
      {/* ==== Avertissement ==== */}
      {authRequired && (
        <Alert canClose type="warning" role="alert" aria-live="polite">
          Vous devez être connecté pour accéder à cette page.
        </Alert>
      )}

      {/* ==== Erreur serveur ==== */}
      {error && (
        <Alert canClose type="error" role="alert" aria-live="assertive">
          {error}
        </Alert>
      )}

      <h1>Connexion</h1>

      {/* ==== Formulaire ==== */}
      <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
        {/* ==== Formulaire ==== */}
        <Input
          id="login-username"
          label="Nom d'utilisateur *"
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
          label="Mot de passe *"
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
          {isSubmitting ? "Connexion..." : "Connexion"}
        </Button>
      </form>
    </div>
  );
}

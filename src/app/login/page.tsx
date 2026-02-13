"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input, InputPassword, Button, Alert } from "@openfun/cunningham-react";
import styles from "./page.module.css";
import { useAuth } from "../../context/AuthProvider";

export default function Login() {
  const { logIn } = useAuth();
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);

  type LoginFormValues = {
    username: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    try {
      await logIn(data.username.trim(), data.password.trim());
      router.push("/?login=success");
    } catch (err: any) {
      setError(err?.message ?? "Une erreur est survenue.");
    }
  };

  return (
    <div className={styles.login_content}>
      {error && (
        <Alert canClose type="error">
          {error}
        </Alert>
      )}
      <h3>Connexion</h3>
      <form className={styles.login_form} onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Nom d'utilisateur"
          autoComplete="login"
          state={errors.username ? "error" : "default"}
          text={errors.username?.message}
          {...register("username", {
            required: "Ce champ est requis.",
            validate: (value) =>
              value.trim().length > 0 || "Ce champ est requis.",
          })}
        />
        <InputPassword
          label="Mot de passe"
          autoComplete="password"
          state={errors.password ? "error" : "default"}
          text={errors.password?.message}
          {...register("password", {
            required: "Ce champ est requis.",
            validate: (value) =>
              value.trim().length > 0 || "Ce champ est requis.",
          })}
        />
        <Button
          fullWidth
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Connexion..." : "Connexion"}
        </Button>
      </form>
    </div>
  );
}

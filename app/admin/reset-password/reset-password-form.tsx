"use client";

import { useState, type FormEvent } from "react";

import { KeyRound, ShieldCheck } from "lucide-react";

import styles from "../admin.module.css";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError("Please complete both password fields.");

      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");

      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/reset-password", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Unable to update the password.",
        );

        return;
      }

      window.location.assign("/admin?password=updated");
    } catch {
      setError("Unable to update the password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <div className={styles.logoIcon}>
          <KeyRound size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className={styles.brand}>
          AI <span>&amp;</span> Coding
        </div>

        <span className={styles.eyebrow}>PASSWORD RECOVERY</span>

        <h1 className={styles.title}>Set New Password</h1>

        <p className={styles.subtitle}>
          Choose a new password for your administrator account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.field}>
          <label htmlFor="new-password" className={styles.label}>
            New Password
          </label>

          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            maxLength={256}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="confirm-password" className={styles.label}>
            Confirm New Password
          </label>

          <input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            required
            maxLength={256}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className={styles.input}
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Updating Password..." : "Update Password"}
        </button>
      </form>

      <div className={styles.loginFooter}>
        <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />

        <span>Secure password recovery</span>
      </div>
    </div>
  );
}

"use client";

import { useState, type FormEvent } from "react";

import Link from "next/link";

import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import styles from "./admin.module.css";

export function AdminLoginForm() {
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [recoveryMessage, setRecoveryMessage] = useState("");

  const [isRecovering, setIsRecovering] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!password || isSubmitting || isRecovering) {
      return;
    }

    setIsSubmitting(true);
    setError("");
    setRecoveryMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "same-origin",

        body: JSON.stringify({
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Unable to sign in. Please try again.",
        );

        setPassword("");

        return;
      }

      /*
       * Use a full navigation so the dashboard
       * receives the latest authentication cookies.
       */
      window.location.assign("/admin/dashboard");
    } catch {
      setError("Unable to connect. Please try again.");

      setPassword("");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleForgotPassword() {
    if (isRecovering || isSubmitting) {
      return;
    }

    setIsRecovering(true);
    setError("");
    setRecoveryMessage("");

    try {
      const response = await fetch("/api/admin/forgot-password", {
        method: "POST",

        credentials: "same-origin",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(
          typeof result.error === "string"
            ? result.error
            : "Unable to send the recovery email. Please try again.",
        );

        return;
      }

      setRecoveryMessage(
        typeof result.message === "string"
          ? result.message
          : "Password reset instructions have been sent to the registered admin email.",
      );
    } catch {
      setError("Unable to send the recovery email. Please try again.");
    } finally {
      setIsRecovering(false);
    }
  }

  return (
    <div className={styles.loginCard}>
      <div className={styles.loginHeader}>
        <div className={styles.logoIcon}>
          <LockKeyhole size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className={styles.brand}>
          AI <span>&amp;</span> Coding
        </div>

        <span className={styles.eyebrow}>SECURE ADMIN ACCESS</span>

        <h1 className={styles.title}>Welcome Back</h1>

        <p className={styles.subtitle}>
          Enter your admin password to continue to your dashboard.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <div className={styles.field}>
          <label htmlFor="admin-password" className={styles.label}>
            Password
          </label>

          <div className={styles.inputWrapper}>
            <LockKeyhole
              size={18}
              strokeWidth={1.8}
              className={styles.inputIcon}
              aria-hidden="true"
            />

            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              minLength={1}
              maxLength={256}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);

                if (error) {
                  setError("");
                }

                if (recoveryMessage) {
                  setRecoveryMessage("");
                }
              }}
              placeholder="Enter your password"
              className={styles.input}
              disabled={isSubmitting || isRecovering}
              aria-invalid={Boolean(error)}
              aria-describedby={
                error
                  ? "admin-login-error"
                  : recoveryMessage
                    ? "admin-recovery-message"
                    : undefined
              }
            />
          </div>
        </div>

        {error && (
          <p id="admin-login-error" className={styles.error} role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting || isRecovering || !password}
        >
          <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>

          {!isSubmitting && (
            <ArrowRight size={19} strokeWidth={2} aria-hidden="true" />
          )}
        </button>

        <button
          type="button"
          className={styles.forgotPassword}
          onClick={handleForgotPassword}
          disabled={isRecovering || isSubmitting}
        >
          {isRecovering ? "Sending recovery email..." : "Forgot password?"}
        </button>

        {recoveryMessage && (
          <p
            id="admin-recovery-message"
            className={styles.recoveryMessage}
            role="status"
            aria-live="polite"
          >
            {recoveryMessage}
          </p>
        )}
      </form>

      <div className={styles.loginFooter}>
        <ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true" />

        <span>Authorized access only</span>
      </div>

      <Link href="/" className={styles.backLink}>
        Back to website
      </Link>
    </div>
  );
}

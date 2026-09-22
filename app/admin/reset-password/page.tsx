import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/admin/auth";
import { hasValidRecoveryAuthorization } from "@/lib/admin/recovery-authorization";

import { ResetPasswordForm } from "./reset-password-form";

import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reset Admin Password | AI & Coding",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function ResetPasswordPage() {
  const admin = await getCurrentAdmin();

  if (!admin || !(await hasValidRecoveryAuthorization(admin.id))) {
    redirect("/admin?recovery=invalid");
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <ResetPasswordForm />
    </main>
  );
}

import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/admin/auth";

import { AdminLoginForm } from "./admin-login-form";

import styles from "./admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Access | AI & Coding",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const admin = await getCurrentAdmin();

  // Already authenticated administrators
  // should go directly to the dashboard.

  if (admin) {
    redirect("/admin/dashboard");
  }

  return (
    <main className={styles.page}>
      <div className={styles.backgroundGlow} aria-hidden="true" />

      <AdminLoginForm />
    </main>
  );
}

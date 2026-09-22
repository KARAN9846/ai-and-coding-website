import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { LockKeyhole } from "lucide-react";

import { getCurrentAdmin } from "@/lib/admin/auth";

import styles from "../admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Dashboard | AI & Coding",

  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();

  // Prevent unauthorized access.

  if (!admin) {
    redirect("/admin");
  }

  return (
    <main className={styles.dashboardPage}>
      <div className={styles.dashboardCard}>
        <div className={styles.logoIcon}>
          <LockKeyhole size={25} strokeWidth={1.8} aria-hidden="true" />
        </div>

        <h1>Admin Dashboard</h1>

        <p>
          You have successfully signed in to your AI &amp; Coding admin account.
        </p>

        <p>Your link management dashboard will be available here.</p>

        <form action="/api/admin/logout" method="POST">
          <button type="submit">Logout</button>
        </form>
      </div>
    </main>
  );
}

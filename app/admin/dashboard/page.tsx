import type { Metadata } from "next";

import { redirect } from "next/navigation";

import { getCurrentAdmin } from "@/lib/admin/auth";

import { AdminLinksDashboard } from "./admin-links-dashboard";

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

  if (!admin) {
    redirect("/admin");
  }

  return <AdminLinksDashboard />;
}

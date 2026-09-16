import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { MobileWhatsApp } from "@/components/layout/mobile-whatsapp/mobile-whatsapp";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI & Coding | Learn Today, Lead Tomorrow",
  description:
    "Practical AI, coding and digital technology education by Nyalkaran Technosoft LLP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <MobileWhatsApp />
      </body>
    </html>
  );
}

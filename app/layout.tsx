import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
const manrope = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = getSiteUrl();
export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "Nimantha Hewawasam | Software Developer",
  description:
    "Software developer building web applications, mobile apps, dashboards, automation systems, and AI-powered solutions for modern businesses.",
  manifest: "/images/favicon/site.webmanifest",
  icons: {
    icon: [
      { url: "/images/favicon/favicon.ico" },
      {
        url: "/images/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/images/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/images/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    shortcut: ["/images/favicon/favicon.ico"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={`${manrope.variable} antialiased`}>{children}</body>
    </html>
  );
}

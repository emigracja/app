import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Your app name",
    description: "Your app description",
    generator: "Next.js",
    manifest: "/manifest.json",
    keywords: ["nextjs", "next14", "pwa", "next-pwa"],
    icons: [
        { rel: "apple-touch-icon", url: "icon-192x192.png" },
        { rel: "icon", url: "icon-192x192.png" },
    ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

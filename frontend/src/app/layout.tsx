import type {Metadata, Viewport} from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar/NavBar";

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

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    userScalable: false,
    minimumScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
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
    <main className="grid grid-rows-[minmax(0,1fr)_auto] h-screen overflow-hidden">
        <div className="row-start-1 overflow-auto">
            {children}
        </div>
        <div className="row-start-2 w-full">
            <NavBar/>
        </div>
    </main>

    </body>
    </html>
    );
}

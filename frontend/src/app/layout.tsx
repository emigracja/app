import type { Metadata, Viewport } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/navbar/NavBar";
import TopBar from "@/components/topbar/TopBar";
import SessionProviderWrapper from "@/components/auth/SessionProviderWrapper";
import QueryProvider from "@/components/providers/QueryProvider";

const mavenPro = Maven_Pro({
  variable: "--font-maven-pro",
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
      <QueryProvider>
        <SessionProviderWrapper>
          <html lang="en">
            <body className={`${mavenPro.variable} antialiased relative`}>
              <main className="grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
                <TopBar />
                <div className="overflow-auto">
                  {children || <div className="h-full"></div>}
                </div>
                <div className="relative bottom-[0px] w-full">
                  <NavBar />
                </div>
                {/*<Overlay />*/}
              </main>
            </body>
          </html>
        </SessionProviderWrapper>
      </QueryProvider>
  );
}

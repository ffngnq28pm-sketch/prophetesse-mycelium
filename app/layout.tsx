import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/liturgical/Nav";
import { ThemeBootstrap } from "@/components/liturgical/ThemeBootstrap";
import { Footer } from "@/components/liturgical/Footer";
import { MotionProvider } from "@/components/liturgical/MotionProvider";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Prophétesse-Mycélium · L'Ordre Vert",
  description:
    "Application liturgique de l'Ordre Mycélien. Rituels, confessions, jeux du compost et du recensement d'insectes, et la parole de la Prophétesse.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Prophétesse-Mycélium",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#3a562f" },
    { media: "(prefers-color-scheme: dark)", color: "#13200f" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeBootstrap />
        <MotionProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-6">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

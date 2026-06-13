import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/liturgical/Nav";
import { ThemeBootstrap } from "@/components/liturgical/ThemeBootstrap";
import { Footer } from "@/components/liturgical/Footer";
import { MotionProvider } from "@/components/liturgical/MotionProvider";
import { ConsoleGreeting } from "@/components/liturgical/ConsoleGreeting";
import { FondPeintAuto } from "@/components/banque/FondPeintAuto";

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

const SITE_URL = "https://mycelium.shadowstepsociety.com";
const SITE_TITLE = "Prophétesse-Mycélium · L'Ordre Vert";
const SITE_DESC =
  "Application liturgique de l'Ordre Mycélien. Rituels, confessions, jeux du compost et du recensement d'insectes, et la parole de la Marcheuse.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Prophétesse-Mycélium",
  },
  description: SITE_DESC,
  manifest: "/manifest.webmanifest",
  applicationName: "Prophétesse-Mycélium",
  generator: undefined,
  keywords: [
    "écologie",
    "liturgie",
    "compost",
    "biodiversité",
    "pollinisateurs",
    "cimetières",
    "mycélium",
    "Île-de-France",
    "application",
  ],
  authors: [{ name: "Ordre Mycélien" }],
  creator: "Ordre Mycélien",
  publisher: "Ordre Mycélien",
  appleWebApp: {
    capable: true,
    title: "Prophétesse-Mycélium",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    siteName: "Prophétesse-Mycélium",
    title: SITE_TITLE,
    description: SITE_DESC,
    url: SITE_URL,
    locale: "fr_FR",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Prophétesse-Mycélium — L'Ordre Vert",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
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
        {/* Fond peint ambiant, monté une seule fois, derrière tout le contenu. */}
        <FondPeintAuto />
        <ThemeBootstrap />
        <ConsoleGreeting />
        <MotionProvider>
          <Nav />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 md:px-6">{children}</main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}

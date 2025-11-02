import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Wallet TIC - Tu Billetera Digital",
    template: "%s | Wallet TIC"
  },
  description: "Gestiona tu dinero de forma simple y segura. Paga servicios, recarga tarjetas SUBE y administra tus finanzas.",
  keywords: ["billetera digital", "pagos", "servicios", "SUBE", "finanzas", "wallet"],
  authors: [{ name: "Wallet TIC" }],
  creator: "Wallet TIC",
  publisher: "Wallet TIC",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    title: "Wallet TIC - Tu Billetera Digital",
    description: "Gestiona tu dinero de forma simple y segura",
    siteName: "Wallet TIC",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wallet TIC - Tu Billetera Digital",
    description: "Gestiona tu dinero de forma simple y segura",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

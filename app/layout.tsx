import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wallet TIC - Tu Billetera Digital",
  description: "Gestiona tu dinero de forma simple y segura",
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

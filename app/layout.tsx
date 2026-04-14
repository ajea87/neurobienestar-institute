import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "El nervio que lleva años intentando decirte algo | IEN",
  description:
    "Test diagnóstico gratuito: descubre en 2 minutos si tu nervio vago está inhibido. Protocolo de activación basado en neurociencia. Instituto Español de Neurobienestar.",
  openGraph: {
    title: "El nervio que lleva años intentando decirte algo",
    description: "Test diagnóstico gratuito · Protocolo Nervio Vago · IEN",
    url: "https://neurobienestar.institute",
    siteName: "Instituto Español de Neurobienestar",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}

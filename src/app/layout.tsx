import type { Metadata } from "next";
import { Syne, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Musab Atieh — ASP.NET Core & SQL Backend Developer",
  description:
    "ASP.NET Core (.NET 8/9/10) developer in Amman. SQL schemas, stored procedures, EF & ADO.NET, Kafka — including AVL tracking for ~50,000 vehicles.",
  openGraph: {
    title: "Musab Atieh — ASP.NET Core & SQL Backend Developer",
    description:
      "Hire for ASP.NET Core APIs, SQL Server optimization, live AVL pipelines, and complex CRUD systems. From $20/hr.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${manrope.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

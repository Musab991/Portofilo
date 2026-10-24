import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { siteUrl } from "@/lib/paths";
import { arabicFont, bodyFont } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ورشات م. مصعب عطية",
    template: "%s — ورشات م. مصعب عطية",
  },
  description:
    "ورشات عملية أونلاين: ابنِ مشروع Full Stack حقيقي بإيدك بـ C# و ASP.NET Core و SQL Server.",
  openGraph: { type: "website", locale: "ar_JO" },
};

export default function WorkshopsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${bodyFont.variable} ${arabicFont.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">
          انتقل للمحتوى
        </a>
        <Header lang="ar" />
        <main id="main">{children}</main>
        <Footer lang="ar" />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { arabicFont, bodyFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page not found — Musab Atieh",
};

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${bodyFont.variable} ${arabicFont.variable}`}>
      <body>
        <main id="main" className="container section">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="lead">The page you are looking for does not exist.</p>
          <p className="lead" lang="ar" dir="rtl">
            الصفحة اللي بتدوّر عليها مش موجودة.
          </p>
          <div className="btn-row">
            <Link className="btn btn-primary" href="/">
              Home
            </Link>
            <Link className="btn btn-secondary" href="/workshops/" lang="ar">
              الورشات
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}

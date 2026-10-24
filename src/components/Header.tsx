"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navLinks, site } from "@/data/portfolio";
import styles from "./Header.module.css";

type Props = {
  /** "ar" shows Arabic labels (workshop pages). */
  lang?: "en" | "ar";
};

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function Header({ lang = "en" }: Props) {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const ar = lang === "ar";

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className={`no-print ${styles.header}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} onClick={() => setOpen(false)}>
          {ar ? "م. مصعب عطية" : site.brand}
        </Link>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={styles.menuIcon} data-open={open} aria-hidden="true" />
          {ar ? "القائمة" : "Menu"}
        </button>
        <nav
          id="site-nav"
          aria-label={ar ? "القائمة الرئيسية" : "Main"}
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
        >
          <ul>
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              const isWorkshops = link.href === "/workshops/";
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`${styles.link} ${isWorkshops ? styles.accent : ""}`}
                    onClick={() => setOpen(false)}
                  >
                    {ar ? link.labelAr : link.label}
                    {!ar && isWorkshops && (
                      <span lang="ar" className={styles.arHint}>
                        {" "}
                        ورشات
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

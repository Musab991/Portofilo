"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/portfolio";
import styles from "./Header.module.css";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <a href="#top" className={styles.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={site.photo}
            alt=""
            className={styles.brandPhoto}
            width={36}
            height={36}
          />
          {site.brand}
        </a>
        <button
          type="button"
          className={styles.menuBtn}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className={styles.menuIcon} data-open={open} />
        </button>
        <nav
          id="site-nav"
          className={`${styles.nav} ${open ? styles.navOpen : ""}`}
        >
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className={styles.navCta}
            onClick={() => setOpen(false)}
          >
            Hire me
          </a>
        </nav>
      </div>
    </header>
  );
}

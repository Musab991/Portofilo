"use client";

import { FormEvent, useState } from "react";
import { site } from "@/data/portfolio";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();

    const subject = encodeURIComponent(`Project inquiry from ${name || "portfolio"}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );

    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <label className={styles.field}>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required />
      </label>
      <label className={`${styles.field} ${styles.full}`}>
        <span>Project details</span>
        <textarea
          name="message"
          rows={5}
          required
          placeholder="Timeline, budget range, and what you need built…"
        />
      </label>
      <div className={styles.actions}>
        <button type="submit" className={styles.submit}>
          Send message
        </button>
        <p className={styles.note}>
          Or email directly:{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </div>
      {status === "sent" && (
        <p className={styles.status} role="status">
          Your mail app should open now. If it doesn&apos;t, write me at{" "}
          {site.email} — I usually reply within {site.replyWithin}.
        </p>
      )}
    </form>
  );
}

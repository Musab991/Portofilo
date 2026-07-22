"use client";

import { FormEvent, useEffect, useState } from "react";
import { site } from "@/data/portfolio";
import styles from "./ContactForm.module.css";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [error, setError] = useState("");
  const [startedAt, setStartedAt] = useState(0);

  useEffect(() => {
    setStartedAt(Date.now());
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          message: String(data.get("message") || "").trim(),
          website: String(data.get("website") || "").trim(), // honeypot
          startedAt,
        }),
      });

      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        setStatus("error");
        setError(result.error || "Something went wrong. Please email me directly.");
        return;
      }

      setStatus("sent");
      form.reset();
      setStartedAt(Date.now());
    } catch {
      setStatus("error");
      setError("Network error. Please email me directly or call/WhatsApp.");
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate={false}>
      {/* Honeypot — hidden from people, bots often fill it */}
      <label className={styles.honeypot} aria-hidden="true">
        <span>Website</span>
        <input
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <label className={styles.field}>
        <span>Name</span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
        />
      </label>
      <label className={styles.field}>
        <span>Email</span>
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={160}
        />
      </label>
      <label className={`${styles.field} ${styles.full}`}>
        <span>Project details</span>
        <textarea
          name="message"
          rows={5}
          required
          maxLength={3000}
          placeholder="Timeline, budget range, and what you need built…"
        />
      </label>
      <div className={styles.actions}>
        <button
          type="submit"
          className={styles.submit}
          disabled={status === "sending"}
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className={styles.note}>
          Or email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {" · "}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp {site.phone}
          </a>
        </p>
      </div>
      {status === "sent" && (
        <p className={styles.status} role="status">
          Message sent. I usually reply within {site.replyWithin}.
        </p>
      )}
      {status === "error" && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

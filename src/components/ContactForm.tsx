"use client";

import { FormEvent, useEffect, useState } from "react";
import { site } from "@/data/portfolio";
import styles from "./ContactForm.module.css";

const MIN_FILL_MS = 2500;

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
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const honeypot = String(data.get("company_fax") || "").trim();

    if (honeypot) {
      setStatus("sent");
      form.reset();
      return;
    }

    if (!name || !email || !message) {
      setStatus("error");
      setError("Please fill in all fields.");
      return;
    }

    if (Date.now() - startedAt < MIN_FILL_MS) {
      setStatus("error");
      setError("Please take a moment and try again.");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _replyto: email,
            _subject: `Portfolio contact from ${name}`,
            _template: "table",
            _captcha: "false",
          }),
        }
      );

      const result = (await response.json()) as {
        success?: string | boolean;
        message?: string;
      };

      const ok =
        result.success === true ||
        result.success === "true" ||
        response.ok;

      if (!ok) {
        const msg = result.message || "";
        if (/activat|confirm|verify/i.test(msg)) {
          setStatus("error");
          setError(
            "One-time setup: check atiehmusab@gmail.com (Inbox + Spam) for a FormSubmit activation email, click Confirm, then try again."
          );
          return;
        }
        throw new Error(msg || "Send failed");
      }

      setStatus("sent");
      form.reset();
      setStartedAt(Date.now());
    } catch {
      setStatus("error");
      setError(
        `Could not send. WhatsApp ${site.phone} or email ${site.email}.`
      );
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} autoComplete="on">
      <label className={styles.honeypot} aria-hidden="true">
        <span>Company fax</span>
        <input
          name="company_fax"
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
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
          <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
          {" · "}
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer">
            WhatsApp
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

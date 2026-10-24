"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import styles from "./RegisterForm.module.css";

/** One cohort the student can register for (serializable; built on the server from the .md data). */
export type RegisterCohort = {
  id: string;
  label: string;
  startDate: string | null;
  /** From the cohort's `registrationEmail` in content/workshops/*.md — the only source of the inbox. */
  registrationEmail: string;
  /** e.g. "تسجيل جديد — مخيم تجهيز الخريجين (Level 1) — دفعة 21 ديسمبر 2026" (name is appended). */
  subjectPrefix: string;
};

type Props = {
  levelSlug: string;
  cohorts: RegisterCohort[];
  telegramUrl: string;
};

const MIN_FILL_MS = 2500;
const AGE_MIN = 15;
const AGE_MAX = 70;

const SITUATIONS = ["طالب جامعي", "خريج", "غير ذلك"];
const GOALS = ["مشروع تخرج", "مشروع للـ CV والشغل", "مشروع للسوق (فريلانس)"];

type Field = "cohort" | "name" | "email" | "age" | "situation" | "goal";
type Errors = Partial<Record<Field, string>>;
const ORDER: Field[] = ["cohort", "name", "email", "age", "situation", "goal"];

export function RegisterForm({ levelSlug, cohorts, telegramUrl }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sendError, setSendError] = useState("");
  const startedAt = useRef(0);
  const successRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const single = cohorts.length === 1 ? cohorts[0] : null;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status === "sent") successRef.current?.focus();
  }, [status]);

  function validate(data: FormData): Errors {
    const next: Errors = {};
    if (!single && !cohorts.some((c) => c.id === data.get("cohort"))) next.cohort = "اختار الدفعة.";
    if (!String(data.get("name") || "").trim()) next.name = "اكتب اسمك.";
    const email = String(data.get("email") || "").trim();
    if (!email) next.email = "اكتب إيميلك، عليه بنبعتلك رابط Teams.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "الإيميل مش صحيح، تأكد منه (مثال: name@gmail.com).";
    const ageText = String(data.get("age") || "").trim();
    const age = Number(ageText);
    if (!ageText) next.age = "اكتب عمرك.";
    else if (!Number.isInteger(age) || age < AGE_MIN || age > AGE_MAX) {
      next.age = `العمر لازم يكون رقم بين ${AGE_MIN} و ${AGE_MAX}.`;
    }
    if (!SITUATIONS.includes(String(data.get("situation")))) next.situation = "اختار وضعك الحالي.";
    if (!GOALS.includes(String(data.get("goal")))) next.goal = "اختار الهدف من المشروع.";
    return next;
  }

  function focusFirst(found: Errors) {
    const first = ORDER.find((f) => found[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
    el?.focus();
  }

  function clearError(event: FormEvent<HTMLFormElement>) {
    const name = (event.target as HTMLInputElement).name as Field;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    const honeypot = String(data.get("_honey") || "").trim();
    if (honeypot) {
      // Bots fill hidden fields: pretend it worked, send nothing.
      setStatus("sent");
      return;
    }

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus("idle");
      focusFirst(found);
      return;
    }

    if (Date.now() - startedAt.current < MIN_FILL_MS) {
      setStatus("error");
      setSendError("خذ ثانية وجرّب كمان مرة.");
      return;
    }

    const cohort = single ?? cohorts.find((c) => c.id === data.get("cohort"))!;
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();

    setStatus("sending");
    setSendError("");

    try {
      const response = await fetch(
        `https://formsubmit.co/ajax/${encodeURIComponent(cohort.registrationEmail)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name,
            email,
            age: String(data.get("age")).trim(),
            current_status: String(data.get("situation")),
            goal: String(data.get("goal")),
            note: String(data.get("note") || "").trim() || "—",
            level: levelSlug,
            cohort_id: cohort.id,
            cohort_start: cohort.startDate ?? "—",
            _subject: `${cohort.subjectPrefix} — ${name}`,
            _replyto: email,
            _template: "table",
            _captcha: "false",
            _honey: "",
          }),
        }
      );
      const result = (await response.json().catch(() => ({}))) as {
        success?: string | boolean;
        message?: string;
      };
      const ok = result.success === true || result.success === "true";
      if (!ok) {
        // First ever submission: FormSubmit emails the owner an activation link and refuses until confirmed.
        if (/activat|confirm|verify/i.test(result.message || "")) {
          throw new Error("activation");
        }
        throw new Error(result.message || "Send failed");
      }
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
      setSendError("ما قدرنا نرسل طلبك هلأ. جرّب كمان مرة بعد شوي، أو راسلنا على التلغرام وبنسجّلك.");
    }
  }

  if (status === "sent") {
    return (
      <div ref={successRef} className={styles.success} role="status" tabIndex={-1}>
        <p className={styles.successTitle}>وصلنا طلبك ✅</p>
        <p>
          رح نتواصل معك على الإيميل قبل بداية المخيم برابط Teams. أول لقاءين تجربة بدون دفع؛ إذا
          كمّلت بتدفع عن طريق CliQ وبنضيفك لجروب التلغرام الخاص بالدفعة.
        </p>
        <p className={styles.hint}>
          عندك سؤال لحد ما نتواصل معك؟{" "}
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            راسلنا على التلغرام
          </a>
        </p>
      </div>
    );
  }

  const describe = (field: Field) => (errors[field] ? `${field}-error` : undefined);
  const errorText = (field: Field) =>
    errors[field] ? (
      <span id={`${field}-error`} className={styles.fieldError}>
        {errors[field]}
      </span>
    ) : null;

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} onChange={clearError} noValidate>
      <label className={styles.honeypot} aria-hidden="true">
        <span>اتركه فاضي</span>
        <input name="_honey" type="text" tabIndex={-1} autoComplete="off" />
      </label>

      {!single && (
        <fieldset className={styles.group} aria-describedby={describe("cohort")} aria-invalid={!!errors.cohort}>
          <legend>
            الدفعة <span className={styles.req}>(مطلوب)</span>
          </legend>
          {errorText("cohort")}
          <div className={styles.options}>
            {cohorts.map((c, i) => (
              <label key={c.id} className={styles.option}>
                <input type="radio" name="cohort" value={c.id} defaultChecked={i === 0} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label className={styles.field}>
        <span>
          الاسم <span className={styles.req}>(مطلوب)</span>
        </span>
        <input
          name="name"
          type="text"
          autoComplete="name"
          maxLength={100}
          required
          aria-invalid={!!errors.name}
          aria-describedby={describe("name")}
        />
        {errorText("name")}
      </label>

      <label className={styles.field}>
        <span>
          الإيميل <span className={styles.req}>(مطلوب)</span>
        </span>
        <span id="email-hint" className={styles.hint}>
          عليه بنبعتلك تأكيد التسجيل ورابط Teams.
        </span>
        <input
          name="email"
          type="email"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          maxLength={160}
          required
          aria-invalid={!!errors.email}
          aria-describedby={["email-hint", describe("email")].filter(Boolean).join(" ")}
        />
        {errorText("email")}
      </label>

      <label className={`${styles.field} ${styles.short}`}>
        <span>
          العمر <span className={styles.req}>(مطلوب)</span>
        </span>
        <input
          name="age"
          type="number"
          inputMode="numeric"
          min={AGE_MIN}
          max={AGE_MAX}
          step={1}
          required
          aria-invalid={!!errors.age}
          aria-describedby={describe("age")}
        />
        {errorText("age")}
      </label>

      <fieldset className={styles.group} aria-describedby={describe("situation")} aria-invalid={!!errors.situation}>
        <legend>
          الوضع الحالي <span className={styles.req}>(مطلوب)</span>
        </legend>
        {errorText("situation")}
        <div className={styles.options}>
          {SITUATIONS.map((value) => (
            <label key={value} className={styles.option}>
              <input type="radio" name="situation" value={value} required />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={styles.group} aria-describedby={describe("goal")} aria-invalid={!!errors.goal}>
        <legend>
          الهدف من المشروع <span className={styles.req}>(مطلوب)</span>
        </legend>
        {errorText("goal")}
        <div className={styles.options}>
          {GOALS.map((value) => (
            <label key={value} className={styles.option}>
              <input type="radio" name="goal" value={value} required />
              <span>{value}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className={styles.field}>
        <span>
          ملاحظة <span className={styles.optional}>(اختياري)</span>
        </span>
        <textarea name="note" rows={3} maxLength={500} placeholder="مثلاً: فكرة مشروعك، أو أي سؤال" />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={`btn btn-primary ${styles.submit}`} disabled={status === "sending"}>
          {status === "sending" ? "عم نرسل…" : "أرسل طلب التسجيل"}
        </button>
        <p className={styles.hint}>
          عندك سؤال؟{" "}
          <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
            راسلنا على التلغرام
          </a>
        </p>
      </div>

      {status === "error" && (
        <div className={styles.error} role="alert">
          <p>{sendError}</p>
          <p>
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer">
              راسلنا على التلغرام
            </a>
          </p>
        </div>
      )}
    </form>
  );
}

/**
 * Input cleaning + validation for the workshop registration form.
 *
 * The form has no server of its own: values go as JSON to FormSubmit, which emails the owner an
 * HTML table (and the owner may paste rows into Google Sheets later). So every text value is:
 *   1. normalized (NFC), stripped of control chars and invisible zero-width / bidi-override chars,
 *      whitespace collapsed and trimmed — no newline/CR can reach the email subject or headers;
 *   2. checked against an allowlist (name, university) or stripped of `<` `>` (note);
 *   3. guarded against spreadsheet formula injection: a cell starting with = + - @ can run as a
 *      formula in Sheets/Excel. Name and university must start with a letter (or digit for the
 *      university), so they can never start with one of those; the free-text note gets a leading
 *      apostrophe instead (Sheets/Excel then treat it as plain text).
 * The site only renders these values as React text (never dangerouslySetInnerHTML).
 */

export const LIMITS = {
  name: { min: 2, max: 60 },
  university: { min: 2, max: 100 },
  note: { max: 300 },
  email: { max: 100 },
} as const;

/** Zero-width chars, LRM/RLM, bidi embeddings/overrides/isolates, BOM. */
const INVISIBLE = /[​-‏‪-‮⁦-⁩﻿]/g;
/** C0 + DEL + C1 control characters (includes \n, \r, \t). */
const CONTROL = /[\u0000-\u001F\u007F-\u009F]/g;

/** One-line value: no control chars, no invisible chars, single spaces, trimmed. */
export function cleanLine(value: unknown): string {
  return String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(CONTROL, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Free-text note: keeps line breaks (max one empty line), strips < > and other control chars. */
export function cleanNote(value: unknown): string {
  return String(value ?? "")
    .normalize("NFC")
    .replace(INVISIBLE, "")
    .replace(/\r\n?/g, "\n")
    .replace(/[\u0000-\u0009\u000B-\u001F\u007F-\u009F]/g, " ")
    .replace(/[<>]/g, "")
    .replace(/[^\S\n]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Spreadsheet formula guard for free text (see file comment). */
export function guardFormula(value: string): string {
  return /^[=+\-@]/.test(value) ? `'${value}` : value;
}

// Arabic letters (incl. extended letters), diacritics (tashkeel), superscript alef, tatweel.
const AR = "\\u0621-\\u063A\\u0640-\\u065F\\u0670-\\u06D3";
// Latin letters, incl. accented ones.
const LATIN = "A-Za-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u024F";
const PUNCT = " .\\-'()&,\\u060C"; // ، = Arabic comma
const DIGITS = "0-9\\u0660-\\u0669";

const ALLOWED = {
  name: new RegExp(`^[${AR}${LATIN}${PUNCT}]+$`),
  university: new RegExp(`^[${AR}${LATIN}${DIGITS}${PUNCT}]+$`),
};
const FIRST = {
  name: new RegExp(`^[${AR}${LATIN}]`),
  university: new RegExp(`^[${AR}${LATIN}${DIGITS}]`),
};
const URL_LIKE =
  /(\b[a-z][a-z0-9+.-]*:\/\/|\bwww\.|\b[a-z0-9-]+\.(com|net|org|edu|gov|io|co|jo|info|me|ly|app|dev|xyz|site|online|link)\b)/i;

const LABEL = { name: "الاسم", university: "اسم الجامعة" } as const;

/** Returns an Arabic error for a cleaned name/university value, or null when it is fine. */
export function checkText(kind: "name" | "university", value: string, requiredMessage: string): string | null {
  const label = LABEL[kind];
  const { min, max } = LIMITS[kind];
  if (!value) return requiredMessage;
  if (/[<>]/.test(value)) return `${label} ما بقبل رموز مثل < أو >.`;
  if (/\{\{|\}\}/.test(value)) return `${label} ما بقبل الأقواس {{ }}.`;
  if (/\b(javascript|vbscript|data)\s*:/i.test(value) || URL_LIKE.test(value)) {
    return `ممنوع روابط أو أكواد في ${label}.`;
  }
  if (value.length > max) return `${label} طويل، الحد الأقصى ${max} حرف.`;
  if (value.length < min) return `${label} قصير، اكتبه كامل.`;
  if (!FIRST[kind].test(value)) {
    return kind === "name"
      ? "الاسم لازم يبلش بحرف، مش برمز مثل = + - @."
      : "اسم الجامعة لازم يبلش بحرف أو رقم، مش برمز مثل = + - @.";
  }
  if (!ALLOWED[kind].test(value)) {
    return kind === "name"
      ? "الاسم لازم يكون حروف عربية أو إنجليزية بس (مسموح كمان . - ' ( ) & ,)."
      : "اسم الجامعة لازم يكون حروف عربية أو إنجليزية وأرقام بس (مسموح كمان . - ' ( ) & ,).";
  }
  return null;
}

/** Strict-ish email check (ASCII only, starts with a letter/digit, so never a formula). */
export const EMAIL_RE =
  /^[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,63})@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)*\.[A-Za-z]{2,24}$/;

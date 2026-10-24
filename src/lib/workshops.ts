/**
 * Build-time loader for content/workshops/*.md (server only — uses fs).
 * Files starting with "_" are ignored; roadmap.md is the roadmap section.
 * Invalid data throws, so `next build` (and the deploy Action) fails loudly
 * instead of shipping a broken page.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "workshops");

export type LevelStatus = "active" | "coming-soon" | "draft" | "archived";
export type CohortStatus = "open" | "full" | "coming-soon" | "closed";
export type Mode = "online" | "in-person" | "hybrid";

export type Cohort = {
  id: string;
  name: string;
  status: CohortStatus;
  startDate: string | null;
  startDateConfirmed: boolean;
  schedule: string | null;
  sessionsPerWeek: number | null;
  durationWeeks: number | null;
  seats: number | null;
  seatsLeft: number | null;
  price: number | null;
  currency: string;
  earlyBird: { price: number; until: string } | null;
  mode: Mode | null;
  location: string | null;
  /** Optional external form (e.g. a future Google Form). The on-site form is preferred. */
  registrationUrl: string | null;
  /** Inbox for the on-site registration form (FormSubmit). Set = on-site form enabled. */
  registrationEmail: string | null;
  waitlistUrl: string | null;
  paymentUrl: string | null;
  paymentMethods: string[];
  registrationDeadline: string | null;
  notes: string | null;
};

export type Level = {
  slug: string;
  title: string;
  titleEn: string | null;
  level: number;
  status: LevelStatus;
  summary: string;
  prerequisites: string[];
  stack: string[];
  durationWeeks: number | null;
  sessionsPerWeek: number | null;
  sessionHours: number | null;
  totalSessions: number | null;
  language: string | null;
  certificate: boolean | null;
  telegramUrl: string;
  refundPolicy: string | null;
  order: number;
  cohorts: Cohort[];
  html: string;
};

export type RoadmapStep = {
  key: string;
  title: string;
  text: string;
  link: string | null;
};

export type Roadmap = {
  title: string;
  tagline: string;
  steps: RoadmapStep[];
  html: string;
};

const LEVEL_STATUSES: LevelStatus[] = ["active", "coming-soon", "draft", "archived"];
const COHORT_STATUSES: CohortStatus[] = ["open", "full", "coming-soon", "closed"];
const MODES: Mode[] = ["online", "in-person", "hybrid"];

class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content/workshops/${file}] ${message}`);
  }
}

/* ---------- Clean-up: nothing internal reaches students ---------- */

/** Removes owner notes ("TODO (owner)") from text that the site displays. */
function cleanText(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, "") // HTML comments (internal notes)
    .replace(/\s*—\s*TODO \(owner\)/g, "") // "(IIS أو خيار آخر — TODO (owner))"
    .replace(/TODO \(owner\):\s*/g, "") // "- TODO (owner): اختيار ..."
    .replace(/\*\*\s+TODO \(owner\)\.?/g, "** بنعلن عنه قريباً.") // FAQ answer that is only a TODO
    .replace(/\s*TODO \(owner\)\.?/g, ""); // trailing TODO after a real sentence
}

/** Chips/list items: cut everything from a TODO marker on; drop items that were only a TODO. */
function cleanItems(items: string[]): string[] {
  return items
    .map((item) => item.replace(/\s*[—–-]?\s*TODO\b[\s\S]*$/, "").trim())
    .filter(Boolean);
}

function assertNoTodo(file: string, label: string, text: string) {
  if (/\bTODO\b/.test(text)) {
    throw new ContentError(
      file,
      `"${label}" still contains "TODO" after clean-up. Use null + a YAML comment instead.`
    );
  }
}

/* ---------- Validation helpers ---------- */

type Raw = Record<string, unknown>;

function str(file: string, obj: Raw, key: string, required = true): string | null {
  const value = obj[key];
  if (value === undefined || value === null || value === "") {
    if (required) throw new ContentError(file, `missing required field "${key}"`);
    return null;
  }
  if (typeof value !== "string") throw new ContentError(file, `"${key}" must be a string`);
  return value;
}

function num(file: string, obj: Raw, key: string): number | null {
  const value = obj[key];
  if (value === undefined || value === null) return null;
  if (typeof value !== "number") throw new ContentError(file, `"${key}" must be a number or null`);
  return value;
}

function list(file: string, obj: Raw, key: string, required = true): string[] {
  const value = obj[key];
  if (value === undefined || value === null) {
    if (required) throw new ContentError(file, `missing required list "${key}"`);
    return [];
  }
  if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
    throw new ContentError(file, `"${key}" must be a list of strings`);
  }
  return value as string[];
}

function oneOf<T extends string>(file: string, value: unknown, allowed: T[], key: string): T {
  if (!allowed.includes(value as T)) {
    throw new ContentError(file, `"${key}" must be one of: ${allowed.join(", ")} (got "${String(value)}")`);
  }
  return value as T;
}

function date(file: string, obj: Raw, key: string): string | null {
  const value = obj[key];
  if (value === undefined || value === null) return null;
  // YAML may parse unquoted dates as Date objects.
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : String(value);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) throw new ContentError(file, `"${key}" must be YYYY-MM-DD`);
  return text;
}

function parseCohort(file: string, raw: Raw): Cohort {
  const earlyBird = raw.earlyBird as Raw | null | undefined;
  return {
    id: String(str(file, raw, "id")),
    name: String(str(file, raw, "name")),
    status: oneOf(file, raw.status, COHORT_STATUSES, "cohort.status"),
    startDate: date(file, raw, "startDate"),
    startDateConfirmed: raw.startDateConfirmed === true,
    schedule: str(file, raw, "schedule", false),
    sessionsPerWeek: num(file, raw, "sessionsPerWeek"),
    durationWeeks: num(file, raw, "durationWeeks"),
    seats: num(file, raw, "seats"),
    seatsLeft: num(file, raw, "seatsLeft"),
    price: num(file, raw, "price"),
    currency: str(file, raw, "currency", false) ?? "JOD",
    earlyBird:
      earlyBird && typeof earlyBird.price === "number"
        ? { price: earlyBird.price, until: String(date(file, earlyBird, "until")) }
        : null,
    mode: raw.mode == null ? null : oneOf(file, raw.mode, MODES, "cohort.mode"),
    location: str(file, raw, "location", false),
    registrationUrl: url(str(file, raw, "registrationUrl", false)),
    registrationEmail: email(file, str(file, raw, "registrationEmail", false)),
    waitlistUrl: url(str(file, raw, "waitlistUrl", false)),
    paymentUrl: url(str(file, raw, "paymentUrl", false)),
    paymentMethods: cleanItems(list(file, raw, "paymentMethods", false)),
    registrationDeadline: date(file, raw, "registrationDeadline"),
    notes: str(file, raw, "notes", false),
  };
}

/** Only real http(s) links count; anything else (TODO, placeholders) is treated as missing. */
function url(value: string | null): string | null {
  return value && /^https?:\/\//.test(value) && !/TODO/i.test(value) ? value : null;
}

/** An email address, or the random FormSubmit alias from its activation email (hides the address). */
function email(file: string, value: string | null): string | null {
  if (value === null) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && !/^[a-z0-9]{16,}$/i.test(value)) {
    throw new ContentError(
      file,
      `"registrationEmail" must be an email address or a FormSubmit alias (got "${value}")`
    );
  }
  return value;
}

function render(markdown: string): string {
  return marked.parse(markdown, { async: false, gfm: true });
}

function readFile(file: string) {
  return matter(fs.readFileSync(path.join(DIR, file), "utf8"));
}

function parseLevel(file: string): Level {
  const { data, content } = readFile(file);
  const raw = data as Raw;
  const slug = String(str(file, raw, "slug"));
  if (slug !== file.replace(/\.md$/, "")) {
    throw new ContentError(file, `slug "${slug}" must equal the file name without .md`);
  }
  if (slug === "register") {
    throw new ContentError(file, `slug "register" is reserved for /workshops/register/`);
  }
  const level = num(file, raw, "level");
  if (level === null) throw new ContentError(file, `missing required field "level"`);
  const status = oneOf(file, raw.status, LEVEL_STATUSES, "status");
  const certificate = raw.certificate;
  if (certificate !== undefined && certificate !== null && typeof certificate !== "boolean") {
    throw new ContentError(file, `"certificate" must be true, false or null`);
  }
  const cohortsRaw = raw.cohorts ?? [];
  if (!Array.isArray(cohortsRaw)) throw new ContentError(file, `"cohorts" must be a list`);
  const cohorts = cohortsRaw.map((c) => parseCohort(file, c as Raw));
  const ids = new Set<string>();
  for (const cohort of cohorts) {
    if (ids.has(cohort.id)) throw new ContentError(file, `duplicate cohort id "${cohort.id}"`);
    ids.add(cohort.id);
  }

  const body = cleanText(content);
  assertNoTodo(file, "body", body);
  const summary = cleanText(String(str(file, raw, "summary")));
  const refundPolicy = str(file, raw, "refundPolicy", false);
  if (status === "active" && !refundPolicy) {
    throw new ContentError(file, `"refundPolicy" is required when status is "active"`);
  }
  for (const [label, text] of [
    ["title", String(str(file, raw, "title"))],
    ["summary", summary],
    ["refundPolicy", refundPolicy ?? ""],
    ...cohorts.flatMap((c) => [
      [`cohort ${c.id} name`, c.name],
      [`cohort ${c.id} schedule`, c.schedule ?? ""],
      [`cohort ${c.id} notes`, c.notes ?? ""],
      [`cohort ${c.id} location`, c.location ?? ""],
    ]),
  ]) {
    assertNoTodo(file, label, text);
  }

  return {
    slug,
    title: String(str(file, raw, "title")),
    titleEn: str(file, raw, "titleEn", false),
    level,
    status,
    summary,
    prerequisites: cleanItems(list(file, raw, "prerequisites")),
    stack: cleanItems(list(file, raw, "stack")),
    durationWeeks: num(file, raw, "durationWeeks"),
    sessionsPerWeek: num(file, raw, "sessionsPerWeek"),
    sessionHours: num(file, raw, "sessionHours"),
    totalSessions: num(file, raw, "totalSessions"),
    language: str(file, raw, "language", false),
    certificate: typeof certificate === "boolean" ? certificate : null,
    telegramUrl: url(str(file, raw, "telegramUrl")) ?? "https://t.me/musabatieh",
    refundPolicy,
    order: num(file, raw, "order") ?? level,
    cohorts,
    html: render(body),
  };
}

/* ---------- Public API ---------- */

let cache: Level[] | null = null;

/** All visible levels (archived hidden), sorted by order/level. */
export function getLevels(): Level[] {
  if (!cache) {
    cache = fs
      .readdirSync(DIR)
      .filter((f) => f.endsWith(".md") && !f.startsWith("_") && f !== "roadmap.md")
      .map(parseLevel)
      .filter((level) => level.status !== "archived")
      .sort((a, b) => a.order - b.order);
  }
  return cache;
}

export function getLevel(slug: string): Level | undefined {
  return getLevels().find((level) => level.slug === slug);
}

export function getRoadmap(): Roadmap {
  const file = "roadmap.md";
  const { data, content } = readFile(file);
  const raw = data as Raw;
  const stepsRaw = raw.steps;
  if (!Array.isArray(stepsRaw)) throw new ContentError(file, `"steps" must be a list`);
  const slugs = new Set(getLevels().map((l) => l.slug));
  const body = cleanText(content);
  assertNoTodo(file, "body", body);
  return {
    title: String(str(file, raw, "title")),
    tagline: String(str(file, raw, "tagline")),
    steps: stepsRaw.map((s) => {
      const step = s as Raw;
      const link = str(file, step, "link", false);
      return {
        key: String(str(file, step, "key")),
        title: String(str(file, step, "title")),
        text: String(str(file, step, "text")),
        // Only link to levels that actually have a page.
        link: link && slugs.has(link) ? link : null,
      };
    }),
    html: render(body),
  };
}

const COHORT_RANK: Record<CohortStatus, number> = { open: 0, "coming-soon": 1, full: 2, closed: 9 };

/** Visible cohorts of a level, best first (status is the source of truth, then start date). */
export function visibleCohorts(level: Level): Cohort[] {
  return level.cohorts
    .filter((c) => c.status !== "closed")
    .sort(
      (a, b) =>
        COHORT_RANK[a.status] - COHORT_RANK[b.status] ||
        (a.startDate ?? "9999").localeCompare(b.startDate ?? "9999")
    );
}

/** The cohort for the "next cohort" banner across all levels, or null. */
export function getNextCohort(): { level: Level; cohort: Cohort } | null {
  const all = getLevels().flatMap((level) =>
    visibleCohorts(level).map((cohort) => ({ level, cohort }))
  );
  all.sort(
    (a, b) =>
      COHORT_RANK[a.cohort.status] - COHORT_RANK[b.cohort.status] ||
      (a.cohort.startDate ?? "9999").localeCompare(b.cohort.startDate ?? "9999")
  );
  return all[0] ?? null;
}

/* ---------- Registration ---------- */

/** A cohort accepts registrations when it is "open" and has an on-site inbox or an external form. */
export function isRegistrable(cohort: Cohort): boolean {
  return cohort.status === "open" && Boolean(cohort.registrationEmail || cohort.registrationUrl);
}

/** On-site register page of a level (without basePath; use with next/link). */
export function registerPath(level: Level): string {
  return `/workshops/${level.slug}/register/`;
}

/**
 * Where the "سجّل الآن" button goes: the on-site form when the cohort has a
 * registrationEmail, otherwise its external registrationUrl. null = no button.
 */
export function registrationLink(
  level: Level,
  cohort: Cohort | null
): { href: string; external: boolean } | null {
  if (!cohort || !isRegistrable(cohort)) return null;
  if (cohort.registrationEmail) return { href: registerPath(level), external: false };
  return { href: String(cohort.registrationUrl), external: true };
}

/** Cohorts of a level that take sign-ups through the on-site form, best first. */
export function formCohorts(level: Level): Cohort[] {
  return visibleCohorts(level).filter((c) => isRegistrable(c) && c.registrationEmail);
}

/** Levels with at least one cohort that takes sign-ups through the on-site form. */
export function getRegistrableLevels(): Level[] {
  return getLevels().filter((level) => formCohorts(level).length > 0);
}

/** "مخيم تجهيز الخريجين: من مشروع التخرج لأول وظيفة" → "مخيم تجهيز الخريجين" */
export function shortTitle(level: Level): string {
  return level.title.split(/[:：]/)[0].trim();
}

const SUBJECT_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/**
 * Email subject without the student's name (the form appends " — <الاسم>"), e.g.
 * "تسجيل جديد — مخيم تجهيز الخريجين (Level 1) — دفعة 21 ديسمبر 2026".
 */
export function registrationSubject(level: Level, cohort: Cohort): string {
  let cohortLabel = cohort.name;
  if (cohort.startDate) {
    const [y, m, d] = cohort.startDate.split("-").map(Number);
    cohortLabel = `دفعة ${d} ${SUBJECT_MONTHS[m - 1]} ${y}`;
  }
  return `تسجيل جديد — ${shortTitle(level)} (Level ${level.level}) — ${cohortLabel}`;
}

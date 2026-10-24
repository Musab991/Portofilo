import type { Cohort, CohortStatus, Level, Mode } from "@/lib/workshops";

// Levantine month names (as used in the workshop posts).
const MONTHS = [
  "كانون الثاني", "شباط", "آذار", "نيسان", "أيار", "حزيران",
  "تموز", "آب", "أيلول", "تشرين الأول", "تشرين الثاني", "كانون الأول",
];
const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

/** "2026-12-21" → "الاثنين 21 كانون الأول 2026" */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const day = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[day]} ${d} ${MONTHS[m - 1]} ${y}`;
}

const CURRENCIES: Record<string, string> = { JOD: "دينار أردني", USD: "دولار" };

export function formatPrice(price: number | null, currency: string): string {
  if (price === null) return "تواصل معنا";
  return `${price} ${CURRENCIES[currency] ?? currency}`;
}

const MODES: Record<Mode, string> = { online: "أونلاين", "in-person": "حضوري", hybrid: "حضوري وأونلاين" };

export function formatMode(mode: Mode | null, location: string | null): string | null {
  if (!mode) return location;
  return location ? `${MODES[mode]} — ${location}` : MODES[mode];
}

/** "6 أسابيع · 12 لقاء · 3 ساعات للقاء" — only the parts that are known. */
export function formatDuration(level: Level, cohort?: Cohort): string | null {
  const weeks = cohort?.durationWeeks ?? level.durationWeeks;
  const perWeek = cohort?.sessionsPerWeek ?? level.sessionsPerWeek;
  const total = level.totalSessions ?? (weeks && perWeek ? weeks * perWeek : null);
  const parts = [
    weeks ? `${weeks} ${weeks <= 10 && weeks > 2 ? "أسابيع" : "أسبوع"}` : null,
    total ? `${total} لقاء` : null,
    level.sessionHours ? `${level.sessionHours} ${level.sessionHours <= 10 && level.sessionHours > 2 ? "ساعات" : "ساعة"} للقاء` : null,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : null;
}

export const COHORT_LABEL: Record<CohortStatus, { text: string; tone: string }> = {
  open: { text: "التسجيل مفتوح", tone: "pill-success" },
  full: { text: "المقاعد اكتملت", tone: "pill-warning" },
  "coming-soon": { text: "التسجيل قريباً", tone: "" },
  closed: { text: "انتهت", tone: "pill-muted" },
};

export const LEVEL_LABEL: Record<Level["status"], { text: string; tone: string } | null> = {
  active: null,
  "coming-soon": { text: "قريباً", tone: "" },
  draft: { text: "مسودة", tone: "pill-muted" },
  archived: null,
};

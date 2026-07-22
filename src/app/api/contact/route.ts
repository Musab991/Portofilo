import { NextRequest, NextResponse } from "next/server";

const TO_EMAIL = "atiehmusab@gmail.com";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 3;
const MIN_FILL_MS = 3000;
const MAX_NAME = 100;
const MAX_EMAIL = 160;
const MAX_MESSAGE = 3000;

type Bucket = { count: number; resetAt: number };
const hits = new Map<string, Bucket>();

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const current = hits.get(ip);

  if (!current || now > current.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (current.count >= MAX_REQUESTS) return false;
  current.count += 1;
  hits.set(ip, current);
  return true;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function looksLikeSpam(message: string): boolean {
  const lower = message.toLowerCase();
  const urlCount = (message.match(/https?:\/\//gi) || []).length;
  if (urlCount >= 4) return true;
  const spamBits = [
    "crypto airdrop",
    "seo backlink",
    "buy followers",
    "casino bonus",
    "viagra",
  ];
  return spamBits.some((bit) => lower.includes(bit));
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many messages. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot — bots fill hidden fields; humans never see this.
  const honeypot = String(body.website || "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true }); // fake success, drop silently
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const startedAt = Number(body.startedAt || 0);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in name, email, and project details." },
      { status: 400 }
    );
  }

  if (name.length > MAX_NAME || email.length > MAX_EMAIL || message.length > MAX_MESSAGE) {
    return NextResponse.json(
      { ok: false, error: "One of the fields is too long." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return NextResponse.json(
      { ok: false, error: "Please take a moment and try again." },
      { status: 400 }
    );
  }

  if (looksLikeSpam(message)) {
    return NextResponse.json({ ok: true }); // drop quietly
  }

  const subject = `Portfolio contact from ${name}`;
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone (yours for reply): see message if provided`,
    "",
    message,
    "",
    `IP: ${ip}`,
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY;

  try {
    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM || "Portfolio <onboarding@resend.dev>",
          to: [TO_EMAIL],
          reply_to: email,
          subject,
          text,
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("Resend error:", detail);
        return NextResponse.json(
          { ok: false, error: "Could not send message right now. Email me directly." },
          { status: 502 }
        );
      }
    } else {
      // Free path: FormSubmit — first use needs one confirmation click in Gmail.
      const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _subject: subject,
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error("FormSubmit error:", detail);
        return NextResponse.json(
          { ok: false, error: "Could not send message right now. Email me directly." },
          { status: 502 }
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "Could not send message right now. Email me directly." },
      { status: 500 }
    );
  }
}

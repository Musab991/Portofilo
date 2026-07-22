import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const TO_EMAIL = "atiehmusab@gmail.com";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://freelance-portfolio-lyart-one.vercel.app";
const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;
const MIN_FILL_MS = 2500;
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

async function sendWithGmail(opts: {
  name: string;
  email: string;
  message: string;
  subject: string;
  ip: string;
}) {
  const user = process.env.GMAIL_USER || TO_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!pass) return { sent: false as const, reason: "missing_gmail_app_password" };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Portfolio contact" <${user}>`,
    to: TO_EMAIL,
    replyTo: opts.email,
    subject: opts.subject,
    text: [
      `Name: ${opts.name}`,
      `Email: ${opts.email}`,
      "",
      opts.message,
      "",
      `IP: ${opts.ip}`,
    ].join("\n"),
    html: `
      <p><strong>Name:</strong> ${escapeHtml(opts.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(opts.email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(opts.message).replace(/\n/g, "<br/>")}</p>
      <hr/>
      <p style="color:#666;font-size:12px">IP: ${escapeHtml(opts.ip)}</p>
    `,
  });

  return { sent: true as const };
}

async function sendWithWeb3Forms(opts: {
  name: string;
  email: string;
  message: string;
  subject: string;
}) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return { sent: false as const, reason: "missing_web3forms_key" };

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: opts.subject,
      from_name: opts.name,
      email: opts.email,
      message: opts.message,
      to: TO_EMAIL,
    }),
  });

  const data = (await res.json()) as { success?: boolean; message?: string };
  if (!res.ok || !data.success) {
    return {
      sent: false as const,
      reason: "web3forms_failed" as const,
      detail: data.message || "Web3Forms failed",
    };
  }

  return { sent: true as const };
}

async function sendWithFormSubmit(opts: {
  name: string;
  email: string;
  message: string;
  subject: string;
}) {
  const res = await fetch(`https://formsubmit.co/ajax/${TO_EMAIL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Origin: SITE_URL,
      Referer: `${SITE_URL}/`,
    },
    body: JSON.stringify({
      name: opts.name,
      email: opts.email,
      message: opts.message,
      _replyto: opts.email,
      _subject: opts.subject,
      _template: "table",
      _captcha: "false",
    }),
  });

  const raw = await res.text();
  let data: { success?: string | boolean; message?: string } = {};
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    // non-json response
  }

  const msg = String(data.message || raw || "");
  const success = data.success === true || data.success === "true";

  if (success) {
    return { sent: true as const };
  }

  if (/activat|confirm|verify/i.test(msg)) {
    return {
      sent: false as const,
      reason: "activation_required" as const,
      detail: msg,
    };
  }

  return {
    sent: false as const,
    reason: "formsubmit_failed" as const,
    detail: msg || "FormSubmit failed",
  };
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  if (!rateLimit(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many messages. Please try again in a few minutes.",
      },
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

  const honeypot = String(body.company_fax || "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name || "").trim();
  const email = String(body.email || "").trim();
  const message = String(body.message || "").trim();
  const startedAt = Number(body.startedAt || 0);

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please fill in name, email, and project details.",
      },
      { status: 400 }
    );
  }

  if (
    name.length > MAX_NAME ||
    email.length > MAX_EMAIL ||
    message.length > MAX_MESSAGE
  ) {
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
    return NextResponse.json({ ok: true });
  }

  const subject = `Portfolio contact from ${name}`;

  try {
    const gmail = await sendWithGmail({ name, email, message, subject, ip });
    if (gmail.sent) {
      return NextResponse.json({ ok: true, via: "gmail" });
    }

    const web3 = await sendWithWeb3Forms({ name, email, message, subject });
    if (web3.sent) {
      return NextResponse.json({ ok: true, via: "web3forms" });
    }

    const formSubmit = await sendWithFormSubmit({
      name,
      email,
      message,
      subject,
    });

    if (formSubmit.sent) {
      return NextResponse.json({ ok: true, via: "formsubmit" });
    }

    if (formSubmit.reason === "activation_required") {
      return NextResponse.json(
        {
          ok: false,
          error:
            "One-time setup needed: open atiehmusab@gmail.com (Inbox + Spam), find the FormSubmit email, click Activate Form, then send again.",
          code: "activation_required",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error:
          "Email service is not ready yet. WhatsApp +962 780 852 828 or email atiehmusab@gmail.com.",
        detail: "detail" in formSubmit ? formSubmit.detail : undefined,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Could not send right now. WhatsApp +962 780 852 828 or email atiehmusab@gmail.com.",
      },
      { status: 500 }
    );
  }
}

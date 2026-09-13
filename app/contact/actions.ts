"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";
import { site } from "@/lib/site";

const schema = z.object({
  name: z.string().trim().min(1, "Tell me your name.").max(120),
  email: z.string().trim().email("That email address doesn't look right."),
  message: z
    .string()
    .trim()
    .min(10, "A little more than that, please.")
    .max(5000, "That's longer than I can accept — try trimming it."),
});

export type ContactState = {
  status: "idle" | "sent" | "error";
  message?: string;
  errors?: Partial<Record<"name" | "email" | "message", string>>;
  values?: { name: string; email: string; message: string };
};

/**
 * One submission per IP per 30s, and 5 per hour. In-memory, so it resets on
 * redeploy and is per-instance — enough to blunt a bored script, not a
 * substitute for a real limiter if this ever gets attention.
 */
const hits = new Map<string, number[]>();
const HOUR = 60 * 60 * 1000;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < HOUR);
  hits.set(ip, [...recent, now]);
  if (hits.size > 5000) hits.clear();
  return recent.length >= 5 || recent.some((t) => now - t < 30_000);
}

export async function sendMessage(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
  };

  // Honeypot: a real person never fills this in, because they never see it.
  if (String(formData.get("website") ?? "")) {
    return { status: "sent" };
  }

  const parsed = schema.safeParse(values);
  if (!parsed.success) {
    const errors: ContactState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { status: "error", errors, values };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  if (rateLimited(ip)) {
    return {
      status: "error",
      message: "That's a lot of messages. Give it a minute and try again.",
      values,
    };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO ?? site.email;

  if (!apiKey || !from) {
    console.error("Contact form is not configured: set RESEND_API_KEY and CONTACT_FROM.");
    return {
      status: "error",
      message: `The form isn't wired up yet. Email me directly at ${to}.`,
      values,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: parsed.data.email,
      subject: `davidparsons.me — ${parsed.data.name}`,
      text: `${parsed.data.name} <${parsed.data.email}>\n\n${parsed.data.message}`,
    });
    if (error) throw new Error(error.message);
  } catch (cause) {
    console.error("Contact form delivery failed", cause);
    return {
      status: "error",
      message: `That didn't send. Email me directly at ${to}.`,
      values,
    };
  }

  return { status: "sent" };
}

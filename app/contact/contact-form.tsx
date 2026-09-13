"use client";

import { useId, useState } from "react";
import { site } from "@/lib/site";
import { external } from "@/lib/links";

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "editing" | "sending" | "handed-off" | "failed";

const fieldClass =
  "w-full border-0 border-b border-hair bg-transparent px-0 pt-[6px] pb-[10px] font-serif text-[18px] text-ink outline-none transition-colors focus:border-ink";

const labelClass =
  "font-mono text-[11px] tracking-[0.12em] text-muted uppercase";

const linkedin = site.elsewhere.find((e) => e.label === "LinkedIn");

function validate(values: {
  name: string;
  email: string;
  message: string;
}): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Tell me your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "That email address doesn't look right.";
  }
  if (values.message.trim().length < 10) {
    errors.message = "A little more than that, please.";
  }
  return errors;
}

function FieldError({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="font-mono text-[11px] tracking-[0.06em] text-ink">
      {children}
    </p>
  );
}

export function ContactForm() {
  const ids = useId();
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const messageId = `${ids}-message`;

  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("editing");
  // Held in memory only, never written into the markup.
  const [href, setHref] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
    };

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setStatus("sending");
    try {
      const response = await fetch("/contact/compose", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error(String(response.status));
      const { href: composed } = (await response.json()) as { href: string };
      setHref(composed);
      setStatus("handed-off");
      window.location.href = composed;
    } catch {
      setStatus("failed");
    }
  }

  if (status === "handed-off") {
    return (
      <div className="flex flex-col gap-[10px] border-t border-b border-rule py-8">
        <p className="text-[19px]">Your email app should be opening.</p>
        <p className="text-[16px] leading-[1.7] text-muted">
          Your message is waiting there, already addressed — press send and it
          reaches me. If nothing opened,{" "}
          <button
            type="button"
            onClick={() => {
              if (href) window.location.href = href;
            }}
            className="lk font-serif text-[16px] text-muted"
          >
            try again
          </button>
          .
        </p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col gap-[10px] border-t border-b border-rule py-8">
        <p className="text-[19px]">That didn&rsquo;t work.</p>
        <p className="text-[16px] leading-[1.7] text-muted">
          Something went wrong composing the message. Try{" "}
          <button
            type="button"
            onClick={() => setStatus("editing")}
            className="lk font-serif text-[16px] text-muted"
          >
            once more
          </button>
          {linkedin ? (
            <>
              , or reach me on{" "}
              <a className="lk" href={linkedin.href} {...external}>
                LinkedIn
              </a>
            </>
          ) : null}
          .
        </p>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col gap-[30px]" noValidate>
        <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2">
          <div className="flex flex-col gap-[9px]">
            <label htmlFor={nameId} className={labelClass}>
              Name
            </label>
            <input
              id={nameId}
              name="name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? `${nameId}-error` : undefined}
              className={fieldClass}
            />
            <FieldError id={`${nameId}-error`}>{errors.name}</FieldError>
          </div>

          <div className="flex flex-col gap-[9px]">
            <label htmlFor={emailId} className={labelClass}>
              Email
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? `${emailId}-error` : undefined}
              className={fieldClass}
            />
            <FieldError id={`${emailId}-error`}>{errors.email}</FieldError>
          </div>
        </div>

        <div className="flex flex-col gap-[9px]">
          <label htmlFor={messageId} className={labelClass}>
            Message
          </label>
          <textarea
            id={messageId}
            name="message"
            rows={5}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? `${messageId}-error` : undefined}
            className={`${fieldClass} min-h-[116px] resize-y leading-[1.7]`}
          />
          <FieldError id={`${messageId}-error`}>{errors.message}</FieldError>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
          <button
            type="submit"
            disabled={status === "sending"}
            className="inline-flex min-h-[46px] items-center justify-center bg-ink px-[26px] font-mono text-[12px] tracking-[0.12em] text-paper uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status === "sending" ? "One moment…" : "Send"}
          </button>
          <span className="text-[15px] text-faint">
            Opens in your email app. Usually a reply within a day or two.
          </span>
        </div>
      </form>

      <noscript>
        <p className="pt-6 text-[16px] leading-[1.7] text-muted">
          This form needs JavaScript to open your email app. You can reach me on{" "}
          {linkedin ? (
            <a className="lk" href={linkedin.href} {...external}>
              LinkedIn
            </a>
          ) : null}{" "}
          instead.
        </p>
      </noscript>
    </>
  );
}

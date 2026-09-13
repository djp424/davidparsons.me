"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { sendMessage, type ContactState } from "./actions";

const initial: ContactState = { status: "idle" };

const fieldClass =
  "w-full border-0 border-b border-hair bg-transparent px-0 pt-[6px] pb-[10px] font-serif text-[18px] text-ink outline-none transition-colors placeholder:text-transparent focus:border-ink";

const labelClass =
  "font-mono text-[11px] tracking-[0.12em] text-muted uppercase";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-[46px] items-center justify-center bg-ink px-[26px] font-mono text-[12px] tracking-[0.12em] text-paper uppercase transition-opacity hover:opacity-85 disabled:opacity-50"
    >
      {pending ? "Sending…" : "Send"}
    </button>
  );
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
  const [state, action] = useActionState(sendMessage, initial);
  const ids = useId();
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const messageId = `${ids}-message`;

  if (state.status === "sent") {
    return (
      <div className="flex flex-col gap-[10px] border-t border-b border-rule py-8">
        <p className="text-[19px]">Sent — thank you.</p>
        <p className="text-[16px] leading-[1.7] text-muted">
          It&rsquo;s in my inbox. I&rsquo;ll usually reply within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-[30px]" noValidate>
      {state.message ? (
        <p className="border-l border-ink pl-4 text-[16px] leading-[1.7] text-body">
          {state.message}
        </p>
      ) : null}

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
            required
            defaultValue={state.values?.name}
            aria-invalid={Boolean(state.errors?.name)}
            aria-describedby={state.errors?.name ? `${nameId}-error` : undefined}
            className={fieldClass}
          />
          <FieldError id={`${nameId}-error`}>{state.errors?.name}</FieldError>
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
            required
            defaultValue={state.values?.email}
            aria-invalid={Boolean(state.errors?.email)}
            aria-describedby={
              state.errors?.email ? `${emailId}-error` : undefined
            }
            className={fieldClass}
          />
          <FieldError id={`${emailId}-error`}>{state.errors?.email}</FieldError>
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
          required
          defaultValue={state.values?.message}
          aria-invalid={Boolean(state.errors?.message)}
          aria-describedby={
            state.errors?.message ? `${messageId}-error` : undefined
          }
          className={`${fieldClass} min-h-[116px] resize-y leading-[1.7]`}
        />
        <FieldError id={`${messageId}-error`}>
          {state.errors?.message}
        </FieldError>
      </div>

      <div
        aria-hidden="true"
        className="absolute left-[-9999px] h-px w-px overflow-hidden"
      >
        <label htmlFor={`${ids}-website`}>Leave this empty</label>
        <input
          id={`${ids}-website`}
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <Submit />
        <span className="text-[15px] text-faint">
          Usually a reply within a day or two.
        </span>
      </div>
    </form>
  );
}

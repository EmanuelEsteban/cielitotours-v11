import { useId, type InputHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { EMPTY_PHONE, InternationalPhoneInput, phoneCheck, type PhoneValue } from "@/components/phone/international-phone-input";

/* COTIZAR-D5 — step 03 contact data. Kept only in React state (never stored/sent yet). */

export type ContactMethod = "whatsapp" | "email";
export type ContactData = { name: string; phone: PhoneValue; email: string; method: ContactMethod; privacy: boolean };
export const EMPTY_CONTACT: ContactData = { name: "", phone: EMPTY_PHONE, email: "", method: "whatsapp", privacy: false };
export type ContactErrors = Partial<Record<keyof ContactData, string>>;
export const CONTACT_ORDER: (keyof ContactData)[] = ["name", "phone", "email", "method", "privacy"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@.]{2,}$/u;

export function validateContact(c: ContactData): ContactErrors {
  const e: ContactErrors = {};
  const name = c.name.trim();
  if (!name) e.name = "Escribe tu nombre completo.";
  else if (name.length < 2 || !/\p{L}/u.test(name)) e.name = "Revisa tu nombre: debe contener letras.";
  const ph = phoneCheck(c.phone);
  if (ph.reason === "empty") e.phone = "Escribe tu número de WhatsApp.";
  else if (!ph.ok) e.phone = "El número no tiene una longitud válida para el país elegido. Revisa el país y escribe el número sin el prefijo.";
  const email = c.email.trim();
  if (!email) e.email = "Escribe tu correo electrónico.";
  else if (email.length > 254 || !EMAIL_RE.test(email)) e.email = "El correo no parece válido. Revisa que tenga el formato nombre@dominio.com.";
  if (c.method !== "whatsapp" && c.method !== "email") e.method = "Elige cómo prefieres que te contactemos.";
  if (!c.privacy) e.privacy = "Para continuar necesitamos que aceptes el aviso de privacidad.";
  return e;
}

export function ContactStep({ value, onChange, errors }: { value: ContactData; onChange: (c: ContactData) => void; errors: ContactErrors }) {
  const uid = useId();
  const id = (k: string) => `sg-c-${k}`;
  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => onChange({ ...value, [k]: v });
  const field = (k: "name" | "email", label: string, props: InputHTMLAttributes<HTMLInputElement>) =>
    <div className="sg-field">
      <label htmlFor={id(k)} className="sg-label">{label}</label>
      <input id={id(k)} className={cn("sg-input sg-text", errors[k] && "is-err")} value={value[k]} aria-invalid={Boolean(errors[k])}
        aria-describedby={errors[k] ? `${id(k)}-e` : undefined} onChange={(e) => set(k, e.target.value)} required {...props} />
      {errors[k] && <p id={`${id(k)}-e`} role="alert" className="sg-err">{errors[k]}</p>}
    </div>;

  return <div className="mt-6 grid gap-5" key={uid}>
    <div className="grid gap-5 md:grid-cols-2">
      {field("name", "Nombre completo", { autoComplete: "name", maxLength: 120 })}
      <InternationalPhoneInput id={id("phone")} label="WhatsApp" value={value.phone} onChange={(v) => set("phone", v)} error={errors.phone} />
      {field("email", "Correo electrónico", { type: "email", inputMode: "email", autoComplete: "email", maxLength: 254, placeholder: "nombre@correo.com" })}
      <div className="sg-field">
        <span id={id("method")} className="sg-label">Medio de contacto preferido</span>
        <div className="sg-seg" role="radiogroup" aria-labelledby={id("method")}>
          {([["whatsapp", "WhatsApp"], ["email", "Correo electrónico"]] as const).map(([v, l]) =>
            <button key={v} type="button" role="radio" aria-checked={value.method === v} className={cn("sg-seg-opt", value.method === v && "is-on")} onClick={() => set("method", v)}>{l}</button>)}
        </div>
        {errors.method && <p role="alert" className="sg-err">{errors.method}</p>}
      </div>
    </div>
    <div>
      <label className="sg-flex sg-privacy">
        <input id={id("privacy")} type="checkbox" checked={value.privacy} aria-invalid={Boolean(errors.privacy)} aria-describedby={errors.privacy ? `${id("privacy")}-e` : undefined}
          onChange={(e) => set("privacy", e.target.checked)} />
        <span>Acepto el <Link to="/privacidad" target="_blank" className="sg-privacy-link">aviso de privacidad</Link> y autorizo que Cielito Tours me contacte para atender esta solicitud.</span>
      </label>
      {errors.privacy && <p id={`${id("privacy")}-e`} role="alert" className="sg-err">{errors.privacy}</p>}
    </div>
  </div>;
}

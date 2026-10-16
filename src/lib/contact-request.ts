/** Data contract for the /contacto form. A future server function receives ContactRequest and delivers it to CONTACT_RECIPIENT only. */
export const CONTACT_RECIPIENT = "atencionalcliente@cielitotours.com";
export const RESERVATIONS_EMAIL = "reservas@cielitotours.com";
export const WHATSAPP_DISPLAY = "+52 56 4779 3152";
export const WHATSAPP_URL = "https://wa.me/525647793152";

/** Flip to true only when a real server function confirms delivery. */
export const CONTACT_BACKEND_READY = false;

export type ContactCategory = "general" | "seguimiento" | "queja" | "otra";

export const CONTACT_CATEGORIES: ReadonlyArray<{ id: ContactCategory; label: string; hint: string }> = [
  { id: "general", label: "Dudas generales", hint: "Preguntas sobre servicios o cómo trabajamos." },
  { id: "seguimiento", label: "Atención y seguimiento", hint: "Un viaje en curso o una reserva existente." },
  { id: "queja", label: "Quejas y reclamaciones", hint: "Algo no salió como esperabas." },
  { id: "otra", label: "Otra solicitud", hint: "Cualquier otro tema." },
];

export type ContactRequest = {
  category: ContactCategory;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  bookingNumber?: string | undefined;
  detail?: string | undefined;
  privacyConsent: true;
};

export type ContactStatus = "idle" | "invalid" | "sending" | "sent" | "error";

export type ContactErrors = Partial<Record<"fullName" | "email" | "subject" | "message" | "detail" | "privacyConsent", string>>;

export function validateContact(v: Omit<ContactRequest, "privacyConsent"> & { privacyConsent: boolean }): ContactErrors {
  const e: ContactErrors = {};
  if (v.fullName.trim().length < 2) e.fullName = "Escribe tu nombre completo.";
  if (v.fullName.length > 120) e.fullName = "Máximo 120 caracteres.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim()) || v.email.length > 255) e.email = "Escribe un correo válido.";
  if (v.subject.trim().length < 3) e.subject = "Indica un asunto.";
  if (v.subject.length > 150) e.subject = "Máximo 150 caracteres.";
  if (v.message.trim().length < 10) e.message = "Cuéntanos un poco más (mínimo 10 caracteres).";
  if (v.message.length > 2000) e.message = "Máximo 2000 caracteres.";
  if (v.category === "queja" && (v.detail ?? "").trim().length < 20) e.detail = "Describe lo ocurrido con detalle (mínimo 20 caracteres).";
  if (!v.privacyConsent) e.privacyConsent = "Necesitamos tu aceptación del aviso de privacidad.";
  return e;
}

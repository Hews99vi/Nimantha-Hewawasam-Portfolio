export const internationalPhonePattern = /^\+[1-9]\d{6,14}$/u;

/** Store international numbers with +; remove display punctuation only. */
export function normalizeWhatsAppNumber(value?: string | null): string | null {
  const number = value?.trim().replace(/[\s()-]/gu, "");
  return number || null;
}

export function whatsAppUrl(value?: string | null): string | null {
  const number = normalizeWhatsAppNumber(value);
  return number && internationalPhonePattern.test(number)
    ? `https://wa.me/${number.slice(1)}`
    : null;
}

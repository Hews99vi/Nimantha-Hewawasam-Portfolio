import { WhatsAppIcon } from "@/components/BrandIcons";
import { internationalPhonePattern, normalizeWhatsAppNumber } from "@/lib/whatsapp";

export function WhatsAppField({ value, onChange }: {
  value: string;
  onChange: (value: string) => void;
}) {
  const normalized = normalizeWhatsAppNumber(value);
  const invalid = Boolean(normalized && !internationalPhonePattern.test(normalized));
  return (
    <div>
      <label htmlFor="contact-whatsapp" className="flex items-center gap-2 text-sm font-bold text-[#071426]">
        <WhatsAppIcon size={20} />
        WhatsApp number (optional)
      </label>
      <input
        id="contact-whatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="+94 77 123 4567"
        value={value}
        maxLength={80}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? "contact-whatsapp-hint contact-whatsapp-error" : "contact-whatsapp-hint"}
        className="mt-2 w-full border border-[#102A4C]/12 px-4 py-3 text-sm"
      />
      <p id="contact-whatsapp-hint" className="mt-2 text-sm text-[#52657C]">
        Include + and country code; omit the local leading zero. Leave blank to hide WhatsApp on Contact.
      </p>
      {invalid && <p id="contact-whatsapp-error" className="mt-2 text-sm text-red-700">
        Use an international number with + and 7–15 digits. Spaces, brackets and hyphens are allowed.
      </p>}
    </div>
  );
}

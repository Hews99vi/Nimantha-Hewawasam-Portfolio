import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { contactSectionSchema, socialLinkSchema } from "@/lib/admin/schemas";
import { defaultPortfolioContent } from "@/lib/content-defaults";
import { normalizeWhatsAppNumber, whatsAppUrl } from "@/lib/whatsapp";
import { ContactSignal } from "@/components/interior/ContactSignal";
import { WhatsAppField } from "@/app/admin/WhatsAppField";
import { iconMap } from "@/lib/icons";

// Synthetic format examples only; not a configured customer contact.
const example = "+94 (77) 123-4567";
const contact = defaultPortfolioContent.contactSection;
describe("WhatsApp contact", () => {
  it("normalizes display punctuation and constructs a digits-only chat destination", () => {
    expect(normalizeWhatsAppNumber(example)).toBe("+94771234567");
    expect(whatsAppUrl(example)).toBe("https://wa.me/94771234567");
    expect(contactSectionSchema.parse({ ...contact, whatsapp_number: example }).whatsapp_number).toBe("+94771234567");
  });
  it("allows clearing and keeps omitted fields omitted for older callers", () => {
    expect(contactSectionSchema.parse({ ...contact, whatsapp_number: "  " }).whatsapp_number).toBeNull();
    const { whatsapp_number: omitted, ...legacy } = contact;
    void omitted;
    expect(contactSectionSchema.parse(legacy)).not.toHaveProperty("whatsapp_number");
    expect(whatsAppUrl(undefined)).toBeNull();
    expect(whatsAppUrl(null)).toBeNull();
  });
  it.each(["0771234567", "94771234567", "+00771234567", "+123", "+1234567890123456", "+94hello771234567", "https://wa.me/94771234567", "javascript:alert(1)"])("rejects malformed or non-international input: %s", (number) => {
    expect(contactSectionSchema.safeParse({ ...contact, whatsapp_number: number }).success).toBe(false);
    expect(whatsAppUrl(number)).toBeNull();
  });
  it("renders a real brand logo and an actual link only when a valid number exists", () => {
    const markup = renderToStaticMarkup(createElement(ContactSignal, { email: contact.email, location: contact.location, whatsappNumber: example }));
    expect(markup).toContain('href="https://wa.me/94771234567"');
    expect(markup).toContain("Chat on WhatsApp");
    expect(markup).toContain("WhatsApp logo from Font Awesome");
    expect(markup).toContain('target="_blank"');
    for (const value of [undefined, "", "bad input"]) {
      expect(renderToStaticMarkup(createElement(ContactSignal, { email: contact.email, location: contact.location, whatsappNumber: value }))).not.toContain("Chat on WhatsApp");
    }
  });
  it("exposes a labeled telephone field with format guidance and associated errors", () => {
    const markup = renderToStaticMarkup(createElement(WhatsAppField, { value: "0771234567", onChange: () => {} }));
    expect(markup).toContain('type="tel"');
    expect(markup).toContain('for="contact-whatsapp"');
    expect(markup).toContain('placeholder="+94 77 123 4567"');
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('id="contact-whatsapp-error"');
    expect(markup).toContain("Leave blank to hide WhatsApp");
    expect(iconMap.whatsapp).toBeDefined();
    expect(socialLinkSchema.safeParse({ sort_order: 1, label: "WhatsApp", href: "https://wa.me/94771234567", icon_key: "whatsapp", is_active: true }).success).toBe(true);
  });
});

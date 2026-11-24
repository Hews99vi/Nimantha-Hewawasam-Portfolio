"use client";

import { useEffect, useState } from "react";
import { Mail } from "lucide-react";
import { CopyEmail } from "@/components/CopyEmail";
import { WhatsAppIcon } from "@/components/BrandIcons";
import { whatsAppUrl } from "@/lib/whatsapp";

function LocalClock({ location }: { location: string }) {
  const isSriLanka = /sri lanka/i.test(location);
  const zone = isSriLanka ? "Asia/Colombo" : "UTC";
  const [value, setValue] = useState("");
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setValue(formatter.format(new Date()));
    const frame = requestAnimationFrame(update);
    const timer = setInterval(update, 1000);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(timer);
    };
  }, [zone]);
  return (
    <div className="contact-clock">
      <span>{isSriLanka ? "Local time" : "UTC"}</span>
      <time dateTime={value || undefined}>{value || "—"}</time>
    </div>
  );
}

export function ContactSignal({
  email,
  location,
  whatsappNumber,
}: {
  email: string;
  location: string;
  whatsappNumber?: string | null;
}) {
  const whatsapp = whatsAppUrl(whatsappNumber);
  return (
    <div className="contact-signal" data-reveal>
      <div className="contact-globe" aria-hidden="true">
        <svg viewBox="0 0 420 280" fill="none">
          <g
            className="globe-meridians"
            transform="translate(210 140) rotate(-18)"
          >
            <circle r="112" />
            <ellipse rx="42" ry="112" />
            <ellipse rx="83" ry="112" />
            <ellipse rx="112" ry="43" />
            <ellipse rx="112" ry="84" />
            <path d="M-112 0H112M0-112V112" />
          </g>
          <path className="globe-connection" d="M68 202C95 88 296 55 355 104" />
          <circle className="globe-origin" cx="273" cy="120" r="5" />
          <circle className="globe-origin-ring" cx="273" cy="120" r="13" />
          <path className="globe-leader" d="M286 120H348" />
          <circle className="globe-destination" cx="355" cy="104" r="3" />
        </svg>
      </div>
      <div className="contact-signal-location">
        <span>{location}</span>
        <LocalClock location={location} />
      </div>
      <div className="contact-signal-action">
        <h2>Start a conversation.</h2>
        <a className="contact-email-link" href={`mailto:${email}`}>
          <Mail size={20} aria-hidden="true" />
          <span>{email}</span>
        </a>
        <CopyEmail email={email} />
        {whatsapp && (
          <a className="contact-whatsapp-link" href={whatsapp} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={23} />
            <span><strong>Chat on WhatsApp</strong><span>{whatsappNumber}</span></span>
          </a>
        )}
      </div>
    </div>
  );
}

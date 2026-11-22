"use client";
import { Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied");
    } catch {
      setStatus("Could not copy. Select the email address to copy it.");
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus(""), 5000);
  }
  return (
    <div className="copy-email">
      <button type="button" className="text-action" onClick={copy}>
        {status === "Email copied" ? <Check size={17} /> : <Copy size={17} />}{" "}
        Copy email
      </button>
      <span role="status">{status}</span>
    </div>
  );
}

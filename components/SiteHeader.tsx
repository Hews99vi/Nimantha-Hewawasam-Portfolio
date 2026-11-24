"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const links = [
  ["/work", "Work"],
  ["/about", "About"],
  ["/services", "Services"],
  ["/blog", "Blog"],
  ["/contact", "Contact"],
];
export function SiteHeader({ embedded = false }: { embedded?: boolean }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const nav = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    }
    function onPointer(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !nav.current?.parentElement?.contains(event.target)
      )
        setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);
  if (pathname === "/" && !embedded) return null;
  return (
    <header className={`site-header ${embedded ? "site-header-embedded" : ""}`}>
      <Link
        href="/"
        aria-label="Nimantha Hewawasam home"
        className="brand-mark"
      >
        <Image
          src="/images/Main logo.png"
          alt=""
          width={62}
          height={62}
          loading={embedded ? "eager" : "lazy"}
        />
        <span>
          Nimantha
          <br />
          Hewawasam<span className="brand-dot">.</span>
        </span>
      </Link>
      <button
        ref={toggle}
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls={embedded ? "hero-navigation" : "site-navigation"}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      <nav
        ref={nav}
        id={embedded ? "hero-navigation" : "site-navigation"}
        aria-label="Main navigation"
        className={`site-nav ${open ? "is-open" : ""}`}
      >
        {links.map(([href, label]) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname.startsWith(href) ? "page" : undefined}
            onClick={() => setOpen(false)}
            onBlur={(event) => {
              if (
                !event.currentTarget.parentElement?.contains(
                  event.relatedTarget,
                )
              )
                setOpen(false);
            }}
          >
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

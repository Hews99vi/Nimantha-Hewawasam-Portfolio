import Link from "next/link";
import type { ContactSection } from "@/types/content";
export function SiteFooter({ contact }: { contact: ContactSection }) {
  return (
    <footer className="site-footer">
      <div className="container-shell footer-inner">
        <Link className="footer-name" href="/">
          Nimantha Hewawasam<span>.</span>
        </Link>
        <nav aria-label="Footer navigation">
          <Link href="/work">Work</Link>
          <Link href="/about">About</Link>
          <Link href="/services">Services</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/contact">Contact</Link>
        </nav>
        <div className="footer-bottom">
          <span>Software developer · {contact.location}</span>
          <span>© {new Date().getFullYear()} Nimantha Hewawasam</span>
        </div>
      </div>
    </footer>
  );
}

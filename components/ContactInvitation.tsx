import Link from "next/link";
export function ContactInvitation() {
  return (
    <section className="contact-invitation section-space" id="contact">
      <div className="container-shell">
        <h2>
          Have something
          <br />
          in mind?
        </h2>
        <Link className="contact-link" href="/contact">
          Let’s talk
        </Link>
      </div>
    </section>
  );
}

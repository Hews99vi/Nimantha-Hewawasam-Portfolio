import type { Metadata } from "next";
import { getPortfolioContent } from "@/lib/content";
import { ContactInvitation } from "@/components/ContactInvitation";
import { Plus } from "lucide-react";
export const metadata: Metadata = {
  title: "Services | Nimantha Hewawasam",
  description:
    "Web applications, mobile apps, dashboards, CMS, AI workflows, and deployment support.",
};
export default async function ServicesPage() {
  const c = await getPortfolioContent();
  return (
    <main id="content">
      <section className="page-intro container-shell">
        <h1>
          From an idea
          <br />
          to something useful<span className="accent">.</span>
        </h1>
        <p>
          Development across the interface, backend, and the systems that keep a
          product running.
        </p>
      </section>
      <section
        className="container-shell service-list section-bottom"
        aria-label="Services"
      >
        {c.services
          .filter((s) => s.is_active)
          .sort((a, b) => a.sort_order - b.sort_order)
          .map((service) => (
            <details key={service.id} id={`service-${service.id}`}>
              <summary>
                <h2>{service.title}</h2>
                <Plus size={25} aria-hidden="true" />
              </summary>
              <div>
                <p className="lead">{service.description}</p>
                <p>{service.fit}</p>
              </div>
            </details>
          ))}
      </section>
      <section className="home-about section-space">
        <div className="container-shell">
          <h2>A clear path to launch.</h2>
          <ol className="process-timeline">
            {c.processSteps
              .filter((p) => p.is_active)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((step, index) => (
                <li key={step.id}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </li>
              ))}
          </ol>
        </div>
      </section>
      <ContactInvitation />
    </main>
  );
}

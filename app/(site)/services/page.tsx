import type { Metadata } from "next";
import { getPortfolioContent } from "@/lib/content";
import { ContactInvitation } from "@/components/ContactInvitation";
import { InteriorMotion } from "@/components/interior/InteriorMotion";
import { ServicesExplorer } from "@/components/interior/ServicesExplorer";
export const metadata: Metadata = {
  title: "Services | Nimantha Hewawasam",
  description:
    "Web applications, mobile apps, dashboards, CMS, AI workflows, and deployment support.",
};
export default async function ServicesPage() {
  const c = await getPortfolioContent();
  const services = c.services
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  const steps = c.processSteps
    .filter((item) => item.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  return (
    <main id="content" className="services-page">
      <InteriorMotion>
        <ServicesExplorer services={services} />
        {steps.length > 0 && (
          <section className="home-about section-space service-process">
            <div className="container-shell" data-reveal>
              <h2>A clear path to launch.</h2>
              <ol className="process-timeline">
                {steps.map((step, index) => (
                  <li key={step.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{step.title}</h3>
                    <p>{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
        <ContactInvitation />
      </InteriorMotion>
    </main>
  );
}

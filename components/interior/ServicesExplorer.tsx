"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import type { ServiceItem } from "@/types/content";
import { iconMap } from "@/lib/icons";
import { ServiceDiagram } from "./ServiceDiagram";

export function ServicesExplorer({ services }: { services: ServiceItem[] }) {
  const [selection, setSelection] = useState<{
    openId: string | null;
    selectedId: string;
  }>({ openId: services[0]?.id ?? null, selectedId: services[0]?.id ?? "" });
  const selected =
    services.find((service) => service.id === selection.selectedId) ??
    services[0];
  useEffect(() => {
    const readHash = () => {
      const match = services.find(
        (service) => `#service-${service.id}` === window.location.hash,
      );
      if (match) setSelection({ openId: match.id, selectedId: match.id });
    };
    const frame = requestAnimationFrame(readHash);
    window.addEventListener("hashchange", readHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", readHash);
    };
  }, [services]);
  return (
    <section
      className={`services-explorer container-shell ${selected ? "" : "services-empty"}`}
    >
      <div className="services-content">
        <header className="services-opening" data-reveal>
          <h1>
            From an idea
            <br />
            to something useful<span className="accent">.</span>
          </h1>
          <p>
            Development across the interface, backend, and the systems that keep
            a product running.
          </p>
        </header>
        <div className="service-list" aria-label="Services">
          {services.map((service) => {
            const Icon = iconMap[service.icon_key];
            return (
              <details
                key={service.id}
                id={`service-${service.id}`}
                open={selection.openId === service.id}
              >
                <summary
                  onClick={(event) => {
                    event.preventDefault();
                    setSelection((previous) => ({
                      openId:
                        previous.openId === service.id ? null : service.id,
                      selectedId: service.id,
                    }));
                  }}
                >
                  <Icon
                    className="service-category-icon"
                    size={24}
                    aria-hidden="true"
                  />
                  <h2>{service.title}</h2>
                  <Plus
                    className="service-toggle"
                    size={23}
                    aria-hidden="true"
                  />
                </summary>
                <div>
                  <p className="lead">{service.description}</p>
                  <p>{service.fit}</p>
                  {selection.openId === service.id && (
                    <div className="service-mobile-diagram">
                      <ServiceDiagram service={service} />
                    </div>
                  )}
                </div>
              </details>
            );
          })}
          {!services.length && (
            <p>Service details will appear here when published.</p>
          )}
        </div>
      </div>
      {selected && (
        <aside
          className="service-blueprint"
          aria-label="Selected service diagram"
        >
          <div key={selected.id}>
            <ServiceDiagram service={selected} />
          </div>
          <p>Choose a service to explore how the pieces connect.</p>
        </aside>
      )}
    </section>
  );
}

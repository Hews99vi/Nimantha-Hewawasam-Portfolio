"use client";

import Link from "next/link";
import { useState } from "react";
import type { ServiceItem } from "@/types/content";
import { iconMap } from "@/lib/icons";
import { ServiceDiagram } from "@/components/interior/ServiceDiagram";

export function HomeServices({ services }: { services: ServiceItem[] }) {
  const [selectedId, setSelectedId] = useState(services[0]?.id);
  const selected = services.find((item) => item.id === selectedId) ?? services[0];
  if (!selected) return <p>Service details will appear here when published.</p>;

  return (
    <div className="home-services-explorer">
      <div className="home-service-preview" aria-label="Service concept preview">
        <div key={selected.id}>
          <ServiceDiagram service={selected} />
          <p>{selected.description}</p>
        </div>
      </div>
      <div className="home-service-links">
        <p className="home-service-hint">Explore the pieces behind a product.</p>
        {services.map((service) => {
          const Icon = iconMap[service.icon_key];
          return (
            <Link
              key={service.id}
              href={`/services#service-${service.id}`}
              data-selected={service.id === selected.id}
              onFocus={() => setSelectedId(service.id)}
              onPointerEnter={(event) => {
                if (event.pointerType !== "touch") setSelectedId(service.id);
              }}
            >
              <Icon size={23} strokeWidth={1.5} aria-hidden="true" />
              <h3>{service.title}</h3>
              <span className="home-service-open">View service</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

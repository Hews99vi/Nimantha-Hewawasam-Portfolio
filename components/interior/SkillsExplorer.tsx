"use client";

import { useState } from "react";
import { iconMap } from "@/lib/icons";
import type { TechGroup } from "@/types/content";

export function SkillsExplorer({ groups }: { groups: TechGroup[] }) {
  const [selectedId, setSelectedId] = useState(groups[0]?.id ?? "");
  const selected = groups.find((group) => group.id === selectedId) ?? groups[0];
  if (!selected) return null;
  const SelectedIcon = iconMap[selected.icon_key];
  return (
    <div className="toolkit-explorer">
      <div
        className="toolkit-map"
        role="group"
        aria-label="Choose a technical discipline"
      >
        {groups.map((group) => {
          const Icon = iconMap[group.icon_key];
          return (
            <button
              key={group.id}
              type="button"
              className="toolkit-node"
              aria-pressed={selected.id === group.id}
              aria-controls="toolkit-details"
              onClick={() => setSelectedId(group.id)}
            >
              <Icon size={25} aria-hidden="true" />
              <span>{group.title}</span>
            </button>
          );
        })}
      </div>
      <div
        className="toolkit-inspector"
        id="toolkit-details"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="toolkit-selection" key={selected.id}>
          <SelectedIcon size={36} aria-hidden="true" />
          <h3>{selected.title}</h3>
          <ul>
            {[...selected.items]
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((item) => (
                <li key={item.id}>{item.label}</li>
              ))}
          </ul>
        </div>
      </div>
      <noscript>
        {groups.map((group) => (
          <div key={group.id}>
            <h3>{group.title}</h3>
            <p>{group.items.map((item) => item.label).join(", ")}</p>
          </div>
        ))}
      </noscript>
    </div>
  );
}

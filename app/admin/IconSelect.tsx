"use client";

import { allowedIconKeys, iconMap } from "@/lib/icons";
import type { IconKey } from "@/types/content";

export function IconSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: IconKey;
  onChange: (value: IconKey) => void;
}) {
  const PreviewIcon = iconMap[value];

  return (
    <label className="block text-sm font-bold text-[#071426]">
      {label}
      <div className="mt-2 flex items-center gap-3 border border-[#102A4C]/12 px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F8FAFC] text-[#0057D9]">
          <PreviewIcon size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <select
            value={value}
            onChange={(event) => onChange(event.target.value as IconKey)}
            className="w-full bg-transparent text-sm font-semibold text-[#071426] outline-none"
          >
            {allowedIconKeys.map((iconKey) => (
              <option key={iconKey} value={iconKey}>
                {iconKey}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs font-medium text-[#6E7F95]">Preview updates instantly.</p>
        </div>
      </div>
    </label>
  );
}

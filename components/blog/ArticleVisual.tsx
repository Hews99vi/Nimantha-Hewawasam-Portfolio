"use client";

import { useState } from "react";

export function ArticleVisual({ cover, topic, priority = false }: {
  cover: string | null;
  topic: string;
  priority?: boolean;
}) {
  const [failedCover, setFailedCover] = useState<string | null>(null);
  // This bundled portrait was shipped as a seed cover, not an article illustration.
  const image = cover && cover !== "/images/nimantha-hero.png" && failedCover !== cover;
  return (
    <div className={`journal-visual journal-visual-${topic || "notes"}`}>
      <svg viewBox="0 0 600 380" fill="none" aria-hidden="true" focusable="false">
        {topic === "cms-systems" ? <>
          <path className="journal-art-line" d="M300 190H116V85M300 190V295H484M300 190H484V85" />
          {[{x:70,y:50},{x:254,y:155},{x:438,y:50},{x:438,y:260}].map(({x,y}) => <g key={`${x}-${y}`}><rect x={x} y={y} width="92" height="70" rx="5"/><path d={`M${x+18} ${y+24}h55M${x+18} ${y+43}h35`} /></g>)}
          <circle cx="300" cy="190" r="9" className="journal-art-dot" />
        </> : topic === "ui-ux" ? <>
          <rect x="80" y="65" width="260" height="250" rx="7" />
          <rect x="262" y="105" width="258" height="170" rx="7" />
          <path className="journal-art-line" d="M108 105H225M108 137H202M108 181H302M292 145H488M292 179H456M292 218H408" />
          <circle cx="462" cy="244" r="8" className="journal-art-dot" />
        </> : topic === "freelance" ? <>
          <path className="journal-art-line" d="M98 190H502" />
          {[110,300,490].map((x, i) => <g key={x}><circle cx={x} cy="190" r="48"/><path d={`M${x-18} 190h36M${x} 172v36`} /><path d={`M${x-38} ${96+i*4}h76M${x-25} ${286-i*4}h50`} /></g>)}
        </> : <>
          <rect x="85" y="58" width="430" height="264" rx="8"/>
          <path d="M85 99H515M135 78H170M194 78H199" />
          <rect x="108" y="122" width="96" height="176" rx="3"/>
          <rect x="227" y="122" width="265" height="65" rx="3"/>
          <path className="journal-art-line" d="M228 220H489M228 252H454M228 284H422" />
          <circle cx="466" cy="284" r="7" className="journal-art-dot"/>
        </>}
      </svg>
      {image && (
        // Existing editorial covers may use external hosts outside the project-image bucket.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cover} alt="" loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} onError={() => setFailedCover(cover)} />
      )}
    </div>
  );
}

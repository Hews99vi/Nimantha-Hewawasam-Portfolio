import type { ServiceItem } from "@/types/content";

export function ServiceDiagram({ service }: { service: ServiceItem }) {
  const mode = service.icon_key;
  const flow =
    mode === "bot"
      ? ["Input", "Logic", "Action"]
      : mode === "settings2" || mode === "rocket"
        ? ["Code", "Build", "Release"]
        : mode === "briefcaseBusiness"
          ? ["Browse", "Checkout", "Orders"]
          : null;
  return (
    <figure className="service-diagram">
      <svg
        viewBox="0 0 480 340"
        role="img"
        aria-label={`Conceptual view of ${service.title}${flow ? `: ${flow.join(", ")}` : ": interface connected to logic and data"}`}
      >
        {flow ? (
          <>
            <path
              className="diagram-connection"
              d="M95 167H385M95 167V95H385V167"
            />
            <path className="diagram-trace" d="M95 167H385" />
            {flow.map((label, index) => (
              <g key={label} transform={`translate(${30 + index * 160}, 125)`}>
                <rect
                  className="diagram-node"
                  width="100"
                  height="84"
                  rx="10"
                />
                <circle className="diagram-port" cx="50" cy="0" r="4" />
                <text x="50" y="49" textAnchor="middle">
                  {label}
                </text>
              </g>
            ))}
            <circle className="diagram-port" cx="240" cy="95" r="5" />
            <path className="diagram-connection" d="M70 250H410" />
            <text className="diagram-note" x="240" y="285" textAnchor="middle">
              {mode === "bot"
                ? "A connected workflow"
                : mode === "briefcaseBusiness"
                  ? "A clear path through the store"
                  : "From source to a running product"}
            </text>
          </>
        ) : mode === "smartphone" ? (
          <>
            <rect
              className="diagram-node"
              x="65"
              y="30"
              width="160"
              height="280"
              rx="22"
            />
            <path className="diagram-connection" d="M120 52H170M125 288H165" />
            <rect
              className="diagram-pane"
              x="82"
              y="78"
              width="126"
              height="110"
              rx="5"
            />
            <path
              className="diagram-connection"
              d="M98 211H191M98 231H171M98 251H181"
            />
            <path
              className="diagram-trace"
              d="M225 162H285V122H342M285 162V235H342"
            />
            <rect
              className="diagram-node"
              x="320"
              y="89"
              width="110"
              height="66"
              rx="8"
            />
            <text x="375" y="129" textAnchor="middle">
              Logic
            </text>
            <rect
              className="diagram-node"
              x="320"
              y="202"
              width="110"
              height="66"
              rx="8"
            />
            <text x="375" y="242" textAnchor="middle">
              Data
            </text>
            <text className="diagram-note" x="145" y="144" textAnchor="middle">
              Mobile interface
            </text>
          </>
        ) : (
          <>
            <rect
              className="diagram-node"
              x="30"
              y="30"
              width="335"
              height="223"
              rx="10"
            />
            <path className="diagram-connection" d="M30 65H365" />
            <circle className="diagram-port" cx="48" cy="48" r="3" />
            <circle className="diagram-port" cx="61" cy="48" r="3" />
            <circle className="diagram-port" cx="74" cy="48" r="3" />
            {mode === "monitorSmartphone" ? (
              <>
                <rect
                  className="diagram-pane"
                  x="49"
                  y="84"
                  width="63"
                  height="149"
                  rx="4"
                />
                <path
                  className="diagram-connection"
                  d="M131 113H340M131 144H340M131 175H340M131 206H340"
                />
                <path
                  className="diagram-trace"
                  d="M140 206V183H182V160H225V134H270V113H330"
                />
              </>
            ) : (
              <>
                <rect
                  className="diagram-pane"
                  x="50"
                  y="85"
                  width="118"
                  height="148"
                  rx="5"
                />
                <text
                  className="diagram-note"
                  x="109"
                  y="164"
                  textAnchor="middle"
                >
                  Interface
                </text>
                <rect
                  className="diagram-pane"
                  x="187"
                  y="86"
                  width="157"
                  height="64"
                  rx="5"
                />
                <path
                  className="diagram-connection"
                  d="M190 173H340M190 195H319M190 217H330"
                />
              </>
            )}
            <path className="diagram-trace" d="M196 253V286H320V240H407V198" />
            <rect
              className="diagram-node"
              x="280"
              y="267"
              width="78"
              height="43"
              rx="6"
            />
            <text x="319" y="294" textAnchor="middle">
              Logic
            </text>
            <path
              className="diagram-node"
              d="M380 175V222C380 237 438 237 438 222V175"
            />
            <ellipse
              className="diagram-node"
              cx="409"
              cy="175"
              rx="29"
              ry="10"
            />
            <path
              className="diagram-connection"
              d="M380 197C380 212 438 212 438 197"
            />
            <text className="diagram-note" x="409" y="261" textAnchor="middle">
              Data
            </text>
          </>
        )}
      </svg>
      <figcaption>
        <strong>{service.title}</strong>
        <span>Conceptual view</span>
      </figcaption>
    </figure>
  );
}

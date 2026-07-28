"use client";

export function HeroSchematic() {
  return (
    <svg
      viewBox="0 0 520 80"
      className="mt-10 w-full max-w-xl text-[var(--blueprint-line)]"
      role="img"
      aria-label="Schematic: Skills to Build to Ship"
    >
      <path
        className="schematic-trace"
        d="M40 40 H180 M180 40 H340 M340 40 H480"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      {[
        { x: 40, label: "SKILLS" },
        { x: 180, label: "BUILD" },
        { x: 340, label: "SHIP" },
      ].map((node) => (
        <g key={node.label}>
          <circle
            cx={node.x}
            cy={40}
            r={5}
            fill="var(--blueprint-navy)"
            stroke="var(--signal-amber)"
            strokeWidth="1.5"
          />
          <text
            x={node.x}
            y={68}
            textAnchor="middle"
            className="mono"
            fill="var(--signal-amber)"
            fontSize="10"
            letterSpacing="0.12em"
          >
            {node.label}
          </text>
        </g>
      ))}
      <circle cx={480} cy={40} r={4} fill="var(--circuit-teal)" />
    </svg>
  );
}

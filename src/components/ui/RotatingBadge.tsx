import { useId } from "react";

export default function RotatingBadge({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const id = useId().replace(/[:]/g, "");
  return (
    <svg viewBox="0 0 100 100" className={`animate-spin-slow ${className}`} aria-hidden>
      <defs>
        <path
          id={id}
          d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0"
          fill="none"
        />
      </defs>
      <text className="fill-current font-mono text-[8px] tracking-[0.22em] uppercase">
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
      <text
        x="50"
        y="57"
        textAnchor="middle"
        className="fill-current font-display text-[26px] italic"
      >
        /
      </text>
    </svg>
  );
}

export default function Marquee({
  children,
  slow,
  className = "",
}: {
  children: React.ReactNode;
  slow?: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`marquee-track ${slow ? "slow" : ""}`}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ChapterLabel({
  index,
  children,
  className = "",
}: {
  index: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`} data-reveal>
      <span className="label-mono !text-copper">{index}</span>
      <span className="hairline w-14 md:w-20" />
      <span className="label-mono">{children}</span>
    </div>
  );
}

export function Ornement({ centered = true }: { centered?: boolean }) {
  return (
    <div className={centered ? "flex items-center justify-center my-6" : "my-6"}>
      <svg
        viewBox="0 0 240 24"
        className="h-6 w-56 text-ocre-500/70"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="12" x2="100" y2="12" stroke="currentColor" strokeWidth="0.6" />
        <line x1="140" y1="12" x2="240" y2="12" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="120" cy="12" r="3.5" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="120" cy="12" r="1" fill="currentColor" />
        <path d="M104 12 Q112 4 120 12" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M104 12 Q112 20 120 12" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M120 12 Q128 4 136 12" stroke="currentColor" strokeWidth="0.6" fill="none" />
        <path d="M120 12 Q128 20 136 12" stroke="currentColor" strokeWidth="0.6" fill="none" />
      </svg>
    </div>
  );
}

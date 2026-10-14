export default function StudioLoading() {
  return (
    <div className="w-full h-[calc(100vh-80px)] flex flex-col md:flex-row gap-5 animate-pulse pb-16">
      {/* Left skeleton panel */}
      <div className="flex-1 md:w-[60%] flex flex-col gap-3">
        <div className="h-10 w-full bg-[var(--bg-overlay)] rounded-xl" />
        <div className="h-8 w-3/4 bg-[var(--bg-overlay)] rounded-full" />
        <div className="flex-1 min-h-[300px] bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
      </div>

      {/* Right skeleton panel */}
      <div className="md:w-[40%] flex flex-col gap-4">
        <div className="h-28 w-full bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
        <div className="h-44 w-full bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
        <div className="h-12 w-full bg-[var(--bg-overlay)] rounded-xl mt-auto" />
      </div>
    </div>
  );
}

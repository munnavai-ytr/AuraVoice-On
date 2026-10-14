export default function SettingsLoading() {
  return (
    <div className="space-y-6 text-left animate-pulse">
      <div className="h-10 w-48 bg-[var(--bg-overlay)] rounded-xl" />
      <div className="flex flex-col md:flex-row gap-8 items-start pt-1">
        <div className="hidden md:flex flex-col w-[200px] shrink-0 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-full bg-[var(--bg-overlay)] rounded-lg" />
          ))}
        </div>
        <div className="flex-1 w-full max-w-xl flex flex-col gap-4">
          <div className="h-24 w-full bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
          <div className="h-14 w-full bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
          <div className="h-14 w-full bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-xl" />
        </div>
      </div>
    </div>
  );
}

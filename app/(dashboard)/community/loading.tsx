export default function CommunityLoading() {
  return (
    <div className="space-y-6 text-left animate-pulse">
      <div className="h-10 w-56 bg-[var(--bg-overlay)] rounded-xl" />
      <div className="h-10 w-full max-w-sm bg-[var(--bg-overlay)] rounded-xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-[210px] rounded-[14px] bg-[#0D1117] border border-[#1E293B] p-4 flex flex-col justify-between"
          >
            <div className="h-10 w-2/3 bg-[#111827] rounded-lg" />
            <div className="h-4 w-1/2 bg-[#111827] rounded" />
            <div className="h-10 w-full bg-[#111827] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

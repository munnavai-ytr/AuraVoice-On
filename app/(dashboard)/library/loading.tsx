export default function LibraryLoading() {
  return (
    <div className="space-y-6 text-left animate-pulse">
      <div className="h-10 w-48 bg-[var(--bg-overlay)] rounded-xl" />
      <div className="h-8 w-80 bg-[var(--bg-overlay)] rounded-full" />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-[180px] rounded-[14px] bg-[#0D1117] border border-[#1E293B] p-4 flex flex-col justify-between"
          >
            <div className="h-12 w-full bg-[#111827] rounded-lg" />
            <div className="h-4 w-3/4 bg-[#111827] rounded" />
            <div className="h-8 w-1/2 bg-[#111827] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VoiceStudioLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 w-56 bg-[var(--bg-overlay)] rounded-lg" />
      <div className="w-full h-[450px] bg-[var(--bg-surface)] border border-[var(--border-base)] rounded-2xl" />
    </div>
  );
}

import Link from 'next/link';
import { Mic, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center mb-6 text-indigo-400">
        <Mic className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-bold text-[var(--text-1)] mb-2">404 - Page Not Found</h1>
      <p className="text-[var(--text-2)] max-w-md mb-8">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/studio"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/25"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Studio
      </Link>
    </div>
  );
}

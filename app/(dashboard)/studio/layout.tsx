import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Voice Studio — Vocalis AI',
  description: 'AI text-to-speech audio generation studio with custom emotions, pitch controls, and voices.',
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

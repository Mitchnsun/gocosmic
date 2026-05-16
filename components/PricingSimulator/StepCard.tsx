'use client';

export function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up rounded-lg bg-slate-800/60 px-6 py-8 ring-1 ring-slate-700">{children}</div>
  );
}

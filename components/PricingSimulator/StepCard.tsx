'use client';

export function StepCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-fade-in-up border-ghost/8 bg-ghost/[0.02] rounded-2xl border p-6 sm:p-8">{children}</div>
  );
}

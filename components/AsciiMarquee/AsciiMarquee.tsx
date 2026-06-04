'use client';

import { useEffect, useState } from 'react';

import { shuffle } from '@/lib/shuffle';

export function AsciiMarquee({ labels }: { labels: string[] }) {
  const [items, setItems] = useState(labels);

  useEffect(() => {
    setItems(shuffle(labels));
  }, [labels]);

  return (
    <div
      aria-hidden="true"
      className="mt-4 overflow-hidden border-y border-slate-800/70 bg-slate-950/40 py-3 font-mono text-sm tracking-wide">
      <div className="animate-footer-ascii-marquee flex w-max whitespace-nowrap motion-reduce:animate-none">
        {[0, 1].map((copyIndex) => (
          <div key={copyIndex} className="flex items-center">
            {items.map((label, labelIndex) => (
              <div key={`${copyIndex}-${labelIndex}-${label}`} className="flex items-center">
                <span className="text-gray-100">{label}</span>
                {labelIndex < items.length - 1 ? <span className="text-aerospace mx-4">✦</span> : null}
              </div>
            ))}
            <span className="text-aerospace mx-4">✦</span>
          </div>
        ))}
      </div>
    </div>
  );
}

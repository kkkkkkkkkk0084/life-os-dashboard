'use client';
import { useState } from 'react';

export default function HeroSection() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  });

  return (
    <section className="px-8 pt-6 pb-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(132,140,208,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-[1280px] mx-auto flex items-center justify-between gap-6 relative">
        {/* Left: greeting + tagline */}
        <div className="opacity-0" style={{ animation: 'fadeUp 0.6s 0.1s ease forwards' }}>
          <p className="font-[family-name:var(--font-mono)] text-[10px] text-text-3 tracking-[1.5px] uppercase mb-1">
            This Is What I Do
          </p>
          <h1
            className="font-[family-name:var(--font-display)] text-[28px] font-medium text-text-1 leading-tight"
            style={{ letterSpacing: '-1px' }}
          >
            {greeting}, <em className="font-[family-name:var(--font-serif)] italic font-normal text-text-2">Kei</em>
          </h1>
        </div>

        {/* Right: level bar */}
        <div
          className="flex items-center gap-3 w-full max-w-[360px] opacity-0"
          style={{ animation: 'fadeUp 0.6s 0.25s ease forwards' }}
        >
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-accent bg-accent-glow px-2.5 py-0.5 rounded-full border border-accent/15 whitespace-nowrap">
            Lv 12
          </span>
          <div className="flex-1 progress-track">
            <div
              className="progress-fill bg-gradient-to-r from-accent to-[#a4abdf]"
              style={{ width: 0 }}
              ref={(el) => {
                if (el) setTimeout(() => { el.style.width = '62%'; }, 400);
              }}
            />
          </div>
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-3 whitespace-nowrap">
            1,240 / 2,000
          </span>
        </div>
      </div>
    </section>
  );
}

'use client';
import { useEffect, useState } from 'react';

export default function HeroSection() {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening');
  }, []);

  return (
    <section className="min-h-[100vh] max-h-[1000px] flex flex-col items-center justify-center text-center px-8 pb-20 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(132,140,208,0.08) 0%, transparent 70%)',
          animation: 'pulseGlow 6s ease-in-out infinite',
        }}
      />

      <p
        className="font-[family-name:var(--font-mono)] text-xs text-text-2 tracking-[1.5px] uppercase mb-5 opacity-0"
        style={{ animation: 'fadeUp 0.7s 0.2s ease forwards' }}
      >
        Dashboard
      </p>

      <h1
        className="font-[family-name:var(--font-display)] text-[56px] font-medium text-text-1 leading-[64px] mb-4 opacity-0"
        style={{ letterSpacing: '-2px', animation: 'fadeUp 0.7s 0.4s ease forwards' }}
      >
        {greeting ? `${greeting}, ` : ''}<em className="font-[family-name:var(--font-serif)] italic font-normal text-text-2">Kei</em>
      </h1>

      <p
        className="text-xl text-text-3 max-w-[480px] leading-relaxed mb-8 opacity-0"
        style={{ animation: 'fadeUp 0.7s 0.55s ease forwards' }}
      >
        今日の進捗と現在のステータスを確認する
      </p>

      {/* Level bar */}
      <div
        className="flex items-center gap-3 w-full max-w-[400px] opacity-0"
        style={{ animation: 'fadeUp 0.7s 0.7s ease forwards' }}
      >
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-accent bg-accent-glow px-2.5 py-0.5 rounded-full border border-accent/15 whitespace-nowrap">
          Lv 12
        </span>
        <div className="flex-1 progress-track">
          <div
            className="progress-fill bg-gradient-to-r from-accent to-[#a4abdf]"
            style={{ width: 0, animation: 'fillBar 1.2s 1s cubic-bezier(0.4,0,0.2,1) forwards', animationFillMode: 'forwards' }}
            ref={(el) => {
              if (el) setTimeout(() => { el.style.width = '62%'; }, 1000);
            }}
          />
        </div>
        <span className="font-[family-name:var(--font-mono)] text-[11px] text-text-3 whitespace-nowrap">
          1,240 / 2,000
        </span>
      </div>
    </section>
  );
}

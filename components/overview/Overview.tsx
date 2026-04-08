'use client';
import { useEffect, useRef } from 'react';
import HeroSection from './HeroSection';
import TodaySection from './TodaySection';
import StatusSection from './StatusSection';
import QuestsSection from './QuestsSection';
import WeekSection from './WeekSection';
import ActivitySection from './ActivitySection';
import GoldSection from './GoldSection';

export default function Overview() {
  const mainRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = mainRef.current?.querySelectorAll('.reveal');
    sections?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Card mouse glow effect
  useEffect(() => {
    const cards = document.querySelectorAll('.card');
    const handleMove = (e: Event) => {
      const me = e as MouseEvent;
      const card = me.currentTarget as HTMLElement;
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${me.clientX - rect.left}px`);
      card.style.setProperty('--my', `${me.clientY - rect.top}px`);
    };
    cards.forEach((card) => card.addEventListener('mousemove', handleMove));
    return () => cards.forEach((card) => card.removeEventListener('mousemove', handleMove));
  }, []);

  return (
    <div ref={mainRef}>
      <HeroSection />
      <div className="max-w-[1280px] mx-auto px-8 pb-6 grid grid-cols-12 gap-3">
        <div className="reveal opacity-0 col-span-12"><TodaySection /></div>
        <div className="reveal opacity-0 col-span-12 lg:col-span-8"><StatusSection /></div>
        <div className="reveal opacity-0 col-span-12 lg:col-span-4"><GoldSection /></div>
        <div className="reveal opacity-0 col-span-12 lg:col-span-7"><QuestsSection /></div>
        <div className="reveal opacity-0 col-span-12 lg:col-span-5"><ActivitySection /></div>
        <div className="reveal opacity-0 col-span-12"><WeekSection /></div>
      </div>
    </div>
  );
}

'use client';
import { useEffect, useRef } from 'react';
import HeroSection from './overview/HeroSection';
import TodaySection from './overview/TodaySection';
import StatusSection from './overview/StatusSection';
import QuestsSection from './overview/QuestsSection';
import WeekSection from './overview/WeekSection';
import ActivitySection from './overview/ActivitySection';
import GoldSection from './overview/GoldSection';

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
      <div className="max-w-[920px] mx-auto px-8 pb-24">
        <div className="reveal opacity-0"><TodaySection /></div>
        <div className="reveal opacity-0"><StatusSection /></div>
        <div className="reveal opacity-0"><QuestsSection /></div>
        <div className="reveal opacity-0"><GoldSection /></div>
        <div className="reveal opacity-0"><WeekSection /></div>
        <div className="reveal opacity-0"><ActivitySection /></div>
      </div>
    </div>
  );
}

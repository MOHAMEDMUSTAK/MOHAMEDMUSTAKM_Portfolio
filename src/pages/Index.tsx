import { useState, useEffect } from 'react';
import Sidebar from '@/components/portfolio/Sidebar';
import HeroSection from '@/components/portfolio/HeroSection';
import AboutSection from '@/components/portfolio/AboutSection';
import ResumeSection from '@/components/portfolio/ResumeSection';
import SkillsSection from '@/components/portfolio/SkillsSection';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import CertificationsSection from '@/components/portfolio/CertificationsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import ScrollProgress from '@/components/portfolio/ScrollProgress';
import TerminalIntro from '@/components/portfolio/TerminalIntro';
import NeuralBackground from '@/components/portfolio/NeuralBackground';
import WhyHireMe from '@/components/portfolio/WhyHireMe';
import AIAssistantBubble from '@/components/portfolio/AIAssistantBubble';
import IntensityToggle from '@/components/portfolio/IntensityToggle';
import CursorEffect from '@/components/portfolio/CursorEffect';
import GitHubActivity from '@/components/portfolio/GitHubActivity';
import ProjectTimeline from '@/components/portfolio/ProjectTimeline';
import RecruiterSummary from '@/components/portfolio/RecruiterSummary';
import SwipeDrawer from '@/components/portfolio/SwipeDrawer';

const Index = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Check if intro was already shown this session
  useEffect(() => {
    const shown = sessionStorage.getItem('intro-shown');
    if (shown) {
      setIntroComplete(true);
      setShowIntro(false);
    }
  }, []);

  const handleIntroComplete = () => {
    setIntroComplete(true);
    setShowIntro(false);
    sessionStorage.setItem('intro-shown', '1');
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!introComplete) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const map: Record<string, string> = { h: 'home', p: 'projects', s: 'skills', c: 'contact', a: 'about', r: 'resume', g: 'github', t: 'timeline' };
      const section = map[e.key.toLowerCase()];
      if (section) document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [introComplete]);

  // Scroll-triggered reveal animation
  useEffect(() => {
    if (!introComplete) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.reveal-on-scroll').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [introComplete]);

  return (
    <div className="min-h-screen bg-background">
      {/* Terminal Intro */}
      {showIntro && <TerminalIntro onComplete={handleIntroComplete} />}

      {introComplete && (
        <>
          <NeuralBackground />
          <CursorEffect />
          <ScrollProgress />
          <Sidebar />
          <SwipeDrawer />
          <AIAssistantBubble />
          <IntensityToggle />
          
          {/* Main Content */}
          <main className="lg:ml-[240px] relative z-10">
            <HeroSection />
            <div className="section-divider" />
            <div className="reveal-on-scroll"><AboutSection /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><ResumeSection /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><SkillsSection /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><WhyHireMe /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><ProjectsSection /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><GitHubActivity /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><ProjectTimeline /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><RecruiterSummary /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><CertificationsSection /></div>
            <div className="section-divider" />
            <div className="reveal-on-scroll"><ContactSection /></div>
          </main>
        </>
      )}
    </div>
  );
};

export default Index;

import { useState, useEffect, useCallback } from 'react';
import { Home, User, FileText, Zap, FolderKanban, Award, Mail, Github, Clock, Menu, X } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const drawerItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'about', label: 'About', icon: User },
  { id: 'resume', label: 'Resume', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Zap },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'github', label: 'GitHub', icon: Github },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'certifications', label: 'Certifications', icon: Award },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export default function SwipeDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  // Active section tracking + scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const sections = drawerItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(drawerItems[i].id);
          break;
        }
      }
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Edge swipe detection
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const deltaX = e.touches[0].clientX - startX;
      const deltaY = Math.abs(e.touches[0].clientY - startY);
      if (startX < 30 && deltaX > 50 && deltaY < 30 && !isOpen) {
        setIsOpen(true);
      }
    };
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setIsOpen(false);
  }, []);

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -100 || info.velocity.x < -300) {
      setIsOpen(false);
    }
  };

  const activeIndex = drawerItems.findIndex(item => item.id === activeSection);

  return (
    <>
      {/* Floating menu button — visible on mobile when sidebar is hidden */}
      <motion.button
        onClick={() => setIsOpen(true)}
        className="fixed top-5 left-5 z-[55] lg:hidden p-3 rounded-xl"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open navigation"
      >
        <Menu className="w-5 h-5 text-primary" />
      </motion.button>

      {/* Invisible edge touch zone */}
      <div className="fixed left-0 top-0 w-3 h-full z-[54] lg:hidden" />

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 z-[56]"
              style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              className="fixed left-0 top-0 h-full w-[290px] z-[57] flex flex-col"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.92) 0%, rgba(5,5,15,0.96) 100%)',
                borderRight: '1px solid rgba(255,255,255,0.06)',
                backdropFilter: 'blur(48px)',
                boxShadow: '8px 0 60px rgba(0,0,0,0.6), inset -1px 0 0 rgba(255,255,255,0.03)',
              }}
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              drag="x"
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.08}
              onDragEnd={handleDragEnd}
            >
              {/* Header */}
              <div className="p-6 pb-5 border-b border-white/[0.05] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-display font-bold gradient-text-cyan-purple">
                    Navigation
                  </h2>
                  <p className="text-[11px] text-muted-foreground/50 mt-1">Swipe or press ESC to close</p>
                </div>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/5 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto relative">
                {/* Scroll progress line */}
                <div className="absolute left-0 top-0 w-[2px] h-full">
                  <div
                    className="w-full rounded-full transition-all duration-200 ease-linear"
                    style={{
                      height: `${scrollProgress}%`,
                      background: 'linear-gradient(180deg, hsl(185 100% 50%), hsl(280 100% 60%))',
                      opacity: 0.4,
                    }}
                  />
                </div>

                {/* Active indicator */}
                {activeIndex >= 0 && (
                  <motion.div
                    className="absolute left-0 w-[2px] rounded-r-full"
                    style={{
                      height: '44px',
                      background: 'linear-gradient(180deg, hsl(185 100% 50%), hsl(280 100% 60%))',
                      boxShadow: '0 0 12px hsl(185 100% 50% / 0.3)',
                    }}
                    animate={{ top: `${activeIndex * 48 + 4}px` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  />
                )}

                <TooltipProvider delayDuration={400}>
                  {drawerItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                      <Tooltip key={item.id}>
                        <TooltipTrigger asChild>
                          <motion.button
                            onClick={() => scrollToSection(item.id)}
                            className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-left transition-all duration-300 group relative overflow-hidden ${
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground hover:text-foreground'
                            }`}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.035 }}
                            whileHover={{ x: 4 }}
                          >
                            {/* Hover glow bg */}
                            <span className={`absolute inset-0 rounded-xl transition-all duration-400 ${
                              isActive ? 'bg-primary/8' : 'bg-transparent group-hover:bg-white/[0.03]'
                            }`} />

                            <span className={`relative p-2 rounded-lg transition-all duration-300 ${
                              isActive
                                ? 'bg-primary/15 text-primary'
                                : 'text-muted-foreground group-hover:text-primary/80 group-hover:bg-primary/8'
                            }`}>
                              <Icon className="w-4 h-4" />
                            </span>

                            <span className={`relative font-medium text-sm transition-all duration-300 ${
                              isActive ? 'text-primary' : ''
                            }`}>
                              {item.label}
                            </span>

                            {/* Active dot */}
                            {isActive && (
                              <motion.span
                                className="absolute right-3 w-1.5 h-1.5 rounded-full bg-primary"
                                layoutId="drawer-active-dot"
                                style={{ boxShadow: '0 0 8px hsl(185 100% 50% / 0.5)' }}
                              />
                            )}
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="glass-card border-border/30 text-foreground text-xs">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </TooltipProvider>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-white/[0.04]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/40 tracking-wider uppercase">← Drag to close</span>
                  <div className="flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                    <span className="w-1 h-1 rounded-full bg-primary/25" />
                    <span className="w-1 h-1 rounded-full bg-primary/15" />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

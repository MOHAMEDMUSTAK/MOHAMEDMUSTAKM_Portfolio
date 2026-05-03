import { useState, useEffect, useRef } from 'react';
import { Home, User, FileText, Zap, FolderKanban, Award, Mail, LogIn, LogOut, Menu, X, Github, Clock, UserCheck } from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLoginDialog from './AdminLoginDialog';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
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

export default function Sidebar() {
  const [activeSection, setActiveSection] = useState('home');
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [clickRipple, setClickRipple] = useState<string | null>(null);
  const { isAdmin, logout } = useAdmin();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }

      // Scroll progress
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    // Click ripple micro-interaction
    setClickRipple(id);
    setTimeout(() => setClickRipple(null), 500);
    setIsMobileMenuOpen(false);
  };

  // Find active index for indicator position
  const activeIndex = navItems.findIndex(item => item.id === activeSection);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden glass-card p-3"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5 text-primary" /> : <Menu className="w-5 h-5 text-primary" />}
      </button>

      {/* Sidebar */}
      <aside
        ref={navRef}
        className={`fixed left-0 top-0 h-screen z-40 flex flex-col transition-transform duration-500 ease-out lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          width: '240px',
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(5,5,15,0.92) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(32px)',
          boxShadow: 'inset -1px 0 20px rgba(0,0,0,0.3), 4px 0 30px rgba(0,0,0,0.2)',
        }}
      >
        {/* Logo / Brand */}
        <div className="p-6 pb-5 border-b border-white/[0.04]">
          <h2 className="text-2xl font-display font-bold gradient-text-cyan-purple">
            Portfolio
          </h2>
          {isAdmin && (
            <span className="inline-block mt-2 px-2 py-0.5 text-xs rounded-full bg-primary/15 text-primary/90">
              Admin Mode
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 relative">
          {/* Scroll progress line */}
          <div className="absolute left-0 top-0 w-[2px] h-full">
            <div
              className="w-full rounded-full transition-all duration-150 ease-linear"
              style={{
                height: `${scrollProgress}%`,
                background: 'linear-gradient(180deg, hsl(185 100% 50%), hsl(280 100% 60%))',
                opacity: 0.5,
              }}
            />
          </div>

          {/* Animated active indicator */}
          {activeIndex >= 0 && (
            <motion.div
              className="absolute left-0 w-[2px] rounded-r-full"
              style={{
                height: '44px',
                background: 'linear-gradient(180deg, hsl(185 100% 50%), hsl(280 100% 60%))',
                boxShadow: '0 0 8px hsl(185 100% 50% / 0.4)',
              }}
              animate={{
                top: `${activeIndex * 48 + 4}px`,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          )}

          <TooltipProvider delayDuration={300}>
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const isRippling = clickRipple === item.id;
            
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`nav-item w-full opacity-0 animate-slide-in-left group relative overflow-hidden ${isActive ? 'active' : ''}`}
                    style={{
                      animationDelay: `${index * 0.08}s`,
                      animationFillMode: 'forwards',
                    }}
                  >
                    {/* Hover glow behind icon */}
                    <span 
                      className={`nav-icon p-2 rounded-lg transition-all duration-400 relative ${
                        isActive 
                          ? 'bg-primary/15 text-primary' 
                          : 'text-muted-foreground group-hover:text-primary/80'
                      }`}
                    >
                      <Icon className="w-4 h-4 relative z-10" />
                      <span className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/10 transition-all duration-400 scale-75 group-hover:scale-100" />
                    </span>
                    <span className={`font-medium transition-all duration-400 ${isActive ? 'text-primary' : 'group-hover:translate-x-0.5'}`}>
                      {item.label}
                    </span>

                    {/* Click ripple */}
                    {isRippling && (
                      <span className="absolute inset-0 rounded-xl bg-primary/10 animate-scale-in pointer-events-none" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="glass-card border-border/30 text-foreground text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
          </TooltipProvider>
        </nav>

        {/* Admin Section */}
        <div className="p-4 border-t border-white/[0.04]">
          {isAdmin ? (
            <button
              onClick={logout}
              className="nav-item w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => setShowLoginDialog(true)}
              className="nav-item w-full hover:text-primary group"
            >
              <LogIn className="w-4 h-4 group-hover:text-primary/80 transition-colors duration-300" />
              <span>Admin</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <AdminLoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </>
  );
}

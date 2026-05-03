import { useState, useRef, useEffect, useMemo } from 'react';
import { useProfile } from '@/hooks/usePortfolioData';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { useAdmin } from '@/contexts/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import { Pencil, Upload, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

function TypingText({ text, onComplete }: { text: string; onComplete: () => void }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current || !text) return;
    hasRun.current = true;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onComplete();
        setTimeout(() => setShowCursor(false), 1200);
      }
    }, 70);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return (
    <span className="gradient-text-rainbow">
      {displayed}
      {showCursor && (
        <span className="inline-block w-[3px] h-[0.85em] ml-1 align-middle bg-primary animate-[blink_1s_steps(2)_infinite]" />
      )}
    </span>
  );
}

export default function HeroSection() {
  const { profile, loading, updateProfile } = useProfile();
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', title: '', tagline: '' });
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const orbY1 = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const orbY2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbY3 = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 40]);

  const roles = [
    'Aspiring AI & ML Engineer',
    'Software Developer',
    'Machine Learning Enthusiast',
    'AI Research Learner',
    'Tech Innovator',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [roles.length]);

  if (loading) {
    return (
      <section id="home" className="min-h-screen bg-section-hero flex items-center justify-center">
        <div className="w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  const startEditing = () => {
    if (profile) {
      setEditForm({
        name: profile.name,
        title: profile.title,
        tagline: profile.tagline || '',
      });
      setIsEditing(true);
    }
  };

  const saveEdits = async () => {
    const error = await updateProfile(editForm);
    if (!error) {
      toast.success('Profile updated!');
      setIsEditing(false);
    } else {
      toast.error('Failed to update profile');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `profile-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(fileName, file);

    if (uploadError) {
      toast.error('Failed to upload image');
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(fileName);

    await updateProfile({ image_url: publicUrl });
    toast.success('Profile image updated!');
    setUploading(false);
  };

  const deleteImage = async () => {
    await updateProfile({ image_url: null });
    toast.success('Profile image removed');
  };

  return (
    <section ref={sectionRef} id="home" className="min-h-screen bg-section-hero relative overflow-hidden">
      {/* Animated Background Orbs with parallax */}
      <motion.div className="orb orb-cyan w-96 h-96 -top-48 -left-48" style={{ y: orbY1 }} />
      <motion.div className="orb orb-purple w-80 h-80 top-1/3 -right-40" style={{ y: orbY2 }} />
      <motion.div className="orb orb-pink w-72 h-72 bottom-20 left-1/4" style={{ y: orbY3 }} />

      <motion.div style={{ y: contentY }} className="relative z-10 container mx-auto px-6 lg:px-8 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center w-full">
          {/* Text Content */}
          <div className="space-y-10 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s', animationDuration: '1s' }}>
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="text-3xl font-bold bg-white/5 border-white/10"
                  placeholder="Your Name"
                />
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="text-xl bg-white/5 border-white/10"
                  placeholder="Your Title"
                />
                <Input
                  value={editForm.tagline}
                  onChange={(e) => setEditForm({ ...editForm, tagline: e.target.value })}
                  className="bg-white/5 border-white/10"
                  placeholder="Your Tagline"
                />
                <div className="flex gap-2">
                  <Button onClick={saveEdits} size="sm" className="bg-primary text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} size="sm" variant="outline">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  <p className="text-sm text-primary/80 font-medium tracking-[0.2em] uppercase animate-pulse-glow">
                    Welcome to my portfolio
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black leading-tight">
                    <TypingText text={profile?.name || ''} onComplete={() => {}} />
                  </h1>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                    <span className="gradient-text-purple-pink">{profile?.title}</span>
                  </h2>
                  
                  {/* Animated Rotating Role Text */}
                  <div className="h-10 md:h-12 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentRoleIndex}
                        initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
                        transition={{ duration: 0.7, ease: 'easeInOut' }}
                        className="text-lg md:text-xl lg:text-2xl font-medium gradient-text-cyan-purple"
                      >
                        {roles[currentRoleIndex]}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </div>
                
                <p className="text-lg text-muted-foreground/80 max-w-xl leading-relaxed">
                  {profile?.tagline}
                </p>

                <div className="flex flex-wrap gap-5">
                  <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-premium-primary"
                  >
                    Get In Touch
                  </button>
                  <button
                    onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                    className="btn-premium-outline"
                  >
                    View Projects
                  </button>
                </div>

                {isAdmin && (
                  <Button onClick={startEditing} size="sm" className="admin-btn">
                    <Pencil className="w-4 h-4 mr-2" /> Edit Profile
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Profile Image — refined */}
          <div className="flex justify-center lg:justify-end opacity-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <motion.div
              className="relative"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Outer radial glow — large & diffused */}
              <div
                className="absolute rounded-full pointer-events-none"
                style={{
                  inset: '-30%',
                  background: 'radial-gradient(circle, hsl(185 100% 50% / 0.12), hsl(280 100% 60% / 0.08), transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              {/* Rotating gradient ring */}
              <div className="absolute -inset-[5px] rounded-full animate-rotate-slow opacity-50"
                style={{ background: 'conic-gradient(from 0deg, hsl(185 100% 50%), hsl(280 100% 60%), hsl(330 100% 60%), hsl(185 100% 50%))' }}
              />
              {/* Inner mask to cut out ring center */}
              <div className="absolute -inset-[2px] rounded-full bg-background" />

              {/* Image Container — larger */}
              <div className="relative w-72 h-72 md:w-[22rem] md:h-[22rem] lg:w-[26rem] lg:h-[26rem] rounded-full overflow-hidden border border-white/[0.06]">
                {profile?.image_url ? (
                  <img
                    src={profile.image_url}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="text-7xl font-display font-bold gradient-text-cyan-purple">
                      {profile?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
              </div>

              {/* Admin Image Controls */}
              {isAdmin && (
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    size="sm"
                    disabled={uploading}
                    className="admin-btn"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                  {profile?.image_url && (
                    <Button onClick={deleteImage} size="sm" className="admin-btn-danger">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <span className="text-xs text-muted-foreground/60 tracking-[0.15em] uppercase">Scroll to explore</span>
        <div className="w-5 h-9 rounded-full border border-primary/30 flex justify-center pt-2">
          <div className="w-0.5 h-2 bg-primary/60 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

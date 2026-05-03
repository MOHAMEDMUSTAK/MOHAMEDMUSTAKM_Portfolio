import { useState, useEffect, useRef } from 'react';
import { useProfile, useStats, Stat } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Pencil, Save, X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

// Animated counter component
function AnimatedCounter({ value, duration = 2000 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateValue();
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  const animateValue = () => {
    // Extract numeric part and suffix (e.g., "50+" -> 50, "+")
    const numericMatch = value.match(/^(\d+)/);
    const suffix = value.replace(/^\d+/, '');
    
    if (!numericMatch) {
      setDisplayValue(value);
      return;
    }

    const targetNumber = parseInt(numericMatch[1], 10);
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentNumber = Math.floor(easeOutQuart * targetNumber);
      
      setDisplayValue(`${currentNumber}${suffix}`);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  return <div ref={ref}>{displayValue}</div>;
}

export default function AboutSection() {
  const { profile, updateProfile } = useProfile();
  const { stats, updateStat, addStat, deleteStat } = useStats();
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState('');
  const [showStatDialog, setShowStatDialog] = useState(false);
  const [editingStat, setEditingStat] = useState<Stat | null>(null);
  const [statForm, setStatForm] = useState({ value: '', label: '', display_order: 0 });

  const startEditing = () => {
    setBio(profile?.bio || '');
    setIsEditing(true);
  };

  const saveEdits = async () => {
    const error = await updateProfile({ bio });
    if (!error) {
      toast.success('About section updated!');
      setIsEditing(false);
    } else {
      toast.error('Failed to update');
    }
  };

  const openStatDialog = (stat?: Stat) => {
    if (stat) {
      setStatForm({ value: stat.value, label: stat.label, display_order: stat.display_order });
      setEditingStat(stat);
    } else {
      setStatForm({ value: '', label: '', display_order: stats.length + 1 });
      setEditingStat(null);
    }
    setShowStatDialog(true);
  };

  const closeStatDialog = () => {
    setShowStatDialog(false);
    setEditingStat(null);
    setStatForm({ value: '', label: '', display_order: 0 });
  };

  const handleStatSubmit = async () => {
    if (editingStat) {
      const error = await updateStat(editingStat.id, statForm);
      if (!error) {
        toast.success('Stat updated!');
        closeStatDialog();
      } else {
        toast.error('Failed to update stat');
      }
    } else {
      const { error } = await addStat(statForm);
      if (!error) {
        toast.success('Stat added!');
        closeStatDialog();
      } else {
        toast.error('Failed to add stat');
      }
    }
  };

  const handleDeleteStat = async (id: string) => {
    const error = await deleteStat(id);
    if (!error) {
      toast.success('Stat deleted!');
    } else {
      toast.error('Failed to delete stat');
    }
  };

  return (
    <section id="about" className="min-h-screen bg-section-about py-24 lg:py-32 relative">
      {/* Background Decorations */}
      <div className="orb orb-purple w-64 h-64 top-20 left-10 opacity-20" />
      <div className="orb orb-pink w-48 h-48 bottom-40 right-20 opacity-15" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Get to know me
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-purple-pink">About Me</span>
          </h2>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-8 md:p-12 opacity-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/10 text-lg leading-relaxed"
                  placeholder="Write about yourself..."
                />
                <div className="flex gap-2">
                  <Button onClick={saveEdits} className="bg-primary text-primary-foreground">
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="prose prose-invert prose-lg max-w-none">
                  {profile?.bio?.split('\n').map((paragraph, index) => (
                    <p 
                      key={index} 
                      className="text-lg md:text-xl leading-relaxed text-muted-foreground mb-6 last:mb-0"
                    >
                      {paragraph.split(' ').map((word, wordIndex) => {
                        // Highlight keywords
                        const keywords = ['passionate', 'developer', 'experience', 'modern', 'React', 'TypeScript', 'Node.js', 'mission', 'elegant', 'scalable'];
                        const isKeyword = keywords.some(kw => word.toLowerCase().includes(kw.toLowerCase()));
                        
                        return (
                          <span 
                            key={wordIndex}
                            className={isKeyword ? 'text-foreground font-medium' : ''}
                          >
                            {word}{' '}
                          </span>
                        );
                      })}
                    </p>
                  ))}
                </div>

                {isAdmin && (
                  <Button onClick={startEditing} size="sm" className="mt-6 admin-btn">
                    <Pencil className="w-4 h-4 mr-2" /> Edit Bio
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="glass-card-hover p-6 text-center group relative overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                {/* Gradient border glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/10 group-hover:to-pink-500/20 transition-all duration-500 pointer-events-none" />
                
                <div className="text-3xl md:text-4xl font-display font-bold gradient-text-cyan-purple">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-sm text-muted-foreground mt-2">{stat.label}</div>
                
                {/* Admin Edit Button */}
                {isAdmin && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      onClick={() => openStatDialog(stat)} 
                      size="icon" 
                      variant="ghost"
                      className="h-6 w-6 bg-white/10 hover:bg-white/20"
                    >
                      <Pencil className="w-3 h-3" />
                    </Button>
                    <Button 
                      onClick={() => handleDeleteStat(stat.id)} 
                      size="icon" 
                      variant="ghost"
                      className="h-6 w-6 bg-red-500/20 hover:bg-red-500/40 text-red-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </motion.div>
            ))}

            {/* Add Stat Button (Admin) */}
            {isAdmin && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                onClick={() => openStatDialog()}
                className="glass-card-hover p-6 text-center border-2 border-dashed border-white/20 hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 min-h-[120px]"
              >
                <Plus className="w-8 h-8 text-primary/70" />
                <span className="text-sm text-muted-foreground">Add Stat</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Stat Edit/Add Dialog */}
      <Dialog open={showStatDialog} onOpenChange={closeStatDialog}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editingStat ? 'Edit Stat' : 'Add New Stat'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Value</label>
              <Input
                value={statForm.value}
                onChange={(e) => setStatForm({ ...statForm, value: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., 50+, 100%, 5 Years"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Label</label>
              <Input
                value={statForm.label}
                onChange={(e) => setStatForm({ ...statForm, label: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., Projects Completed"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Display Order</label>
              <Input
                type="number"
                value={statForm.display_order}
                onChange={(e) => setStatForm({ ...statForm, display_order: parseInt(e.target.value) || 0 })}
                className="bg-white/5 border-white/10"
                placeholder="1"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleStatSubmit} className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" /> {editingStat ? 'Update' : 'Add'}
              </Button>
              <Button onClick={closeStatDialog} variant="outline">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Sparkles, Code2, Brain, Rocket, Zap, Eye, Globe, Plus, Pencil, Trash2, Save } from 'lucide-react';
import { useProfile, useAIFacts, AIFact } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Code2, Rocket, Sparkles, Zap, Eye, Globe, Bot,
};

export default function AIAssistantBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useProfile();
  const { facts, addFact, updateFact, deleteFact } = useAIFacts();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<AIFact | null>(null);
  const [form, setForm] = useState({ icon: 'Brain', label: '', text: '', display_order: 0 });

  const openAdd = () => {
    setForm({ icon: 'Brain', label: '', text: '', display_order: facts.length });
    setEditing(null);
    setShowDialog(true);
  };

  const openEdit = (fact: AIFact) => {
    setForm({ icon: fact.icon || 'Brain', label: fact.label, text: fact.text, display_order: fact.display_order });
    setEditing(fact);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      const error = await updateFact(editing.id, form);
      if (!error) { toast.success('Updated!'); setShowDialog(false); }
      else toast.error('Failed');
    } else {
      const { error } = await addFact(form);
      if (!error) { toast.success('Added!'); setShowDialog(false); }
      else toast.error('Failed');
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteFact(id);
    if (!error) toast.success('Deleted!');
    else toast.error('Failed');
  };

  return (
    <>
      {/* Floating Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-shadow duration-300"
        style={{
          background: 'linear-gradient(135deg, hsl(185 100% 50%), hsl(280 100% 60%))',
          boxShadow: isOpen ? '0 0 30px hsla(185, 100%, 50%, 0.3)' : '0 4px 20px rgba(0,0,0,0.4)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        aria-label="AI Assistant"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          ) : (
            <motion.div key="bot" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
              <Bot className="w-6 h-6 text-primary-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-80 glass-card rounded-2xl overflow-hidden border border-border/30"
          >
            <div className="p-4 border-b border-border/20" style={{ background: 'linear-gradient(135deg, hsla(185, 100%, 50%, 0.08), hsla(280, 100%, 60%, 0.05))' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(185 100% 50% / 0.2), hsl(280 100% 60% / 0.2))' }}>
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">Quick Overview</h4>
                  <p className="text-xs text-muted-foreground">{profile?.name || 'Portfolio'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3">
              {facts.map((fact, i) => {
                const Icon = iconMap[fact.icon || 'Brain'] || Brain;
                return (
                  <motion.div
                    key={fact.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className="flex items-center gap-3 p-2.5 rounded-lg transition-colors duration-200 group"
                    style={{ background: 'rgba(255,255,255,0.02)' }}
                  >
                    <Icon className="w-4 h-4 text-primary/70 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <span className="text-xs text-muted-foreground/70 uppercase tracking-wider">{fact.label}</span>
                      <p className="text-sm text-foreground/90">{fact.text}</p>
                    </div>
                    {isAdmin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(fact)} className="p-1 rounded hover:bg-white/10"><Pencil className="w-3 h-3" /></button>
                        <button onClick={() => handleDelete(fact.id)} className="p-1 rounded hover:bg-red-500/20 text-red-400"><Trash2 className="w-3 h-3" /></button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {isAdmin && (
                <button onClick={openAdd} className="w-full p-2 rounded-lg border border-dashed border-white/20 hover:border-primary/50 text-xs text-muted-foreground flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" /> Add Fact
                </button>
              )}
            </div>

            <div className="px-4 py-3 border-t border-border/20">
              <button
                onClick={() => { document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); setIsOpen(false); }}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-primary-foreground transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, hsl(185 100% 50%), hsl(280 100% 60%))' }}
              >
                Get In Touch
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">{editing ? 'Edit Fact' : 'Add Fact'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Icon</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(iconMap).map((name) => {
                  const IC = iconMap[name];
                  return (
                    <button key={name} onClick={() => setForm({ ...form, icon: name })}
                      className={`p-2 rounded-lg border ${form.icon === name ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'}`}>
                      <IC className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Label</label>
              <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="bg-white/5 border-white/10" placeholder="e.g., Focus" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Text</label>
              <Input value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} className="bg-white/5 border-white/10" placeholder="e.g., AI & Machine Learning" />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" /> {editing ? 'Update' : 'Add'}
              </Button>
              <Button onClick={() => setShowDialog(false)} variant="outline">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

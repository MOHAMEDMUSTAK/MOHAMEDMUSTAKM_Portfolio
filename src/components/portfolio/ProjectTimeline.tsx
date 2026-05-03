import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Code, Brain, Eye, Bone, Globe, Rocket, Sparkles, Zap, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useTimeline, TimelineMilestone } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code, Brain, Eye, Bone, Globe, Rocket, Sparkles, Zap,
};

const gradientOptions = [
  'from-cyan-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-pink-400 to-rose-500',
  'from-orange-400 to-amber-500',
  'from-green-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-yellow-400 to-orange-500',
];

function TimelineItem({ milestone, index, isAdmin, onEdit, onDelete }: {
  milestone: TimelineMilestone;
  index: number;
  isAdmin: boolean;
  onEdit: (m: TimelineMilestone) => void;
  onDelete: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const Icon = iconMap[milestone.icon || 'Code'] || Code;
  const isLeft = index % 2 === 0;

  return (
    <div ref={ref} className={`flex items-center gap-6 md:gap-0 relative ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
      <motion.div
        className={`flex-1 ${isLeft ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'}`}
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="glass-card p-6 inline-block hover:border-primary/20 transition-all duration-300 group relative">
          <h3 className="text-lg font-semibold text-foreground mb-2">{milestone.title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{milestone.description}</p>
          {isAdmin && (
            <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button onClick={() => onEdit(milestone)} size="sm" className="admin-btn">
                <Pencil className="w-3 h-3" />
              </Button>
              <Button onClick={() => onDelete(milestone.id)} size="sm" className="admin-btn-danger">
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        className="hidden md:flex items-center justify-center z-10 flex-shrink-0"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
      >
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${milestone.gradient || 'from-cyan-400 to-blue-500'} flex items-center justify-center shadow-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </motion.div>

      <div className="flex-1 hidden md:block" />
    </div>
  );
}

export default function ProjectTimeline() {
  const { milestones, addMilestone, updateMilestone, deleteMilestone } = useTimeline();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<TimelineMilestone | null>(null);
  const [form, setForm] = useState({ title: '', description: '', icon: 'Code', gradient: 'from-cyan-400 to-blue-500', display_order: 0 });

  const openAdd = () => {
    setForm({ title: '', description: '', icon: 'Code', gradient: 'from-cyan-400 to-blue-500', display_order: milestones.length });
    setEditing(null);
    setShowDialog(true);
  };

  const openEdit = (m: TimelineMilestone) => {
    setForm({ title: m.title, description: m.description || '', icon: m.icon || 'Code', gradient: m.gradient || 'from-cyan-400 to-blue-500', display_order: m.display_order });
    setEditing(m);
    setShowDialog(true);
  };

  const handleSubmit = async () => {
    if (editing) {
      const error = await updateMilestone(editing.id, form);
      if (!error) { toast.success('Milestone updated!'); setShowDialog(false); }
      else toast.error('Failed to update');
    } else {
      const { error } = await addMilestone(form);
      if (!error) { toast.success('Milestone added!'); setShowDialog(false); }
      else toast.error('Failed to add');
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteMilestone(id);
    if (!error) toast.success('Milestone deleted!');
    else toast.error('Failed to delete');
  };

  return (
    <section id="timeline" className="py-24 lg:py-32 relative" style={{
      background: `
        radial-gradient(ellipse 60% 50% at 80% 30%, hsl(var(--gradient-purple) / 0.06), transparent),
        radial-gradient(ellipse 50% 60% at 20% 70%, hsl(var(--gradient-pink) / 0.05), transparent),
        hsl(0 0% 0%)
      `
    }}>
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">My Journey</span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-purple-pink">Development Timeline</span>
          </h2>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={openAdd} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Milestone
            </Button>
          </div>
        )}

        <div className="relative max-w-4xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ background: 'linear-gradient(180deg, transparent, hsl(var(--gradient-cyan) / 0.3), hsl(var(--gradient-purple) / 0.3), transparent)' }}
          />
          <div className="space-y-12 md:space-y-16">
            {milestones.map((milestone, index) => (
              <TimelineItem key={milestone.id} milestone={milestone} index={index} isAdmin={isAdmin} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editing ? 'Edit Milestone' : 'Add Milestone'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Icon</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(iconMap).map((name) => {
                  const IC = iconMap[name];
                  return (
                    <button key={name} onClick={() => setForm({ ...form, icon: name })}
                      className={`p-2 rounded-lg border ${form.icon === name ? 'border-primary bg-primary/20' : 'border-white/10 bg-white/5'}`}>
                      <IC className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Gradient</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {gradientOptions.map((g) => (
                  <button key={g} onClick={() => setForm({ ...form, gradient: g })}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${g} ${form.gradient === g ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Order</label>
              <Input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} className="bg-white/5 border-white/10 w-24" />
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
    </section>
  );
}

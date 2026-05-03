import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Zap, Target, Lightbulb, Rocket, Shield, Code, Eye, Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { useWhyHireMe, WhyHireMeReason } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain, Zap, Target, Lightbulb, Rocket, Shield, Code, Eye,
};

const iconOptions = Object.keys(iconMap);

const gradientOptions = [
  'from-cyan-400 to-blue-500',
  'from-purple-400 to-pink-500',
  'from-orange-400 to-rose-500',
  'from-emerald-400 to-teal-500',
  'from-blue-400 to-indigo-500',
  'from-pink-400 to-purple-500',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
];

export default function WhyHireMe() {
  const { reasons, addReason, updateReason, deleteReason } = useWhyHireMe();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editingReason, setEditingReason] = useState<WhyHireMeReason | null>(null);
  const [formData, setFormData] = useState({
    title: '', description: '', icon: 'Brain', gradient: 'from-cyan-400 to-blue-500', display_order: 0,
  });

  const handleSubmit = async () => {
    const data = { ...formData, display_order: formData.display_order };
    if (editingReason) {
      const error = await updateReason(editingReason.id, data);
      if (!error) { toast.success('Updated!'); closeDialog(); }
      else toast.error('Failed to update');
    } else {
      const { error } = await addReason(data);
      if (!error) { toast.success('Added!'); closeDialog(); }
      else toast.error('Failed to add');
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteReason(id);
    if (!error) toast.success('Deleted!');
    else toast.error('Failed to delete');
  };

  const openEditDialog = (reason: WhyHireMeReason) => {
    setFormData({
      title: reason.title,
      description: reason.description || '',
      icon: reason.icon || 'Brain',
      gradient: reason.gradient || 'from-cyan-400 to-blue-500',
      display_order: reason.display_order,
    });
    setEditingReason(reason);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingReason(null);
    setFormData({ title: '', description: '', icon: 'Brain', gradient: 'from-cyan-400 to-blue-500', display_order: 0 });
  };

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            The Value I Bring
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-cyan-purple">Why Hire Me</span>
          </h2>
        </div>

        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowDialog(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Reason
            </Button>
          </div>
        )}

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {[...reasons].sort((a, b) => a.display_order - b.display_order).map((reason, index) => {
            const Icon = iconMap[reason.icon || 'Brain'] || Brain;
            const gradient = reason.gradient || 'from-cyan-400 to-blue-500';
            return (
              <motion.div
                key={reason.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="glass-card-hover p-8 group relative overflow-hidden border border-border/30 hover:border-primary/20 transition-all duration-500"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />

                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>

                <h3 className="text-xl font-display font-bold mb-3 text-foreground">{reason.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{reason.description}</p>

                {isAdmin && (
                  <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button onClick={() => openEditDialog(reason)} size="sm" className="admin-btn">
                      <Pencil className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button onClick={() => handleDelete(reason.id)} size="sm" className="admin-btn-danger">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent className="glass-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editingReason ? 'Edit Reason' : 'Add New Reason'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Title</label>
              <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="bg-white/5 border-white/10" placeholder="e.g., AI-First Mindset" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="bg-white/5 border-white/10" placeholder="Describe the value..." />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Icon</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {iconOptions.map((iconName) => {
                  const Ic = iconMap[iconName];
                  return (
                    <button key={iconName} onClick={() => setFormData({ ...formData, icon: iconName })}
                      className={`p-2 rounded-lg border transition-all ${formData.icon === iconName ? 'border-primary bg-primary/20' : 'border-white/10 hover:border-white/20'}`}>
                      <Ic className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Gradient</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {gradientOptions.map((g) => (
                  <button key={g} onClick={() => setFormData({ ...formData, gradient: g })}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${g} ${formData.gradient === g ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''}`} />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Priority (lower = first)</label>
              <Input type="number" value={formData.display_order} onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })} className="bg-white/5 border-white/10 w-24" min={0} />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" /> {editingReason ? 'Update' : 'Add'}
              </Button>
              <Button onClick={closeDialog} variant="outline">
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

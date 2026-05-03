import { useState } from 'react';
import { useSkills, Skill } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import SkillRadar from './SkillRadar';

const colorMap: Record<string, string> = {
  cyan: 'from-cyan-400 to-cyan-600',
  blue: 'from-blue-400 to-blue-600',
  purple: 'from-purple-400 to-purple-600',
  pink: 'from-pink-400 to-pink-600',
  green: 'from-emerald-400 to-emerald-600',
  orange: 'from-orange-400 to-orange-600',
  yellow: 'from-yellow-400 to-yellow-600',
  teal: 'from-teal-400 to-teal-600',
  amber: 'from-amber-400 to-amber-600',
};

const glowMap: Record<string, string> = {
  cyan: 'shadow-[0_0_20px_rgba(0,255,255,0.4)]',
  blue: 'shadow-[0_0_20px_rgba(59,130,246,0.4)]',
  purple: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
  pink: 'shadow-[0_0_20px_rgba(236,72,153,0.4)]',
  green: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
  orange: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]',
  yellow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]',
  teal: 'shadow-[0_0_20px_rgba(20,184,166,0.4)]',
  amber: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]',
};

export default function SkillsSection() {
  const { skills, addSkill, updateSkill, deleteSkill } = useSkills();
  const { isAdmin } = useAdmin();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', proficiency: 80, color: 'cyan', display_order: 0 });

  const categories = [...new Set(skills.map(s => s.category))];

  const handleAdd = async () => {
    const { display_order, ...skillData } = formData;
    const { error } = await addSkill({ ...skillData, display_order });
    if (!error) {
      toast.success('Skill added!');
      setShowAddDialog(false);
      setFormData({ name: '', category: '', proficiency: 80, color: 'cyan', display_order: 0 });
    } else {
      toast.error('Failed to add skill');
    }
  };

  const handleUpdate = async () => {
    if (!editingSkill) return;
    const error = await updateSkill(editingSkill.id, {
      name: formData.name,
      category: formData.category,
      proficiency: formData.proficiency,
      color: formData.color,
      display_order: formData.display_order,
    });
    if (!error) {
      toast.success('Skill updated!');
      setEditingSkill(null);
    } else {
      toast.error('Failed to update skill');
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteSkill(id);
    if (!error) {
      toast.success('Skill deleted!');
    } else {
      toast.error('Failed to delete skill');
    }
  };

  const openEditDialog = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      color: skill.color || 'cyan',
      display_order: skill.display_order,
    });
    setEditingSkill(skill);
  };

  return (
    <section id="skills" className="min-h-screen bg-section-skills py-24 lg:py-32 relative">
      <div className="orb orb-cyan w-72 h-72 top-40 right-10 opacity-20" />
      <div className="orb orb-purple w-56 h-56 bottom-20 left-20 opacity-15" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            What I do best
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-blue-cyan">Skills & Expertise</span>
          </h2>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowAddDialog(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Skill
            </Button>
          </div>
        )}

        {/* Radar Visualization — top skills */}
        {skills.length >= 3 && (
          <div className="mb-16">
            <SkillRadar
              skills={skills
                .sort((a, b) => b.proficiency - a.proficiency)
                .slice(0, 8)
                .map(s => ({ name: s.name, value: s.proficiency, color: s.color || 'cyan' }))}
            />
          </div>
        )}

        {/* Skills by Category */}
        <div className="space-y-12">
          {categories.map((category, catIndex) => (
            <div 
              key={category}
              className="opacity-0 animate-fade-in"
              style={{ animationDelay: `${catIndex * 0.15}s` }}
            >
              <h3 className="text-2xl font-display font-semibold mb-6 gradient-text-purple-pink">
                {category}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {skills
                  .filter(s => s.category === category)
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((skill, skillIndex) => (
                    <div
                      key={skill.id}
                      className={`glass-card-hover p-6 group opacity-0 animate-scale-in relative ${glowMap[skill.color || 'cyan']}`}
                      style={{ animationDelay: `${catIndex * 0.15 + skillIndex * 0.05}s` }}
                    >
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-lg">{skill.name}</span>
                        <span className={`text-sm font-bold bg-gradient-to-r ${colorMap[skill.color || 'cyan']} bg-clip-text text-transparent`}>
                          {skill.proficiency}%
                        </span>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="skill-progress">
                        <div
                          className={`skill-progress-bar bg-gradient-to-r ${colorMap[skill.color || 'cyan']}`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>

                      {/* Admin Controls */}
                      {isAdmin && (
                        <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => openEditDialog(skill)} size="sm" className="admin-btn">
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button onClick={() => handleDelete(skill.id)} size="sm" className="admin-btn-danger">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showAddDialog || !!editingSkill} onOpenChange={(open) => {
        if (!open) {
          setShowAddDialog(false);
          setEditingSkill(null);
        }
      }}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editingSkill ? 'Edit Skill' : 'Add New Skill'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Skill Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., React"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., Frontend"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Proficiency: {formData.proficiency}%</label>
              <Slider
                value={[formData.proficiency]}
                onValueChange={(value) => setFormData({ ...formData, proficiency: value[0] })}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Color</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {Object.keys(colorMap).map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full bg-gradient-to-r ${colorMap[color]} ${
                      formData.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-background' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Priority (lower = first)</label>
              <Input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                className="bg-white/5 border-white/10 w-24"
                min={0}
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button
                onClick={editingSkill ? handleUpdate : handleAdd}
                className="bg-primary text-primary-foreground"
              >
                <Save className="w-4 h-4 mr-2" /> {editingSkill ? 'Update' : 'Add'}
              </Button>
              <Button
                onClick={() => {
                  setShowAddDialog(false);
                  setEditingSkill(null);
                }}
                variant="outline"
              >
                <X className="w-4 h-4 mr-2" /> Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

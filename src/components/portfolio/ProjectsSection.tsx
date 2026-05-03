import { useState, useRef, useCallback } from 'react';
import { useProjects, Project } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Plus, Pencil, Trash2, Save, X, Github, ExternalLink, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

function useCardTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
  };
  const handleMouseLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };
  return { ref, handleMouseMove, handleMouseLeave };
}

function ProjectCard({ project, index, isAdmin, openEditDialog, handleDelete, onDragStart, onDragOver, onDrop, isDragging }: {
  project: Project; index: number; isAdmin: boolean;
  openEditDialog: (p: Project) => void; handleDelete: (id: string) => void;
  onDragStart?: () => void; onDragOver?: (e: React.DragEvent) => void; onDrop?: () => void; isDragging?: boolean;
}) {
  const { ref, handleMouseMove, handleMouseLeave } = useCardTilt();
  return (
    <article
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      draggable={isAdmin}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative group opacity-0 animate-fade-in transition-transform duration-300 ease-out will-change-transform ${isDragging ? 'opacity-50 scale-95' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Admin drag handle */}
      {isAdmin && (
        <div className="absolute top-3 left-3 z-20 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </div>
      )}
      {/* Gradient border glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-primary/15 via-secondary/10 to-accent/15 opacity-40 group-hover:opacity-70 transition-opacity duration-500 blur-[1px]" />
      
      <div className="relative glass-card rounded-2xl overflow-hidden flex flex-col h-full">
        {/* Image */}
        <div className="relative overflow-hidden">
          <div className="aspect-[16/10]">
            {project.image_url ? (
              <img src={project.image_url} alt={project.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 flex items-center justify-center">
                <span className="text-5xl font-display font-bold gradient-text-pink-orange opacity-50">{project.name.charAt(0)}</span>
              </div>
            )}
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1 space-y-4">
          <div>
            <h3 className="text-xl font-display font-bold gradient-text-cyan-purple leading-snug tracking-tight">{project.name}</h3>
          </div>
          
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">{project.description}</p>
          
          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5">
            {project.technologies?.slice(0, 5).map((tech) => (
              <span key={tech} className="px-2.5 py-1 text-[11px] rounded-md bg-muted/50 border border-border/40 text-muted-foreground font-medium">{tech}</span>
            ))}
            {(project.technologies?.length || 0) > 5 && (
              <span className="px-2.5 py-1 text-[11px] rounded-md bg-muted/50 border border-border/40 text-muted-foreground/60">+{(project.technologies?.length || 0) - 5}</span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-border/20">
            {project.github_link ? (
              <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-300 group/link">
                <Github className="w-4 h-4 transition-transform group-hover/link:scale-110" />
                <span>Source</span>
              </a>
            ) : <div />}
            
            {/* Admin Controls */}
            {isAdmin && (
              <div className="flex gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button onClick={() => openEditDialog(project)} size="sm" className="admin-btn h-7 text-xs"><Pencil className="w-3 h-3 mr-1" /> Edit</Button>
                <Button onClick={() => handleDelete(project.id)} size="sm" className="admin-btn-danger h-7 text-xs"><Trash2 className="w-3 h-3" /></Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function ProjectsSection() {
  const { projects, addProject, updateProject, deleteProject, refetch } = useProjects();
  const { isAdmin } = useAdmin();

  // Drag-and-drop state
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDragStart = useCallback((id: string) => {
    dragItem.current = id;
    setDraggingId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: string) => {
    e.preventDefault();
    dragOverItem.current = id;
  }, []);

  const handleDrop = useCallback(async () => {
    if (!dragItem.current || !dragOverItem.current || dragItem.current === dragOverItem.current) {
      setDraggingId(null);
      return;
    }
    const sorted = [...projects].sort((a, b) => a.display_order - b.display_order);
    const dragIdx = sorted.findIndex(p => p.id === dragItem.current);
    const dropIdx = sorted.findIndex(p => p.id === dragOverItem.current);
    if (dragIdx === -1 || dropIdx === -1) { setDraggingId(null); return; }

    const reordered = [...sorted];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dropIdx, 0, moved);

    const updates = reordered.map((proj, i) =>
      supabase.from('projects').update({ display_order: i }).eq('id', proj.id)
    );
    await Promise.all(updates);
    await refetch();
    toast.success('Project order updated!');

    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
  }, [projects, refetch]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    technologies: '',
    github_link: '',
    image_url: '',
    display_order: 0,
  });

  const handleSubmit = async () => {
    const projectData = {
      name: formData.name,
      description: formData.description,
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
      github_link: formData.github_link || null,
      image_url: formData.image_url || null,
      featured: false,
      display_order: formData.display_order,
    };

    if (editingProject) {
      const error = await updateProject(editingProject.id, projectData);
      if (!error) {
        toast.success('Project updated!');
        closeDialog();
      } else {
        toast.error('Failed to update project');
      }
    } else {
      const { error } = await addProject(projectData);
      if (!error) {
        toast.success('Project added!');
        closeDialog();
      } else {
        toast.error('Failed to add project');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteProject(id);
    if (!error) {
      toast.success('Project deleted!');
    } else {
      toast.error('Failed to delete project');
    }
  };

  const openEditDialog = (project: Project) => {
    setFormData({
      name: project.name,
      description: project.description || '',
      technologies: project.technologies?.join(', ') || '',
      github_link: project.github_link || '',
      image_url: project.image_url || '',
      display_order: project.display_order,
    });
    setEditingProject(project);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingProject(null);
    setFormData({ name: '', description: '', technologies: '', github_link: '', image_url: '', display_order: 0 });
  };

  return (
    <section id="projects" className="min-h-screen bg-section-projects py-24 lg:py-32 relative">
      <div className="orb orb-pink w-80 h-80 top-20 left-10 opacity-20" />
      <div className="orb orb-purple w-64 h-64 bottom-40 right-20 opacity-15" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            My work
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-pink-orange">Featured Projects</span>
          </h2>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowDialog(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Project
            </Button>
          </div>
        )}

        {/* Search & Filter */}
        {(() => {
          const allTechs = [...new Set(projects.flatMap(p => p.technologies || []))];
          const filtered = [...projects]
            .sort((a, b) => a.display_order - b.display_order)
            .filter(p => {
              const matchesSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.technologies?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
              const matchesFilter = !activeFilter || p.technologies?.includes(activeFilter);
              return matchesSearch && matchesFilter;
            });
          return (
            <>
              <div className="max-w-5xl mx-auto mb-8 space-y-4">
                <div className="relative">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects by name or technology..."
                    className="bg-white/5 border-white/10 pl-10 h-12"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveFilter(null)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${!activeFilter ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary/80'}`}
                  >All</button>
                  {allTechs.slice(0, 8).map(tech => (
                    <button
                      key={tech}
                      onClick={() => setActiveFilter(activeFilter === tech ? null : tech)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-all duration-300 ${activeFilter === tech ? 'bg-primary/20 border-primary/40 text-primary' : 'border-border/40 text-muted-foreground hover:border-primary/30 hover:text-primary/80'}`}
                    >{tech}</button>
                  ))}
                </div>
              </div>

              {/* Projects Grid - 2 Column */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {filtered.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} isAdmin={isAdmin} openEditDialog={openEditDialog} handleDelete={handleDelete} onDragStart={() => handleDragStart(project.id)} onDragOver={(e) => handleDragOver(e, project.id)} onDrop={handleDrop} isDragging={draggingId === project.id} />
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No projects match your search.</div>
                )}
              </div>
            </>
          );
        })()}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent className="glass-card border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editingProject ? 'Edit Project' : 'Add New Project'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Project Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., E-Commerce Platform"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="Describe your project..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Technologies (comma-separated)</label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., React, Node.js, PostgreSQL"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">GitHub Link (optional)</label>
              <Input
                value={formData.github_link}
                onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="https://github.com/..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Image URL (optional)</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="https://..."
              />
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
              <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
                <Save className="w-4 h-4 mr-2" /> {editingProject ? 'Update' : 'Add'}
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

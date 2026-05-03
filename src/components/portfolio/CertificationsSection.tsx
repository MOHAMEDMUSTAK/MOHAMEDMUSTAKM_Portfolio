import { useState, useRef, useCallback } from 'react';
import { useCertifications, Certification } from '@/hooks/usePortfolioData';
import { useAdmin } from '@/contexts/AdminContext';
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Award, Eye, Image as ImageIcon, GripVertical } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { getGoogleDriveDirectUrl, getGoogleDriveThumbnailUrl, isGoogleDriveUrl } from '@/lib/googleDriveUtils';

export default function CertificationsSection() {
  const { certifications, addCertification, updateCertification, deleteCertification, refetch } = useCertifications();
  const { isAdmin } = useAdmin();
  const [showDialog, setShowDialog] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    date: '',
    verification_link: '',
    image_url: '',
    display_order: 0,
  });
  const [viewingCert, setViewingCert] = useState<Certification | null>(null);

  // Drag-and-drop state
  const dragItem = useRef<string | null>(null);
  const dragOverItem = useRef<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const sortedCerts = [...certifications].sort((a, b) => a.display_order - b.display_order);

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

    const dragIdx = sortedCerts.findIndex(c => c.id === dragItem.current);
    const dropIdx = sortedCerts.findIndex(c => c.id === dragOverItem.current);
    if (dragIdx === -1 || dropIdx === -1) { setDraggingId(null); return; }

    // Reorder array
    const reordered = [...sortedCerts];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(dropIdx, 0, moved);

    // Batch update display_order
    const updates = reordered.map((cert, i) => 
      supabase.from('certifications').update({ display_order: i }).eq('id', cert.id)
    );
    await Promise.all(updates);
    await refetch();
    toast.success('Certificate order updated!');

    dragItem.current = null;
    dragOverItem.current = null;
    setDraggingId(null);
  }, [sortedCerts, refetch]);

  const handleSubmit = async () => {
    const certData = {
      name: formData.name,
      organization: formData.organization,
      date: formData.date || null,
      verification_link: formData.verification_link || null,
      image_url: formData.image_url || null,
      display_order: formData.display_order,
    };

    if (editingCert) {
      const error = await updateCertification(editingCert.id, certData);
      if (!error) {
        toast.success('Certification updated!');
        closeDialog();
      } else {
        toast.error('Failed to update certification');
      }
    } else {
      const { error } = await addCertification(certData);
      if (!error) {
        toast.success('Certification added!');
        closeDialog();
      } else {
        toast.error('Failed to add certification');
      }
    }
  };

  const handleDelete = async (id: string) => {
    const error = await deleteCertification(id);
    if (!error) {
      toast.success('Certification deleted!');
    } else {
      toast.error('Failed to delete certification');
    }
  };

  const openEditDialog = (cert: Certification) => {
    setFormData({
      name: cert.name,
      organization: cert.organization,
      date: cert.date || '',
      verification_link: cert.verification_link || '',
      image_url: (cert as any).image_url || '',
      display_order: cert.display_order,
    });
    setEditingCert(cert);
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingCert(null);
    setFormData({ name: '', organization: '', date: '', verification_link: '', image_url: '', display_order: 0 });
  };

  // Get the raw image URL from certification
  const getRawImageUrl = (cert: Certification): string | null => {
    return (cert as any).image_url || null;
  };

  // Get thumbnail URL (handles Google Drive links)
  const getThumbnailUrl = (cert: Certification): string | null => {
    const rawUrl = getRawImageUrl(cert);
    if (!rawUrl) return null;
    
    if (isGoogleDriveUrl(rawUrl)) {
      return getGoogleDriveThumbnailUrl(rawUrl, 400);
    }
    return rawUrl;
  };

  // Get full image URL (handles Google Drive links)
  const getFullImageUrl = (cert: Certification): string | null => {
    const rawUrl = getRawImageUrl(cert);
    if (!rawUrl) return null;
    
    if (isGoogleDriveUrl(rawUrl)) {
      return getGoogleDriveDirectUrl(rawUrl);
    }
    return rawUrl;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return (
    <section id="certifications" className="min-h-screen bg-section-certifications py-24 lg:py-32 relative">
      <div className="orb orb-cyan w-64 h-64 top-40 right-20 opacity-15" />
      <div className="orb orb-pink w-56 h-56 bottom-20 left-10 opacity-20" />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 opacity-0 animate-fade-in">
          <span className="text-sm font-medium text-primary tracking-widest uppercase">
            Achievements
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            <span className="gradient-text-green-teal">Certifications</span>
          </h2>
        </div>

        {/* Admin Add Button */}
        {isAdmin && (
          <div className="flex justify-center mb-8">
            <Button onClick={() => setShowDialog(true)} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add Certification
            </Button>
          </div>
        )}

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sortedCerts.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              draggable={isAdmin}
              onDragStart={() => isAdmin && handleDragStart(cert.id)}
              onDragOver={(e) => isAdmin && handleDragOver(e, cert.id)}
              onDrop={() => isAdmin && handleDrop()}
              onDragEnd={() => setDraggingId(null)}
              className={`glass-card-hover p-6 group relative overflow-hidden border border-white/5 hover:border-primary/30 transition-all duration-500 ${
                isAdmin ? 'cursor-grab active:cursor-grabbing' : ''
              } ${draggingId === cert.id ? 'opacity-50 scale-95' : ''} ${
                draggingId && draggingId !== cert.id ? 'border-primary/20' : ''
              }`}
            >
              {/* Admin Drag Handle */}
              {isAdmin && (
                <div className="absolute top-2 left-2 z-10 p-1 rounded bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-4 h-4 text-primary" />
                </div>
              )}
              
              {/* Multicolor Gradient Border Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/0 via-orange-500/0 to-pink-500/0 group-hover:from-yellow-500/20 group-hover:via-orange-500/10 group-hover:to-pink-500/20 transition-all duration-500 pointer-events-none" />
              
              {/* Decorative Gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-yellow-500/10 via-orange-500/10 to-transparent rounded-bl-full" />
              
              {/* Certificate Image Preview */}
              {getThumbnailUrl(cert) ? (
                <div 
                  className="relative w-full h-32 mb-4 rounded-xl overflow-hidden cursor-pointer group/image"
                  onClick={() => setViewingCert(cert)}
                >
                  <img
                    src={getThumbnailUrl(cert)!}
                    alt={cert.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                    onError={(e) => {
                      // Fallback if thumbnail fails to load
                      const target = e.target as HTMLImageElement;
                      const fullUrl = getFullImageUrl(cert);
                      if (fullUrl && target.src !== fullUrl) {
                        target.src = fullUrl;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                    <span className="text-xs text-white/90 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Click to view
                    </span>
                  </div>
                  {/* Neon border on hover */}
                  <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover/image:border-primary/50 group-hover/image:shadow-[0_0_20px_rgba(0,255,255,0.3)] transition-all duration-300" />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                  <Award className="w-7 h-7 text-black" />
                </div>
              )}

              {/* Content */}
              <h3 className="text-xl font-display font-bold mb-2 gradient-text-cyan-purple">
                {cert.name}
              </h3>
              
              <p className="text-muted-foreground mb-3">
                {cert.organization}
              </p>

              {cert.date && (
                <p className="text-sm text-muted-foreground/70 mb-4">
                  {formatDate(cert.date)}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 mt-4">
                {/* View Certificate Button */}
                {getThumbnailUrl(cert) && (
                  <Button 
                    onClick={() => setViewingCert(cert)} 
                    size="sm" 
                    variant="outline"
                    className="border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                  >
                    <Eye className="w-3 h-3 mr-1" /> View Certificate
                  </Button>
                )}
                
                {/* Verification Link */}
                {cert.verification_link && (
                  <a
                    href={cert.verification_link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-secondary/30 text-secondary hover:bg-secondary/10 hover:border-secondary/50 transition-all duration-300"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" /> Verify
                    </Button>
                  </a>
                )}
              </div>

              {/* Admin Controls */}
              {isAdmin && (
                <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button onClick={() => openEditDialog(cert)} size="sm" className="admin-btn">
                    <Pencil className="w-3 h-3 mr-1" /> Edit
                  </Button>
                  <Button onClick={() => handleDelete(cert.id)} size="sm" className="admin-btn-danger">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </Button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Full Certificate View Modal */}
      <AnimatePresence>
        {viewingCert && (
          <Dialog open={!!viewingCert} onOpenChange={() => setViewingCert(null)}>
            <DialogContent className="max-w-4xl bg-black/95 border-white/10 backdrop-blur-xl p-0 overflow-hidden">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="relative"
              >
                {/* Header */}
                <div className="p-6 border-b border-white/10">
                  <DialogHeader>
                    <DialogTitle className="gradient-text-cyan-purple text-2xl font-display">
                      {viewingCert.name}
                    </DialogTitle>
                    <p className="text-muted-foreground mt-1">{viewingCert.organization}</p>
                  </DialogHeader>
                </div>
                
                {/* Certificate Image */}
                <div className="p-6">
                  {getFullImageUrl(viewingCert) && (
                    <motion.img
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.4 }}
                      src={getFullImageUrl(viewingCert)!}
                      alt={viewingCert.name}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-2xl border border-white/10"
                    />
                  )}
                </div>
                
                {/* Footer Actions */}
                <div className="p-6 border-t border-white/10 flex justify-between items-center">
                  {viewingCert.date && (
                    <p className="text-sm text-muted-foreground">
                      Issued: {formatDate(viewingCert.date)}
                    </p>
                  )}
                  <div className="flex gap-2">
                    {viewingCert.verification_link && (
                      <a
                        href={viewingCert.verification_link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                          <ExternalLink className="w-4 h-4 mr-2" /> Verify Certificate
                        </Button>
                      </a>
                    )}
                    <Button onClick={() => setViewingCert(null)} variant="outline">
                      <X className="w-4 h-4 mr-2" /> Close
                    </Button>
                  </div>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Add/Edit Dialog */}
      <Dialog open={showDialog} onOpenChange={closeDialog}>
        <DialogContent className="glass-card border-white/10">
          <DialogHeader>
            <DialogTitle className="gradient-text-cyan-purple">
              {editingCert ? 'Edit Certification' : 'Add New Certification'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label className="text-sm text-muted-foreground">Certification Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., AWS Solutions Architect"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Issuing Organization</label>
              <Input
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="e.g., Amazon Web Services"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="bg-white/5 border-white/10"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Verification Link (optional)</label>
              <Input
                value={formData.verification_link}
                onChange={(e) => setFormData({ ...formData, verification_link: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Certificate Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="bg-white/5 border-white/10"
                placeholder="Paste Google Drive link or direct image URL"
              />
              <p className="text-xs text-muted-foreground/60 mt-1 flex items-center gap-1">
                <ImageIcon className="w-3 h-3" /> Supports Google Drive links – thumbnail auto-generated
              </p>
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
                <Save className="w-4 h-4 mr-2" /> {editingCert ? 'Update' : 'Add'}
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

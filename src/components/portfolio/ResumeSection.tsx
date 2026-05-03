import { useState } from 'react';
import { useResume } from '@/hooks/useResume';
import { useAdmin } from '@/contexts/AdminContext';
import { FileText, Download, Eye, Pencil, Save, X, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

// Converts Google Drive link to direct download URL
function getGoogleDriveDownloadUrl(url: string | null): string | null {
  if (!url) return null;
  
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;
  
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) fileId = openMatch[1];
  
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) fileId = ucMatch[1];
  
  if (fileId) {
    return `https://drive.google.com/uc?export=download&id=${fileId}`;
  }
  
  return url;
}

// Converts Google Drive link to viewable URL
function getGoogleDriveViewUrl(url: string | null): string | null {
  if (!url) return null;
  
  // Extract file ID from various Google Drive URL formats
  let fileId: string | null = null;
  
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) fileId = openMatch[1];
  
  const ucMatch = url.match(/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) fileId = ucMatch[1];
  
  if (fileId) {
    return `https://drive.google.com/file/d/${fileId}/view`;
  }
  
  return url;
}

export default function ResumeSection() {
  const { resume, loading, updateResume } = useResume();
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState('');
  const [editedDriveLink, setEditedDriveLink] = useState('');

  if (loading) {
    return (
      <section id="resume" className="py-20 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse h-64 bg-muted/20 rounded-2xl" />
        </div>
      </section>
    );
  }

  const handleEdit = () => {
    setEditedSummary(resume?.summary || '');
    setEditedDriveLink(resume?.file_url || '');
    setIsEditing(true);
  };

  const handleSave = async () => {
    const error = await updateResume({ 
      summary: editedSummary,
      file_url: editedDriveLink || null,
    });
    if (error) {
      toast.error('Failed to update resume');
    } else {
      toast.success('Resume updated');
      setIsEditing(false);
    }
  };

  const handleViewResume = () => {
    const viewUrl = getGoogleDriveViewUrl(resume?.file_url);
    if (viewUrl) {
      window.open(viewUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No resume link available');
    }
  };

  const handleDownloadResume = () => {
    const downloadUrl = getGoogleDriveDownloadUrl(resume?.file_url);
    if (downloadUrl) {
      window.open(downloadUrl, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No resume link available');
    }
  };

  return (
    <section id="resume" className="py-20 px-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Resume
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive overview of my professional journey and expertise
          </p>
        </div>

        {/* Resume Card */}
        <div className="relative group">
          {/* Gradient border glow */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          
          {/* Main card */}
          <div className="relative bg-background/90 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-[0_0_40px_rgba(251,146,60,0.15)]">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Resume Icon */}
              <div className="flex-shrink-0">
                <div className="w-40 h-52 bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-rose-500/20 rounded-xl border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-rose-500/10" />
                  <FileText className="w-16 h-16 text-amber-400/80" />
                  {resume?.file_url && (
                    <div className="absolute bottom-2 left-2 right-2 text-xs text-center text-muted-foreground truncate">
                      Resume Available
                    </div>
                  )}
                </div>
              </div>

              {/* Resume Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-2xl font-semibold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                    Professional Resume
                  </h3>
                  
                  {isAdmin && !isEditing && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleEdit}
                      className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {/* Summary / Edit Form */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Professional Summary</label>
                      <Textarea
                        value={editedSummary}
                        onChange={(e) => setEditedSummary(e.target.value)}
                        className="min-h-[100px] bg-background/50 border-amber-500/30 focus:border-amber-500/50"
                        placeholder="Enter a professional summary..."
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <Link2 className="w-3 h-3" /> Google Drive Resume Link
                      </label>
                      <Input
                        value={editedDriveLink}
                        onChange={(e) => setEditedDriveLink(e.target.value)}
                        className="bg-background/50 border-amber-500/30 focus:border-amber-500/50"
                        placeholder="Paste your Google Drive resume link..."
                      />
                      <p className="text-xs text-muted-foreground/60 mt-1">
                        Paste a Google Drive shareable link (make sure sharing is set to "Anyone with the link")
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {resume?.summary || 'No summary available.'}
                  </p>
                )}

                {/* Action Buttons */}
                {!isEditing && (
                  <div className="flex flex-wrap gap-3 mt-6">
                    <Button
                      onClick={handleViewResume}
                      disabled={!resume?.file_url}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-[0_0_20px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_rgba(251,146,60,0.5)] transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDownloadResume}
                      disabled={!resume?.file_url}
                      className="border-amber-500/30 hover:border-amber-500/50 hover:bg-amber-500/10 text-amber-400"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                )}

                {/* Last Updated */}
                {resume?.updated_at && (
                  <p className="text-xs text-muted-foreground/60 mt-4">
                    Last updated: {new Date(resume.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

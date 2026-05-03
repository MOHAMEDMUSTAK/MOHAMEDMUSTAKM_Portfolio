import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Resume {
  id: string;
  file_url: string | null;
  preview_url: string | null;
  summary: string | null;
  file_name: string | null;
  updated_at: string;
}

export function useResume() {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchResume = async () => {
    const { data, error } = await supabase
      .from('resume')
      .select('*')
      .limit(1)
      .single();
    
    if (!error && data) {
      setResume(data as Resume);
    }
    setLoading(false);
  };

  const updateResume = async (updates: Partial<Resume>) => {
    if (!resume) return;
    const { error } = await supabase
      .from('resume')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', resume.id);
    
    if (!error) {
      setResume({ ...resume, ...updates, updated_at: new Date().toISOString() });
    }
    return error;
  };

  useEffect(() => {
    fetchResume();
  }, []);

  return { resume, loading, updateResume, refetch: fetchResume };
}

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  name: string;
  title: string;
  tagline: string | null;
  bio: string | null;
  image_url: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  color: string | null;
  display_order: number;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  technologies: string[];
  github_link: string | null;
  image_url: string | null;
  featured: boolean | null;
  display_order: number;
}

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string | null;
  verification_link: string | null;
  display_order: number;
}

export interface Contact {
  id: string;
  type: string;
  value: string;
  icon: string | null;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    const { data, error } = await supabase.from('profile').select('*').limit(1).single();
    if (!error && data) {
      setProfile(data);
    }
    setLoading(false);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile) return;
    const { error } = await supabase.from('profile').update(updates).eq('id', profile.id);
    if (!error) {
      setProfile({ ...profile, ...updates });
    }
    return error;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, updateProfile, refetch: fetchProfile };
}

export function useSkills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSkills = async () => {
    const { data, error } = await supabase.from('skills').select('*').order('display_order').order('category');
    if (!error && data) {
      setSkills(data);
    }
    setLoading(false);
  };

  const addSkill = async (skill: Omit<Skill, 'id'> & { display_order?: number }) => {
    // Use provided display_order or calculate from max
    const categorySkills = skills.filter(s => s.category === skill.category);
    const maxOrder = categorySkills.length > 0 ? Math.max(...categorySkills.map(s => s.display_order)) : -1;
    const displayOrder = skill.display_order !== undefined ? skill.display_order : maxOrder + 1;
    
    const { data, error } = await supabase.from('skills').insert({ ...skill, display_order: displayOrder }).select().single();
    if (!error && data) {
      setSkills([...skills, data]);
    }
    return { data, error };
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    const { error } = await supabase.from('skills').update(updates).eq('id', id);
    if (!error) {
      setSkills(skills.map(s => s.id === id ? { ...s, ...updates } : s));
    }
    return error;
  };

  const deleteSkill = async (id: string) => {
    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      setSkills(skills.filter(s => s.id !== id));
    }
    return error;
  };

  const reorderSkill = async (id: string, direction: 'up' | 'down') => {
    const skill = skills.find(s => s.id === id);
    if (!skill) return;

    // Get skills in the same category, sorted by display_order
    const categorySkills = skills
      .filter(s => s.category === skill.category)
      .sort((a, b) => a.display_order - b.display_order);
    
    const currentIndex = categorySkills.findIndex(s => s.id === id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= categorySkills.length) return;

    const swapSkill = categorySkills[swapIndex];
    const currentOrder = skill.display_order;
    const swapOrder = swapSkill.display_order;

    // Update both in database
    await supabase.from('skills').update({ display_order: swapOrder }).eq('id', skill.id);
    await supabase.from('skills').update({ display_order: currentOrder }).eq('id', swapSkill.id);

    // Update local state
    setSkills(skills.map(s => {
      if (s.id === skill.id) return { ...s, display_order: swapOrder };
      if (s.id === swapSkill.id) return { ...s, display_order: currentOrder };
      return s;
    }));
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  return { skills, loading, addSkill, updateSkill, deleteSkill, reorderSkill, refetch: fetchSkills };
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data, error } = await supabase.from('projects').select('*').order('display_order');
    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const addProject = async (project: Omit<Project, 'id'> & { display_order?: number }) => {
    const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.display_order)) : -1;
    const displayOrder = project.display_order !== undefined ? project.display_order : maxOrder + 1;
    const { data, error } = await supabase.from('projects').insert({ ...project, display_order: displayOrder }).select().single();
    if (!error && data) {
      setProjects([...projects, data]);
    }
    return { data, error };
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { error } = await supabase.from('projects').update(updates).eq('id', id);
    if (!error) {
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
    }
    return error;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
    return error;
  };

  const reorderProject = async (id: string, direction: 'up' | 'down') => {
    const sortedProjects = [...projects].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedProjects.findIndex(p => p.id === id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= sortedProjects.length) return;

    const currentProject = sortedProjects[currentIndex];
    const swapProject = sortedProjects[swapIndex];
    const currentOrder = currentProject.display_order;
    const swapOrder = swapProject.display_order;

    await supabase.from('projects').update({ display_order: swapOrder }).eq('id', currentProject.id);
    await supabase.from('projects').update({ display_order: currentOrder }).eq('id', swapProject.id);

    setProjects(projects.map(p => {
      if (p.id === currentProject.id) return { ...p, display_order: swapOrder };
      if (p.id === swapProject.id) return { ...p, display_order: currentOrder };
      return p;
    }));
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return { projects, loading, addProject, updateProject, deleteProject, reorderProject, refetch: fetchProjects };
}

export function useCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCertifications = async () => {
    const { data, error } = await supabase.from('certifications').select('*').order('display_order');
    if (!error && data) {
      setCertifications(data);
    }
    setLoading(false);
  };

  const addCertification = async (cert: Omit<Certification, 'id'> & { display_order?: number; image_url?: string | null }) => {
    const maxOrder = certifications.length > 0 ? Math.max(...certifications.map(c => c.display_order)) : -1;
    const displayOrder = cert.display_order !== undefined ? cert.display_order : maxOrder + 1;
    const { data, error } = await supabase.from('certifications').insert({ ...cert, display_order: displayOrder }).select().single();
    if (!error && data) {
      setCertifications([...certifications, data]);
    }
    return { data, error };
  };

  const updateCertification = async (id: string, updates: Partial<Certification>) => {
    const { error } = await supabase.from('certifications').update(updates).eq('id', id);
    if (!error) {
      setCertifications(certifications.map(c => c.id === id ? { ...c, ...updates } : c));
    }
    return error;
  };

  const deleteCertification = async (id: string) => {
    const { error } = await supabase.from('certifications').delete().eq('id', id);
    if (!error) {
      setCertifications(certifications.filter(c => c.id !== id));
    }
    return error;
  };

  const reorderCertification = async (id: string, direction: 'up' | 'down') => {
    const sortedCerts = [...certifications].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedCerts.findIndex(c => c.id === id);
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    if (swapIndex < 0 || swapIndex >= sortedCerts.length) return;

    const currentCert = sortedCerts[currentIndex];
    const swapCert = sortedCerts[swapIndex];
    const currentOrder = currentCert.display_order;
    const swapOrder = swapCert.display_order;

    await supabase.from('certifications').update({ display_order: swapOrder }).eq('id', currentCert.id);
    await supabase.from('certifications').update({ display_order: currentOrder }).eq('id', swapCert.id);

    setCertifications(certifications.map(c => {
      if (c.id === currentCert.id) return { ...c, display_order: swapOrder };
      if (c.id === swapCert.id) return { ...c, display_order: currentOrder };
      return c;
    }));
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  return { certifications, loading, addCertification, updateCertification, deleteCertification, reorderCertification, refetch: fetchCertifications };
}

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    const { data, error } = await supabase.from('contact').select('*');
    if (!error && data) {
      setContacts(data);
    }
    setLoading(false);
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    const { error } = await supabase.from('contact').update(updates).eq('id', id);
    if (!error) {
      setContacts(contacts.map(c => c.id === id ? { ...c, ...updates } : c));
    }
    return error;
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, updateContact, refetch: fetchContacts };
}

// Stats interface and hook
export interface Stat {
  id: string;
  value: string;
  label: string;
  display_order: number;
}

export function useStats() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    const { data, error } = await supabase.from('stats').select('*').order('display_order');
    if (!error && data) {
      setStats(data);
    }
    setLoading(false);
  };

  const updateStat = async (id: string, updates: Partial<Stat>) => {
    const { error } = await supabase.from('stats').update(updates).eq('id', id);
    if (!error) {
      setStats(stats.map(s => s.id === id ? { ...s, ...updates } : s));
    }
    return error;
  };

  const addStat = async (stat: Omit<Stat, 'id'>) => {
    const { data, error } = await supabase.from('stats').insert(stat).select().single();
    if (!error && data) {
      setStats([...stats, data]);
    }
    return { data, error };
  };

  const deleteStat = async (id: string) => {
    const { error } = await supabase.from('stats').delete().eq('id', id);
    if (!error) {
      setStats(stats.filter(s => s.id !== id));
    }
    return error;
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, updateStat, addStat, deleteStat, refetch: fetchStats };
}

// Timeline interface and hook
export interface TimelineMilestone {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  gradient: string | null;
  display_order: number;
}

export function useTimeline() {
  const [milestones, setMilestones] = useState<TimelineMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMilestones = async () => {
    const { data, error } = await supabase.from('timeline').select('*').order('display_order');
    if (!error && data) {
      setMilestones(data);
    }
    setLoading(false);
  };

  const addMilestone = async (milestone: Omit<TimelineMilestone, 'id'>) => {
    const { data, error } = await supabase.from('timeline').insert(milestone).select().single();
    if (!error && data) {
      setMilestones([...milestones, data]);
    }
    return { data, error };
  };

  const updateMilestone = async (id: string, updates: Partial<TimelineMilestone>) => {
    const { error } = await supabase.from('timeline').update(updates).eq('id', id);
    if (!error) {
      setMilestones(milestones.map(m => m.id === id ? { ...m, ...updates } : m));
    }
    return error;
  };

  const deleteMilestone = async (id: string) => {
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (!error) {
      setMilestones(milestones.filter(m => m.id !== id));
    }
    return error;
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  return { milestones, loading, addMilestone, updateMilestone, deleteMilestone, refetch: fetchMilestones };
}

// AI Assistant Facts interface and hook
export interface AIFact {
  id: string;
  icon: string | null;
  label: string;
  text: string;
  display_order: number;
}

export function useAIFacts() {
  const [facts, setFacts] = useState<AIFact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFacts = async () => {
    const { data, error } = await supabase.from('ai_assistant_facts').select('*').order('display_order');
    if (!error && data) {
      setFacts(data);
    }
    setLoading(false);
  };

  const addFact = async (fact: Omit<AIFact, 'id'>) => {
    const { data, error } = await supabase.from('ai_assistant_facts').insert(fact).select().single();
    if (!error && data) {
      setFacts([...facts, data]);
    }
    return { data, error };
  };

  const updateFact = async (id: string, updates: Partial<AIFact>) => {
    const { error } = await supabase.from('ai_assistant_facts').update(updates).eq('id', id);
    if (!error) {
      setFacts(facts.map(f => f.id === id ? { ...f, ...updates } : f));
    }
    return error;
  };

  const deleteFact = async (id: string) => {
    const { error } = await supabase.from('ai_assistant_facts').delete().eq('id', id);
    if (!error) {
      setFacts(facts.filter(f => f.id !== id));
    }
    return error;
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  return { facts, loading, addFact, updateFact, deleteFact, refetch: fetchFacts };
}

// Why Hire Me interface and hook
export interface WhyHireMeReason {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  gradient: string | null;
  display_order: number;
}

export function useWhyHireMe() {
  const [reasons, setReasons] = useState<WhyHireMeReason[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReasons = async () => {
    const { data, error } = await supabase.from('why_hire_me').select('*').order('display_order');
    if (!error && data) {
      setReasons(data);
    }
    setLoading(false);
  };

  const addReason = async (reason: Omit<WhyHireMeReason, 'id'>) => {
    const { data, error } = await supabase.from('why_hire_me').insert(reason).select().single();
    if (!error && data) {
      setReasons([...reasons, data]);
    }
    return { data, error };
  };

  const updateReason = async (id: string, updates: Partial<WhyHireMeReason>) => {
    const { error } = await supabase.from('why_hire_me').update(updates).eq('id', id);
    if (!error) {
      setReasons(reasons.map(r => r.id === id ? { ...r, ...updates } : r));
    }
    return error;
  };

  const deleteReason = async (id: string) => {
    const { error } = await supabase.from('why_hire_me').delete().eq('id', id);
    if (!error) {
      setReasons(reasons.filter(r => r.id !== id));
    }
    return error;
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  return { reasons, loading, addReason, updateReason, deleteReason, refetch: fetchReasons };
}

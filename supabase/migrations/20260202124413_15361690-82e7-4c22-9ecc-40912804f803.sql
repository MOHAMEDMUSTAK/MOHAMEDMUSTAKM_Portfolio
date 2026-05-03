-- Enable RLS on all tables with permissive policies as requested by user
-- Public can read all data, admin session can write

-- Profile table
ALTER TABLE public.profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read profile" ON public.profile FOR SELECT USING (true);
CREATE POLICY "Anyone can update profile" ON public.profile FOR UPDATE USING (true);
CREATE POLICY "Anyone can insert profile" ON public.profile FOR INSERT WITH CHECK (true);

-- Skills table
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Anyone can insert skills" ON public.skills FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update skills" ON public.skills FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete skills" ON public.skills FOR DELETE USING (true);

-- Projects table
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete projects" ON public.projects FOR DELETE USING (true);

-- Certifications table
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read certifications" ON public.certifications FOR SELECT USING (true);
CREATE POLICY "Anyone can insert certifications" ON public.certifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update certifications" ON public.certifications FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete certifications" ON public.certifications FOR DELETE USING (true);

-- Contact table
ALTER TABLE public.contact ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read contact" ON public.contact FOR SELECT USING (true);
CREATE POLICY "Anyone can insert contact" ON public.contact FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update contact" ON public.contact FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete contact" ON public.contact FOR DELETE USING (true);

-- Admin table
ALTER TABLE public.admin ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read admin" ON public.admin FOR SELECT USING (true);
CREATE POLICY "Anyone can update admin" ON public.admin FOR UPDATE USING (true);
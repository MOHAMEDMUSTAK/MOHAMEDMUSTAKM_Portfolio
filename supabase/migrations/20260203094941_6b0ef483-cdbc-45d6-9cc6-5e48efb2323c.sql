-- Create stats table for editable statistic boxes
CREATE TABLE public.stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '0',
  label TEXT NOT NULL DEFAULT 'Label',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.stats ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (portfolio is public)
CREATE POLICY "Public can read stats" ON public.stats FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stats" ON public.stats FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update stats" ON public.stats FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete stats" ON public.stats FOR DELETE USING (true);

-- Insert default stats
INSERT INTO public.stats (value, label, display_order) VALUES
  ('5+', 'Years Experience', 1),
  ('50+', 'Projects Completed', 2),
  ('30+', 'Happy Clients', 3),
  ('10+', 'Certifications', 4);
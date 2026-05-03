
CREATE TABLE public.why_hire_me (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Brain',
  gradient TEXT DEFAULT 'from-cyan-400 to-blue-500',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.why_hire_me ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read why_hire_me" ON public.why_hire_me FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert why_hire_me" ON public.why_hire_me FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update why_hire_me" ON public.why_hire_me FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete why_hire_me" ON public.why_hire_me FOR DELETE TO public USING (true);

INSERT INTO public.why_hire_me (title, description, icon, gradient, display_order) VALUES
('AI-First Mindset', 'Deep understanding of machine learning, neural networks, and modern AI frameworks.', 'Brain', 'from-cyan-400 to-blue-500', 0),
('Full-Stack Capable', 'End-to-end development from model training to production-ready web applications.', 'Zap', 'from-purple-400 to-pink-500', 1),
('Results-Driven', 'Focused on delivering measurable impact through clean, efficient, and scalable code.', 'Target', 'from-orange-400 to-rose-500', 2),
('Fast Learner', 'Quickly adapts to new technologies and brings innovative solutions to complex problems.', 'Lightbulb', 'from-emerald-400 to-teal-500', 3);

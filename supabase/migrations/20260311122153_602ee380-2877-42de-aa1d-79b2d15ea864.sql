
-- Timeline milestones table
CREATE TABLE public.timeline (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Code',
  gradient TEXT DEFAULT 'from-cyan-400 to-blue-500',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read timeline" ON public.timeline FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert timeline" ON public.timeline FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update timeline" ON public.timeline FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete timeline" ON public.timeline FOR DELETE TO public USING (true);

-- AI Assistant quick facts table
CREATE TABLE public.ai_assistant_facts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT DEFAULT 'Brain',
  label TEXT NOT NULL,
  text TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_assistant_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read ai_assistant_facts" ON public.ai_assistant_facts FOR SELECT TO public USING (true);
CREATE POLICY "Anyone can insert ai_assistant_facts" ON public.ai_assistant_facts FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can update ai_assistant_facts" ON public.ai_assistant_facts FOR UPDATE TO public USING (true);
CREATE POLICY "Anyone can delete ai_assistant_facts" ON public.ai_assistant_facts FOR DELETE TO public USING (true);

-- Seed timeline data
INSERT INTO public.timeline (title, description, icon, gradient, display_order) VALUES
('Started Learning Python', 'Began the journey into programming and computational thinking with Python.', 'Code', 'from-cyan-400 to-blue-500', 0),
('Built Machine Learning Projects', 'Developed predictive models and data analysis pipelines using scikit-learn and pandas.', 'Brain', 'from-purple-400 to-pink-500', 1),
('Developed Deep Learning Models', 'Explored neural networks, CNNs, and RNNs using TensorFlow and PyTorch.', 'Eye', 'from-pink-400 to-rose-500', 2),
('Created Bone Fracture Detection System', 'Built an AI-powered medical imaging system for automated fracture detection using computer vision.', 'Bone', 'from-orange-400 to-amber-500', 3),
('Built AI Web Applications', 'Combined full-stack development with AI to create intelligent, production-ready applications.', 'Globe', 'from-green-400 to-teal-500', 4);

-- Seed AI assistant facts
INSERT INTO public.ai_assistant_facts (icon, label, text, display_order) VALUES
('Brain', 'Focus', 'AI & Machine Learning', 0),
('Code2', 'Stack', 'Python, React, TypeScript', 1),
('Rocket', 'Goal', 'Building intelligent systems', 2),
('Sparkles', 'Status', 'Open to opportunities', 3);

-- Add display_order column to skills table
ALTER TABLE public.skills 
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Add display_order column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Add display_order column to certifications table
ALTER TABLE public.certifications 
ADD COLUMN IF NOT EXISTS display_order integer NOT NULL DEFAULT 0;

-- Create indexes for ordering
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON public.skills(display_order);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_certifications_display_order ON public.certifications(display_order);
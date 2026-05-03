-- Create resume table to store resume metadata
CREATE TABLE public.resume (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_url TEXT,
  preview_url TEXT,
  summary TEXT DEFAULT 'Experienced professional with a proven track record of delivering high-quality solutions.',
  file_name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.resume ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read resume" 
ON public.resume 
FOR SELECT 
USING (true);

-- Create policies for admin updates
CREATE POLICY "Anyone can update resume" 
ON public.resume 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can insert resume" 
ON public.resume 
FOR INSERT 
WITH CHECK (true);

-- Insert initial resume record
INSERT INTO public.resume (summary) VALUES ('Experienced professional with a proven track record of delivering innovative solutions and driving business success. This resume highlights key achievements, technical expertise, and professional experience.');
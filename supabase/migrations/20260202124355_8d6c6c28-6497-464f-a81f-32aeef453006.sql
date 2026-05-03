-- Create profile table
CREATE TABLE public.profile (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Full Stack Developer',
  tagline TEXT DEFAULT 'Building the future, one line of code at a time.',
  bio TEXT DEFAULT 'Passionate developer with expertise in modern web technologies.',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create skills table
CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  proficiency INTEGER NOT NULL DEFAULT 80 CHECK (proficiency >= 0 AND proficiency <= 100),
  icon TEXT,
  color TEXT DEFAULT 'cyan',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  github_link TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certifications table
CREATE TABLE public.certifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  date DATE,
  verification_link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact table
CREATE TABLE public.contact (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  value TEXT NOT NULL,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create admin table with auto-generated credentials
CREATE TABLE public.admin (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- No RLS on these tables as per user request - admin has full access, public can read
-- Insert default profile
INSERT INTO public.profile (name, title, tagline, bio) VALUES (
  'John Doe',
  'Senior Full Stack Developer',
  'Crafting digital experiences that inspire and innovate.',
  'I am a passionate full-stack developer with 5+ years of experience building modern web applications. I specialize in React, TypeScript, Node.js, and cloud technologies. My mission is to create elegant, scalable solutions that make a difference.'
);

-- Insert default skills
INSERT INTO public.skills (name, category, proficiency, color) VALUES
  ('React', 'Frontend', 95, 'cyan'),
  ('TypeScript', 'Frontend', 90, 'blue'),
  ('Next.js', 'Frontend', 85, 'purple'),
  ('Tailwind CSS', 'Frontend', 92, 'teal'),
  ('Node.js', 'Backend', 88, 'green'),
  ('PostgreSQL', 'Backend', 82, 'orange'),
  ('Python', 'Backend', 75, 'yellow'),
  ('AWS', 'Cloud', 80, 'amber'),
  ('Docker', 'DevOps', 78, 'blue'),
  ('Git', 'Tools', 95, 'pink');

-- Insert default projects
INSERT INTO public.projects (name, description, technologies, github_link, featured) VALUES
  ('E-Commerce Platform', 'A full-featured e-commerce solution with real-time inventory, payment processing, and admin dashboard.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Stripe'], 'https://github.com/example/ecommerce', true),
  ('AI Chat Application', 'Intelligent conversational AI powered by GPT with context awareness and multi-language support.', ARRAY['Next.js', 'OpenAI', 'Tailwind', 'TypeScript'], 'https://github.com/example/ai-chat', true),
  ('Task Management System', 'Collaborative project management tool with real-time updates and team analytics.', ARRAY['React', 'Firebase', 'Material UI'], 'https://github.com/example/taskmanager', false);

-- Insert default certifications
INSERT INTO public.certifications (name, organization, date, verification_link) VALUES
  ('AWS Solutions Architect', 'Amazon Web Services', '2024-01-15', 'https://aws.amazon.com/verify'),
  ('Meta Frontend Developer', 'Meta', '2023-08-20', 'https://coursera.org/verify'),
  ('Google Cloud Professional', 'Google', '2023-05-10', 'https://cloud.google.com/verify');

-- Insert default contact info
INSERT INTO public.contact (type, value, icon) VALUES
  ('email', 'john.doe@example.com', 'Mail'),
  ('phone', '+1 (555) 123-4567', 'Phone'),
  ('linkedin', 'linkedin.com/in/johndoe', 'Linkedin'),
  ('github', 'github.com/johndoe', 'Github');

-- Insert default admin (password: admin123 - hashed)
INSERT INTO public.admin (username, password_hash) VALUES
  ('admin', '$2a$10$rQZ8qVpLrwxZ0wQZqVpLrOQZ8qVpLrwxZ0wQZqVpLrwxZ0wQZqVp');

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', true);

-- Create storage policy for public read access
CREATE POLICY "Public can view portfolio images" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio-images');

-- Create storage policy for uploads (no auth required as per user request)
CREATE POLICY "Anyone can upload portfolio images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio-images');

-- Create storage policy for updates
CREATE POLICY "Anyone can update portfolio images" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio-images');

-- Create storage policy for deletes
CREATE POLICY "Anyone can delete portfolio images" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio-images');
-- Add image_url column to certifications table for certificate image previews
ALTER TABLE public.certifications ADD COLUMN IF NOT EXISTS image_url TEXT;
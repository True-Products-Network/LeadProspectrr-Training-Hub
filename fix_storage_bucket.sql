-- Create the storage bucket for training resources
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-resources', 'training-resources', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Allow public read access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'training-resources');

CREATE POLICY "Allow admin insert" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'training-resources' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow admin delete" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'training-resources' 
  AND auth.role() = 'authenticated'
);

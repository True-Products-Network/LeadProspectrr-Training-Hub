-- Simple bucket creation
INSERT INTO storage.buckets (id, name, public)
VALUES ('training-resources', 'training-resources', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access
CREATE POLICY "Public Access"
ON storage.objects FOR ALL
USING (bucket_id = 'training-resources');

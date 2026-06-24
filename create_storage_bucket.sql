-- Create the storage bucket for training resources
-- First check if bucket exists, if not create it
DO $$
BEGIN
    -- Insert bucket if it doesn't exist
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
        'training-resources', 
        'training-resources', 
        true,
        52428800, -- 50MB limit
        ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'image/gif',
            'video/mp4',
            'video/quicktime',
            'text/plain',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
    )
    ON CONFLICT (id) DO UPDATE 
    SET public = true, 
        file_size_limit = 52428800,
        allowed_mime_types = ARRAY[
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/png',
            'image/jpeg',
            'image/gif',
            'video/mp4',
            'video/quicktime',
            'text/plain',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
END $$;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin insert" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow public downloads" ON storage.objects;

-- Create policy for public read access (for downloads)
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
USING (bucket_id = 'training-resources');

-- Create policy for authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'training-resources');

-- Create policy for authenticated deletes
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'training-resources');

-- Verify bucket was created
SELECT * FROM storage.buckets WHERE id = 'training-resources';

-- Broaden visibility: allow all authenticated users to view active doctors
-- Keeps existing admin/doctor/patient policies intact

-- Create policy for authenticated users to select active doctors
CREATE POLICY "Authenticated can view active doctors"
ON public.doctors
FOR SELECT
TO authenticated
USING (is_active = true);
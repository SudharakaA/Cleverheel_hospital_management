-- Remove the patient role from the admin user to avoid role conflicts
DELETE FROM user_roles 
WHERE user_id = (
  SELECT id FROM profiles WHERE email = 'admin@cleverheal.com'
) AND role = 'patient';
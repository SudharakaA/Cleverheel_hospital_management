-- Create specializations enum for doctors
CREATE TYPE public.doctor_specialization AS ENUM (
  'cardiology',
  'dermatology', 
  'orthopedics',
  'pediatrics',
  'psychiatry',
  'gynecology',
  'neurology',
  'oncology',
  'ophthalmology',
  'ent',
  'general_medicine',
  'surgery'
);

-- Create appointment status enum
CREATE TYPE public.appointment_status AS ENUM (
  'scheduled',
  'completed',
  'cancelled',
  'no_show'
);

-- Create doctors table
CREATE TABLE public.doctors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  specialization doctor_specialization NOT NULL,
  qualifications TEXT NOT NULL,
  experience_years INTEGER NOT NULL DEFAULT 0,
  consultation_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  available_days TEXT[] NOT NULL DEFAULT '{}',
  available_hours TEXT NOT NULL DEFAULT '09:00-17:00',
  symptoms TEXT[] NOT NULL DEFAULT '{}',
  phone TEXT,
  email TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create patients table  
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_history TEXT,
  allergies TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  symptoms TEXT NOT NULL,
  status appointment_status NOT NULL DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for doctors table
CREATE POLICY "Doctors can view their own profile" 
ON public.doctors 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all doctors" 
ON public.doctors 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Patients can view active doctors" 
ON public.doctors 
FOR SELECT 
USING (is_active = true AND has_role(auth.uid(), 'patient'::app_role));

CREATE POLICY "Admins can insert doctors" 
ON public.doctors 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update doctors" 
ON public.doctors 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Doctors can update their own profile" 
ON public.doctors 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for patients table
CREATE POLICY "Patients can view their own profile" 
ON public.patients 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all patients" 
ON public.patients 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Doctors can view their patients" 
ON public.patients 
FOR SELECT 
USING (has_role(auth.uid(), 'doctor'::app_role));

CREATE POLICY "Patients can insert their own profile" 
ON public.patients 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can insert patients" 
ON public.patients 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Patients can update their own profile" 
ON public.patients 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Admins can update patients" 
ON public.patients 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for appointments table
CREATE POLICY "Patients can view their own appointments" 
ON public.appointments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.patients 
  WHERE patients.id = appointments.patient_id 
  AND patients.user_id = auth.uid()
));

CREATE POLICY "Doctors can view their appointments" 
ON public.appointments 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.doctors 
  WHERE doctors.id = appointments.doctor_id 
  AND doctors.user_id = auth.uid()
));

CREATE POLICY "Admins can view all appointments" 
ON public.appointments 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Patients can create appointments" 
ON public.appointments 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.patients 
  WHERE patients.id = appointments.patient_id 
  AND patients.user_id = auth.uid()
));

CREATE POLICY "Patients can update their own appointments" 
ON public.appointments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.patients 
  WHERE patients.id = appointments.patient_id 
  AND patients.user_id = auth.uid()
));

CREATE POLICY "Doctors can update their appointments" 
ON public.appointments 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.doctors 
  WHERE doctors.id = appointments.doctor_id 
  AND doctors.user_id = auth.uid()
));

CREATE POLICY "Admins can update all appointments" 
ON public.appointments 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctors_updated_at
  BEFORE UPDATE ON public.doctors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample doctors data
INSERT INTO public.profiles (id, email, first_name, last_name) VALUES
  ('11111111-1111-1111-1111-111111111111', 'dr.smith@cleverheal.com', 'John', 'Smith'),
  ('22222222-2222-2222-2222-222222222222', 'dr.johnson@cleverheal.com', 'Sarah', 'Johnson'),
  ('33333333-3333-3333-3333-333333333333', 'dr.williams@cleverheal.com', 'Michael', 'Williams'),
  ('44444444-4444-4444-4444-444444444444', 'dr.brown@cleverheal.com', 'Emily', 'Brown'),
  ('55555555-5555-5555-5555-555555555555', 'dr.davis@cleverheal.com', 'David', 'Davis'),
  ('66666666-6666-6666-6666-666666666666', 'dr.miller@cleverheal.com', 'Lisa', 'Miller'),
  ('77777777-7777-7777-7777-777777777777', 'dr.wilson@cleverheal.com', 'Robert', 'Wilson'),
  ('88888888-8888-8888-8888-888888888888', 'dr.moore@cleverheal.com', 'Jennifer', 'Moore');

-- Insert user roles for doctors
INSERT INTO public.user_roles (user_id, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'doctor'),
  ('22222222-2222-2222-2222-222222222222', 'doctor'),
  ('33333333-3333-3333-3333-333333333333', 'doctor'),
  ('44444444-4444-4444-4444-444444444444', 'doctor'),
  ('55555555-5555-5555-5555-555555555555', 'doctor'),
  ('66666666-6666-6666-6666-666666666666', 'doctor'),
  ('77777777-7777-7777-7777-777777777777', 'doctor'),
  ('88888888-8888-8888-8888-888888888888', 'doctor');

-- Insert doctors data
INSERT INTO public.doctors (user_id, full_name, specialization, qualifications, experience_years, consultation_fee, available_days, symptoms, phone, email) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Dr. John Smith', 'cardiology', 'MD Cardiology, MBBS', 15, 150.00, ARRAY['monday', 'tuesday', 'wednesday', 'friday'], ARRAY['chest pain', 'heart palpitations', 'shortness of breath', 'high blood pressure'], '+1-555-0101', 'dr.smith@cleverheal.com'),
  ('22222222-2222-2222-2222-222222222222', 'Dr. Sarah Johnson', 'dermatology', 'MD Dermatology, MBBS', 12, 120.00, ARRAY['monday', 'wednesday', 'thursday', 'friday'], ARRAY['skin rash', 'acne', 'skin infection', 'eczema', 'psoriasis'], '+1-555-0102', 'dr.johnson@cleverheal.com'),
  ('33333333-3333-3333-3333-333333333333', 'Dr. Michael Williams', 'orthopedics', 'MS Orthopedics, MBBS', 18, 180.00, ARRAY['tuesday', 'wednesday', 'thursday', 'saturday'], ARRAY['bone pain', 'joint pain', 'fracture', 'arthritis', 'back pain'], '+1-555-0103', 'dr.williams@cleverheal.com'),
  ('44444444-4444-4444-4444-444444444444', 'Dr. Emily Brown', 'pediatrics', 'MD Pediatrics, MBBS', 10, 100.00, ARRAY['monday', 'tuesday', 'thursday', 'friday'], ARRAY['fever in children', 'cough in children', 'stomach pain in children', 'vaccination'], '+1-555-0104', 'dr.brown@cleverheal.com'),
  ('55555555-5555-5555-5555-555555555555', 'Dr. David Davis', 'neurology', 'DM Neurology, MD, MBBS', 20, 200.00, ARRAY['monday', 'wednesday', 'friday'], ARRAY['headache', 'migraine', 'seizure', 'memory loss', 'dizziness'], '+1-555-0105', 'dr.davis@cleverheal.com'),
  ('66666666-6666-6666-6666-666666666666', 'Dr. Lisa Miller', 'gynecology', 'MD Gynecology, MBBS', 14, 130.00, ARRAY['tuesday', 'wednesday', 'thursday', 'saturday'], ARRAY['menstrual problems', 'pregnancy care', 'pelvic pain', 'fertility issues'], '+1-555-0106', 'dr.miller@cleverheal.com'),
  ('77777777-7777-7777-7777-777777777777', 'Dr. Robert Wilson', 'general_medicine', 'MBBS, MD Internal Medicine', 16, 80.00, ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday'], ARRAY['fever', 'cold', 'cough', 'stomach pain', 'diabetes', 'hypertension'], '+1-555-0107', 'dr.wilson@cleverheal.com'),
  ('88888888-8888-8888-8888-888888888888', 'Dr. Jennifer Moore', 'ophthalmology', 'MS Ophthalmology, MBBS', 11, 140.00, ARRAY['monday', 'wednesday', 'friday', 'saturday'], ARRAY['eye pain', 'blurred vision', 'eye infection', 'cataract', 'glaucoma'], '+1-555-0108', 'dr.moore@cleverheal.com');
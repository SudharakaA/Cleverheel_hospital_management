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

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
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
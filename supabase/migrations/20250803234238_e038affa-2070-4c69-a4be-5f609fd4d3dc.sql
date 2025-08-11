-- Add birthdate and gender fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN birthdate DATE,
ADD COLUMN gender TEXT;
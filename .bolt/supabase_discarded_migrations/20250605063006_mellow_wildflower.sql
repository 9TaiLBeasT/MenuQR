/*
  # Fix User Settings RLS Policies

  1. Changes
    - Add INSERT policy for user_settings table
    - Fix user_settings table primary key reference
    - Update trigger function to handle user settings creation

  2. Security
    - Enable RLS on user_settings table
    - Add policy for authenticated users to insert their own settings
*/

-- First, drop the existing primary key constraint if it references profiles
ALTER TABLE user_settings
DROP CONSTRAINT IF EXISTS user_settings_pkey CASCADE;

-- Update the table structure to use its own id
ALTER TABLE user_settings
ALTER COLUMN id SET DEFAULT uuid_generate_v4(),
ADD CONSTRAINT user_settings_pkey PRIMARY KEY (id),
ADD CONSTRAINT user_settings_user_id_key UNIQUE (user_id);

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own settings" ON user_settings;
DROP POLICY IF EXISTS "Users can update their own settings" ON user_settings;

-- Recreate policies with correct conditions
CREATE POLICY "Users can view their own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = user_id);

-- Add the missing INSERT policy
CREATE POLICY "Users can insert their own settings" 
ON user_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Update the trigger function to use user_id instead of id
CREATE OR REPLACE FUNCTION public.handle_new_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
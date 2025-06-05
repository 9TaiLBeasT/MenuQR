-- Drop existing user settings table and related objects
DROP TRIGGER IF EXISTS on_profile_created ON profiles;
DROP FUNCTION IF EXISTS public.handle_new_profile();
DROP TABLE IF EXISTS user_settings;

-- Recreate user settings table with correct structure
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE TRIGGER update_user_settings_modtime 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_modified_column();

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Add comprehensive RLS policies
CREATE POLICY "Users can view their own settings" 
  ON user_settings FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own settings" 
  ON user_settings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" 
  ON user_settings FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Backfill existing users
INSERT INTO public.user_settings (user_id)
SELECT id FROM auth.users
WHERE id NOT IN (SELECT user_id FROM public.user_settings);
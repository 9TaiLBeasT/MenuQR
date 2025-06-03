/*
  # Initial Schema Setup

  1. New Tables
    - Creates all core tables including:
      - profiles
      - categories
      - menu_items
      - qr_codes
      - menu_views
      - menu_item_views
      - user_settings
    
  2. Security
    - Enables RLS on all tables
    - Adds appropriate policies for each table
    
  3. Functions
    - Adds trigger functions for user creation
    - Adds helper functions for menu management
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  business_name TEXT,
  address TEXT,
  business_hours TEXT,
  contact_info TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  contains_nuts BOOLEAN DEFAULT FALSE,
  spice_level INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create qr_codes table
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  custom_path TEXT UNIQUE,
  background_color TEXT DEFAULT '#FFFFFF',
  foreground_color TEXT DEFAULT '#000000',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_views table
CREATE TABLE IF NOT EXISTS menu_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID REFERENCES qr_codes(id),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu_item_views table
CREATE TABLE IF NOT EXISTS menu_item_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) NOT NULL,
  menu_view_id UUID REFERENCES menu_views(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for new profiles
CREATE OR REPLACE FUNCTION public.handle_new_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_profile_created ON profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can view their own categories" 
ON categories FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own categories" 
ON categories FOR INSERT 
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own categories" 
ON categories FOR UPDATE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own categories" 
ON categories FOR DELETE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can view their own menu items" 
ON menu_items FOR SELECT 
USING (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own menu items" 
ON menu_items FOR INSERT 
WITH CHECK (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own menu items" 
ON menu_items FOR UPDATE 
USING (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own menu items" 
ON menu_items FOR DELETE 
USING (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own QR codes" 
ON qr_codes FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own QR codes" 
ON qr_codes FOR INSERT 
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own QR codes" 
ON qr_codes FOR UPDATE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own QR codes" 
ON qr_codes FOR DELETE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can view their own menu views" 
ON menu_views FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Users can view their own menu item views" 
ON menu_item_views FOR SELECT 
USING (
  menu_view_id IN (
    SELECT id FROM menu_views WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can view their own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = id);
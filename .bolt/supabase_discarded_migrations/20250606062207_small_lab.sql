-- Initial database setup for MenuQR platform

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  address TEXT,
  business_hours TEXT,
  contact_info TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  price_variations JSONB,
  image_url TEXT,
  is_vegetarian BOOLEAN DEFAULT FALSE,
  is_vegan BOOLEAN DEFAULT FALSE,
  is_gluten_free BOOLEAN DEFAULT FALSE,
  contains_nuts BOOLEAN DEFAULT FALSE,
  spice_level INTEGER DEFAULT 0,
  calories INTEGER,
  preparation_time VARCHAR(50),
  popularity_score INTEGER DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QR codes table
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  custom_path TEXT UNIQUE,
  background_color TEXT DEFAULT '#FFFFFF',
  foreground_color TEXT DEFAULT '#000000',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu views table for analytics
CREATE TABLE menu_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create menu item views table
CREATE TABLE menu_item_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE NOT NULL,
  menu_view_id UUID REFERENCES menu_views(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create update timestamp trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_profiles_modtime
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_settings_modtime
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_categories_modtime
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_menu_items_modtime
  BEFORE UPDATE ON menu_items
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_qr_codes_modtime
  BEFORE UPDATE ON qr_codes
  FOR EACH ROW
  EXECUTE FUNCTION update_modified_column();

-- Create function to ensure user settings exist
CREATE OR REPLACE FUNCTION ensure_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic user settings creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION ensure_user_settings();

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_views ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for user_settings
CREATE POLICY "Users can view their own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own settings" ON user_settings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for categories
CREATE POLICY "Users can view their own categories" ON categories FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own categories" ON categories FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update their own categories" ON categories FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Users can delete their own categories" ON categories FOR DELETE USING (profile_id = auth.uid());

-- RLS Policies for menu_items
CREATE POLICY "Users can view their own menu items" ON menu_items FOR SELECT 
USING (category_id IN (SELECT id FROM categories WHERE profile_id = auth.uid()));

CREATE POLICY "Users can insert their own menu items" ON menu_items FOR INSERT 
WITH CHECK (category_id IN (SELECT id FROM categories WHERE profile_id = auth.uid()));

CREATE POLICY "Users can update their own menu items" ON menu_items FOR UPDATE 
USING (category_id IN (SELECT id FROM categories WHERE profile_id = auth.uid()));

CREATE POLICY "Users can delete their own menu items" ON menu_items FOR DELETE 
USING (category_id IN (SELECT id FROM categories WHERE profile_id = auth.uid()));

-- RLS Policies for QR codes
CREATE POLICY "Users can view their own QR codes" ON qr_codes FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Users can insert their own QR codes" ON qr_codes FOR INSERT WITH CHECK (profile_id = auth.uid());
CREATE POLICY "Users can update their own QR codes" ON qr_codes FOR UPDATE USING (profile_id = auth.uid());
CREATE POLICY "Users can delete their own QR codes" ON qr_codes FOR DELETE USING (profile_id = auth.uid());

-- RLS Policies for analytics
CREATE POLICY "Users can view their own menu views" ON menu_views FOR SELECT USING (profile_id = auth.uid());
CREATE POLICY "Anyone can insert menu views" ON menu_views FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own menu item views" ON menu_item_views FOR SELECT 
USING (menu_view_id IN (SELECT id FROM menu_views WHERE profile_id = auth.uid()));

CREATE POLICY "Anyone can insert menu item views" ON menu_item_views FOR INSERT WITH CHECK (true);
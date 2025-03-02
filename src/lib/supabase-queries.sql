-- AUTHENTICATION
-- Note: Supabase handles authentication automatically, but we need to create a profiles table

-- Create a profiles table that extends the auth.users table
CREATE TABLE profiles (
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

-- Create a trigger to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- MENU MANAGEMENT

-- Create a categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a menu_items table
CREATE TABLE menu_items (
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

-- QR CODE MANAGEMENT

-- Create a qr_codes table
CREATE TABLE qr_codes (
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

-- ANALYTICS

-- Create a menu_views table to track QR code scans and menu views
CREATE TABLE menu_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  qr_code_id UUID REFERENCES qr_codes(id),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a menu_item_views table to track which items are viewed
CREATE TABLE menu_item_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) NOT NULL,
  menu_view_id UUID REFERENCES menu_views(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- VIEWS AND FUNCTIONS FOR ANALYTICS

-- Create a view for daily menu scans
CREATE OR REPLACE VIEW daily_menu_scans AS
SELECT 
  profile_id,
  DATE(created_at) as scan_date,
  COUNT(*) as scan_count
FROM menu_views
GROUP BY profile_id, DATE(created_at)
ORDER BY profile_id, scan_date DESC;

-- Create a view for popular menu items
CREATE OR REPLACE VIEW popular_menu_items AS
SELECT 
  mi.id,
  mi.name,
  mi.category_id,
  c.name as category_name,
  p.id as profile_id,
  p.business_name,
  COUNT(miv.id) as view_count
FROM menu_items mi
JOIN categories c ON mi.category_id = c.id
JOIN profiles p ON c.profile_id = p.id
LEFT JOIN menu_item_views miv ON mi.id = miv.menu_item_id
GROUP BY mi.id, mi.name, mi.category_id, c.name, p.id, p.business_name
ORDER BY view_count DESC;

-- Create RLS (Row Level Security) policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_views ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Create policies for categories
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

-- Create policies for menu_items
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

-- Create policies for qr_codes
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

-- Create policies for menu_views (analytics data)
CREATE POLICY "Users can view their own menu views" 
ON menu_views FOR SELECT 
USING (profile_id = auth.uid());

-- Create policies for menu_item_views
CREATE POLICY "Users can view their own menu item views" 
ON menu_item_views FOR SELECT 
USING (
  menu_view_id IN (
    SELECT id FROM menu_views WHERE profile_id = auth.uid()
  )
);

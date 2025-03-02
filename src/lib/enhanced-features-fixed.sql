-- SQL for implementing enhanced features for the Digital Menu Platform

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Theme & Branding Customization
CREATE TABLE IF NOT EXISTS theme_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  primary_color VARCHAR(20) DEFAULT '#0f766e',
  secondary_color VARCHAR(20) DEFAULT '#f3f4f6',
  font_family VARCHAR(50) DEFAULT 'Inter',
  background_image_url TEXT,
  logo_position VARCHAR(20) DEFAULT 'top',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for theme_settings
ALTER TABLE theme_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own theme settings"
ON theme_settings FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own theme settings"
ON theme_settings FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own theme settings"
ON theme_settings FOR UPDATE
USING (profile_id = auth.uid());

-- 2. Customer Feedback & Ratings
CREATE TABLE IF NOT EXISTS menu_item_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  customer_name TEXT,
  customer_email TEXT,
  is_highlighted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for menu_item_ratings
ALTER TABLE menu_item_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert ratings"
ON menu_item_ratings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Restaurant owners can view ratings for their menu items"
ON menu_item_ratings FOR SELECT
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Restaurant owners can update ratings for their menu items"
ON menu_item_ratings FOR UPDATE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Restaurant owners can delete ratings for their menu items"
ON menu_item_ratings FOR DELETE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

-- 3. Promotions & Special Offers
CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed_amount')),
  discount_value DECIMAL(10, 2),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  banner_image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for promotions and menu items
CREATE TABLE IF NOT EXISTS promotion_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  promotion_id UUID REFERENCES promotions(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  UNIQUE(promotion_id, menu_item_id)
);

-- Add RLS policies for promotions
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own promotions"
ON promotions FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own promotions"
ON promotions FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own promotions"
ON promotions FOR UPDATE
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own promotions"
ON promotions FOR DELETE
USING (profile_id = auth.uid());

-- Add RLS policies for promotion_menu_items
ALTER TABLE promotion_menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own promotion menu items"
ON promotion_menu_items FOR SELECT
USING (
  promotion_id IN (
    SELECT id FROM promotions WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own promotion menu items"
ON promotion_menu_items FOR INSERT
WITH CHECK (
  promotion_id IN (
    SELECT id FROM promotions WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own promotion menu items"
ON promotion_menu_items FOR DELETE
USING (
  promotion_id IN (
    SELECT id FROM promotions WHERE profile_id = auth.uid()
  )
);

-- 4. Digital Order Taking
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  table_number VARCHAR(20),
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  special_instructions TEXT,
  total_amount DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  variation_name TEXT,
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners can view their orders"
ON orders FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Anyone can insert orders"
ON orders FOR INSERT
WITH CHECK (true);

CREATE POLICY "Restaurant owners can update their orders"
ON orders FOR UPDATE
USING (profile_id = auth.uid());

-- Add RLS policies for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Restaurant owners can view their order items"
ON order_items FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert order items"
ON order_items FOR INSERT
WITH CHECK (true);

-- 5. Menu Scheduling
CREATE TABLE IF NOT EXISTS menu_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL, -- Array of days (0=Sunday, 1=Monday, etc.)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Junction table for menu schedules and categories
CREATE TABLE IF NOT EXISTS menu_schedule_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_schedule_id UUID REFERENCES menu_schedules(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  UNIQUE(menu_schedule_id, category_id)
);

-- Add RLS policies for menu_schedules
ALTER TABLE menu_schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own menu schedules"
ON menu_schedules FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own menu schedules"
ON menu_schedules FOR INSERT
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own menu schedules"
ON menu_schedules FOR UPDATE
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own menu schedules"
ON menu_schedules FOR DELETE
USING (profile_id = auth.uid());

-- Add RLS policies for menu_schedule_categories
ALTER TABLE menu_schedule_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own menu schedule categories"
ON menu_schedule_categories FOR SELECT
USING (
  menu_schedule_id IN (
    SELECT id FROM menu_schedules WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own menu schedule categories"
ON menu_schedule_categories FOR INSERT
WITH CHECK (
  menu_schedule_id IN (
    SELECT id FROM menu_schedules WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own menu schedule categories"
ON menu_schedule_categories FOR DELETE
USING (
  menu_schedule_id IN (
    SELECT id FROM menu_schedules WHERE profile_id = auth.uid()
  )
);

-- 6. Table Number Assignment for QR Codes
ALTER TABLE qr_codes
ADD COLUMN IF NOT EXISTS table_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS table_specific_promotions BOOLEAN DEFAULT FALSE;

-- 7. Multi-Language Support
CREATE TABLE IF NOT EXISTS languages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(10) NOT NULL UNIQUE,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE
);

-- Insert default languages
INSERT INTO languages (code, name) VALUES
('en', 'English'),
('es', 'Spanish'),
('fr', 'French'),
('de', 'German'),
('it', 'Italian'),
('zh', 'Chinese'),
('ja', 'Japanese'),
('ko', 'Korean'),
('ar', 'Arabic'),
('hi', 'Hindi')
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS menu_item_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(menu_item_id, language_code)
);

CREATE TABLE IF NOT EXISTS category_translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  language_code VARCHAR(10) REFERENCES languages(code) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_id, language_code)
);

-- Add RLS policies for translations
ALTER TABLE menu_item_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view menu item translations"
ON menu_item_translations FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own menu item translations"
ON menu_item_translations FOR INSERT
WITH CHECK (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own menu item translations"
ON menu_item_translations FOR UPDATE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own menu item translations"
ON menu_item_translations FOR DELETE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can view category translations"
ON category_translations FOR SELECT
USING (true);

CREATE POLICY "Users can insert their own category translations"
ON category_translations FOR INSERT
WITH CHECK (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own category translations"
ON category_translations FOR UPDATE
USING (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own category translations"
ON category_translations FOR DELETE
USING (
  category_id IN (
    SELECT id FROM categories WHERE profile_id = auth.uid()
  )
);

-- 8. Advanced Analytics
CREATE TABLE IF NOT EXISTS menu_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  qr_code_id UUID REFERENCES qr_codes(id) ON DELETE SET NULL,
  table_number VARCHAR(20),
  device_type VARCHAR(50),
  browser VARCHAR(50),
  ip_address VARCHAR(50),
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_item_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_view_id UUID REFERENCES menu_views(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  view_duration INTEGER, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for analytics
ALTER TABLE menu_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own menu views"
ON menu_views FOR SELECT
USING (profile_id = auth.uid());

CREATE POLICY "Anyone can insert menu views"
ON menu_views FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can view their own menu item views"
ON menu_item_views FOR SELECT
USING (
  menu_view_id IN (
    SELECT id FROM menu_views WHERE profile_id = auth.uid()
  )
);

CREATE POLICY "Anyone can insert menu item views"
ON menu_item_views FOR INSERT
WITH CHECK (true);

-- 9. Nutritional & Allergy Information
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS protein DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS carbs DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS fat DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS allergens TEXT[];

-- 10. Customer Favorites
CREATE TABLE IF NOT EXISTS customer_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  customer_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for customer_favorites
ALTER TABLE customer_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert customer favorites"
ON customer_favorites FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can select their own customer favorites"
ON customer_favorites FOR SELECT
USING (customer_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "Anyone can delete their own customer favorites"
ON customer_favorites FOR DELETE
USING (customer_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- 11. Create functions for getting active menu based on schedule
CREATE OR REPLACE FUNCTION get_active_menu_categories(p_profile_id UUID)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_description TEXT
) AS $$
DECLARE
  current_time_of_day TIME := CURRENT_TIME;
  current_day_of_week INTEGER := EXTRACT(DOW FROM CURRENT_DATE)::INTEGER;
BEGIN
  -- First check if there's an active schedule for the current time
  RETURN QUERY
  SELECT 
    c.id AS category_id,
    c.name AS category_name,
    c.description AS category_description
  FROM categories c
  JOIN menu_schedule_categories msc ON c.id = msc.category_id
  JOIN menu_schedules ms ON msc.menu_schedule_id = ms.id
  WHERE ms.profile_id = p_profile_id
    AND ms.is_active = TRUE
    AND current_time_of_day BETWEEN ms.start_time AND ms.end_time
    AND current_day_of_week = ANY(ms.days_of_week)
  ORDER BY c.display_order;
  
  -- If no scheduled categories are found, return all categories
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT 
      c.id AS category_id,
      c.name AS category_name,
      c.description AS category_description
    FROM categories c
    WHERE c.profile_id = p_profile_id
    ORDER BY c.display_order;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Create function to get active promotions
CREATE OR REPLACE FUNCTION get_active_promotions(p_profile_id UUID)
RETURNS TABLE (
  promotion_id UUID,
  title TEXT,
  description TEXT,
  discount_type VARCHAR(20),
  discount_value DECIMAL(10, 2),
  banner_image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  menu_item_ids UUID[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id AS promotion_id,
    p.title,
    p.description,
    p.discount_type,
    p.discount_value,
    p.banner_image_url,
    p.start_date,
    p.end_date,
    ARRAY_AGG(pmi.menu_item_id) AS menu_item_ids
  FROM promotions p
  LEFT JOIN promotion_menu_items pmi ON p.id = pmi.promotion_id
  WHERE p.profile_id = p_profile_id
    AND p.is_active = TRUE
    AND CURRENT_TIMESTAMP BETWEEN p.start_date AND p.end_date
  GROUP BY p.id, p.title, p.description, p.discount_type, p.discount_value, p.banner_image_url, p.start_date, p.end_date
  ORDER BY p.start_date DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create function to get menu with translations
CREATE OR REPLACE FUNCTION get_menu_with_translations(p_profile_id UUID, p_language_code VARCHAR DEFAULT 'en')
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_description TEXT,
  category_order INTEGER,
  item_id UUID,
  item_name TEXT,
  item_description TEXT,
  item_price DECIMAL(10, 2),
  item_price_variations JSONB,
  item_image_url TEXT,
  item_is_vegetarian BOOLEAN,
  item_is_vegan BOOLEAN,
  item_is_gluten_free BOOLEAN,
  item_contains_nuts BOOLEAN,
  item_spice_level INTEGER,
  item_calories INTEGER,
  item_allergens TEXT[],
  item_is_available BOOLEAN,
  item_order INTEGER,
  business_name TEXT,
  business_logo TEXT,
  average_rating NUMERIC,
  promotion_id UUID,
  promotion_discount_type VARCHAR(20),
  promotion_discount_value DECIMAL(10, 2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id AS category_id,
    COALESCE(ct.name, c.name) AS category_name,
    COALESCE(ct.description, c.description) AS category_description,
    c.display_order AS category_order,
    mi.id AS item_id,
    COALESCE(mit.name, mi.name) AS item_name,
    COALESCE(mit.description, mi.description) AS item_description,
    mi.price AS item_price,
    mi.price_variations AS item_price_variations,
    mi.image_url AS item_image_url,
    mi.is_vegetarian AS item_is_vegetarian,
    mi.is_vegan AS item_is_vegan,
    mi.is_gluten_free AS item_is_gluten_free,
    mi.contains_nuts AS item_contains_nuts,
    mi.spice_level AS item_spice_level,
    mi.calories AS item_calories,
    mi.allergens AS item_allergens,
    mi.is_available AS item_is_available,
    mi.display_order AS item_order,
    p.business_name,
    p.logo_url AS business_logo,
    COALESCE(AVG(mir.rating), 0) AS average_rating,
    promo.id AS promotion_id,
    promo.discount_type AS promotion_discount_type,
    promo.discount_value AS promotion_discount_value
  FROM categories c
  JOIN menu_items mi ON c.id = mi.category_id
  JOIN profiles p ON c.profile_id = p.id
  LEFT JOIN category_translations ct ON c.id = ct.category_id AND ct.language_code = p_language_code
  LEFT JOIN menu_item_translations mit ON mi.id = mit.menu_item_id AND mit.language_code = p_language_code
  LEFT JOIN menu_item_ratings mir ON mi.id = mir.menu_item_id
  LEFT JOIN (
    SELECT pmi.menu_item_id, p.*
    FROM promotions p
    JOIN promotion_menu_items pmi ON p.id = pmi.promotion_id
    WHERE p.profile_id = p_profile_id
      AND p.is_active = TRUE
      AND CURRENT_TIMESTAMP BETWEEN p.start_date AND p.end_date
  ) promo ON mi.id = promo.menu_item_id
  WHERE c.profile_id = p_profile_id AND mi.is_available = true
  GROUP BY c.id, ct.name, ct.description, c.name, c.description, c.display_order, mi.id, mit.name, mit.description, mi.name, mi.description, mi.price, mi.price_variations, mi.image_url, mi.is_vegetarian, mi.is_vegan, mi.is_gluten_free, mi.contains_nuts, mi.spice_level, mi.calories, mi.allergens, mi.is_available, mi.display_order, p.business_name, p.logo_url, promo.id, promo.discount_type, promo.discount_value
  ORDER BY c.display_order, mi.display_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Create function to delete a user account and all associated data
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id uuid;
BEGIN
  -- Get the current user ID
  user_id := auth.uid();
  
  -- Delete all menu item views associated with the user's menu views
  DELETE FROM menu_item_views
  WHERE menu_view_id IN (
    SELECT id FROM menu_views WHERE profile_id = user_id
  );
  
  -- Delete all menu views
  DELETE FROM menu_views WHERE profile_id = user_id;
  
  -- Delete all QR codes
  DELETE FROM qr_codes WHERE profile_id = user_id;
  
  -- Delete all menu items in the user's categories
  DELETE FROM menu_items
  WHERE category_id IN (
    SELECT id FROM categories WHERE profile_id = user_id
  );
  
  -- Delete all categories
  DELETE FROM categories WHERE profile_id = user_id;
  
  -- Delete user settings
  DELETE FROM user_settings WHERE id = user_id;
  
  -- Delete theme settings
  DELETE FROM theme_settings WHERE profile_id = user_id;
  
  -- Delete promotions
  DELETE FROM promotions WHERE profile_id = user_id;
  
  -- Delete menu schedules
  DELETE FROM menu_schedules WHERE profile_id = user_id;
  
  -- Delete profile
  DELETE FROM profiles WHERE id = user_id;
  
  -- Note: The actual user in auth.users will be deleted by Supabase Auth API
  -- This function only cleans up the application data
END;
$$;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_active_menu_categories(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_active_promotions(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_menu_with_translations(UUID, VARCHAR) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

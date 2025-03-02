-- Add user settings table for the new Settings page
CREATE TABLE user_settings (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  email_notifications BOOLEAN DEFAULT TRUE,
  whatsapp_support BOOLEAN DEFAULT FALSE,
  theme VARCHAR(20) DEFAULT 'light',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create a trigger to create user settings when a new profile is created
CREATE OR REPLACE FUNCTION public.handle_new_profile() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Add RLS policies for user_settings
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own settings" 
ON user_settings FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own settings" 
ON user_settings FOR UPDATE 
USING (auth.uid() = id);

-- Modify the menu_items table to add more fields for better menu management
ALTER TABLE menu_items 
ADD COLUMN IF NOT EXISTS calories INTEGER,
ADD COLUMN IF NOT EXISTS preparation_time VARCHAR(50),
ADD COLUMN IF NOT EXISTS popularity_score INTEGER DEFAULT 0;

-- Add a table for storing uploaded files (for menu item images, logos, etc.)
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies for files
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own files" 
ON files FOR SELECT 
USING (profile_id = auth.uid());

CREATE POLICY "Users can insert their own files" 
ON files FOR INSERT 
WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Users can update their own files" 
ON files FOR UPDATE 
USING (profile_id = auth.uid());

CREATE POLICY "Users can delete their own files" 
ON files FOR DELETE 
USING (profile_id = auth.uid());

-- Add a function to get menu items with their categories
CREATE OR REPLACE FUNCTION get_menu_with_categories(p_profile_id UUID)
RETURNS TABLE (
  category_id UUID,
  category_name TEXT,
  category_description TEXT,
  category_display_order INTEGER,
  item_id UUID,
  item_name TEXT,
  item_description TEXT,
  item_price DECIMAL(10, 2),
  item_image_url TEXT,
  item_is_vegetarian BOOLEAN,
  item_is_vegan BOOLEAN,
  item_is_gluten_free BOOLEAN,
  item_contains_nuts BOOLEAN,
  item_spice_level INTEGER,
  item_is_available BOOLEAN,
  item_display_order INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as category_id,
    c.name as category_name,
    c.description as category_description,
    c.display_order as category_display_order,
    mi.id as item_id,
    mi.name as item_name,
    mi.description as item_description,
    mi.price as item_price,
    mi.image_url as item_image_url,
    mi.is_vegetarian as item_is_vegetarian,
    mi.is_vegan as item_is_vegan,
    mi.is_gluten_free as item_is_gluten_free,
    mi.contains_nuts as item_contains_nuts,
    mi.spice_level as item_spice_level,
    mi.is_available as item_is_available,
    mi.display_order as item_display_order
  FROM 
    categories c
  LEFT JOIN 
    menu_items mi ON c.id = mi.category_id
  WHERE 
    c.profile_id = p_profile_id
  ORDER BY 
    c.display_order, mi.display_order;
 END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add a function to update menu item display order
CREATE OR REPLACE FUNCTION update_menu_item_order(p_items_order JSONB)
RETURNS VOID AS $$
DECLARE
  item_record JSONB;
BEGIN
  FOR item_record IN SELECT * FROM jsonb_array_elements(p_items_order)
  LOOP
    UPDATE menu_items
    SET display_order = (item_record->>'order')::integer
    WHERE id = (item_record->>'id')::uuid
    AND category_id IN (
      SELECT id FROM categories WHERE profile_id = auth.uid()
    );
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

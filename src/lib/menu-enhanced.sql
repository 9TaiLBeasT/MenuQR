-- SQL updates for enhanced menu features

-- 1. Add price variations support to menu_items table
ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS price_variations JSONB DEFAULT NULL;

-- 2. Add image storage table for menu items
CREATE TABLE IF NOT EXISTS menu_item_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Add RLS policies for menu_item_images
ALTER TABLE menu_item_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own menu item images"
ON menu_item_images FOR SELECT
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can insert their own menu item images"
ON menu_item_images FOR INSERT
WITH CHECK (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can update their own menu item images"
ON menu_item_images FOR UPDATE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their own menu item images"
ON menu_item_images FOR DELETE
USING (
  menu_item_id IN (
    SELECT mi.id FROM menu_items mi
    JOIN categories c ON mi.category_id = c.id
    WHERE c.profile_id = auth.uid()
  )
);

-- 4. Create a function to update menu item display order
CREATE OR REPLACE FUNCTION update_menu_item_order(p_items JSONB)
RETURNS VOID AS $$
DECLARE
  item_record JSONB;
  item_id UUID;
  new_order INTEGER;
BEGIN
  FOR item_record IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    item_id := (item_record->>'id')::UUID;
    new_order := (item_record->>'display_order')::INTEGER;
    
    -- Verify the user owns this menu item
    IF EXISTS (
      SELECT 1 FROM menu_items mi
      JOIN categories c ON mi.category_id = c.id
      WHERE mi.id = item_id AND c.profile_id = auth.uid()
    ) THEN
      UPDATE menu_items
      SET display_order = new_order,
          updated_at = NOW()
      WHERE id = item_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create a function to update category display order
CREATE OR REPLACE FUNCTION update_category_order(p_categories JSONB)
RETURNS VOID AS $$
DECLARE
  category_record JSONB;
  category_id UUID;
  new_order INTEGER;
BEGIN
  FOR category_record IN SELECT * FROM jsonb_array_elements(p_categories)
  LOOP
    category_id := (category_record->>'id')::UUID;
    new_order := (category_record->>'display_order')::INTEGER;
    
    -- Verify the user owns this category
    IF EXISTS (
      SELECT 1 FROM categories
      WHERE id = category_id AND profile_id = auth.uid()
    ) THEN
      UPDATE categories
      SET display_order = new_order,
          updated_at = NOW()
      WHERE id = category_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create a view for the customer-facing menu
CREATE OR REPLACE VIEW public_menu AS
SELECT 
  c.id AS category_id,
  c.name AS category_name,
  c.description AS category_description,
  c.display_order AS category_order,
  c.profile_id,
  mi.id AS item_id,
  mi.name AS item_name,
  mi.description AS item_description,
  mi.price,
  mi.price_variations,
  mi.image_url,
  mi.is_vegetarian,
  mi.is_vegan,
  mi.is_gluten_free,
  mi.contains_nuts,
  mi.spice_level,
  mi.is_available,
  mi.display_order AS item_order,
  p.business_name,
  p.logo_url AS business_logo
FROM categories c
JOIN menu_items mi ON c.id = mi.category_id
JOIN profiles p ON c.profile_id = p.id
WHERE mi.is_available = true
ORDER BY c.display_order, mi.display_order;

-- 7. Create a function to get a complete menu by profile ID
CREATE OR REPLACE FUNCTION get_public_menu(profile_id UUID)
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
  item_is_available BOOLEAN,
  item_order INTEGER,
  business_name TEXT,
  business_logo TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pm.category_id,
    pm.category_name,
    pm.category_description,
    pm.category_order,
    pm.item_id,
    pm.item_name,
    pm.item_description,
    pm.price AS item_price,
    pm.price_variations AS item_price_variations,
    pm.image_url AS item_image_url,
    pm.is_vegetarian AS item_is_vegetarian,
    pm.is_vegan AS item_is_vegan,
    pm.is_gluten_free AS item_is_gluten_free,
    pm.contains_nuts AS item_contains_nuts,
    pm.spice_level AS item_spice_level,
    pm.is_available AS item_is_available,
    pm.item_order,
    pm.business_name,
    pm.business_logo
  FROM public_menu pm
  WHERE pm.profile_id = profile_id AND pm.is_available = true
  ORDER BY pm.category_order, pm.item_order;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION update_menu_item_order(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION update_category_order(JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION get_public_menu(UUID) TO anon, authenticated;

-- 9. Add theme support to user_settings
ALTER TABLE user_settings
ADD COLUMN IF NOT EXISTS theme_preferences JSONB DEFAULT '{"mode": "light", "primaryColor": "#0f766e", "fontFamily": "Inter"}'::JSONB;

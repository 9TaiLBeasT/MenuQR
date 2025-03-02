-- SQL queries to update the database for the free plan implementation

-- 1. Remove any limitations on QR codes per user (if any exist)
-- This query removes any check constraints that might limit the number of QR codes
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'qr_codes_limit_check' AND conrelid = 'qr_codes'::regclass
  ) THEN
    ALTER TABLE qr_codes DROP CONSTRAINT qr_codes_limit_check;
  END IF;
END
$$;

-- 2. Remove any limitations on menu items per user (if any exist)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'menu_items_limit_check' AND conrelid = 'menu_items'::regclass
  ) THEN
    ALTER TABLE menu_items DROP CONSTRAINT menu_items_limit_check;
  END IF;
END
$$;

-- 3. Add a function to delete a user account and all associated data
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
  
  -- Delete profile
  DELETE FROM profiles WHERE id = user_id;
  
  -- Note: The actual user in auth.users will be deleted by Supabase Auth API
  -- This function only cleans up the application data
END;
$$;

-- 4. Grant execute permission on the delete_user function to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;

-- 5. Create a view to show all features available to users (for documentation purposes)
CREATE OR REPLACE VIEW available_features AS
SELECT 
  'Unlimited QR Codes' as feature_name,
  'Create as many QR codes as needed for different menus or locations' as description,
  true as is_available
UNION ALL
SELECT 
  'Unlimited Menu Items' as feature_name,
  'Add unlimited dishes, drinks, and specials to your menu' as description,
  true as is_available
UNION ALL
SELECT 
  'Advanced Analytics' as feature_name,
  'Track menu views, popular items, and customer engagement' as description,
  true as is_available
UNION ALL
SELECT 
  'Custom Branding' as feature_name,
  'Personalize your menu with your restaurant logo and colors' as description,
  true as is_available;

-- 6. Create a function to get user statistics
CREATE OR REPLACE FUNCTION get_user_statistics()
RETURNS TABLE (
  total_qr_codes bigint,
  total_categories bigint,
  total_menu_items bigint,
  total_menu_views bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM qr_codes WHERE profile_id = auth.uid()) as total_qr_codes,
    (SELECT COUNT(*) FROM categories WHERE profile_id = auth.uid()) as total_categories,
    (SELECT COUNT(*) FROM menu_items WHERE category_id IN (SELECT id FROM categories WHERE profile_id = auth.uid())) as total_menu_items,
    (SELECT COUNT(*) FROM menu_views WHERE profile_id = auth.uid()) as total_menu_views;
END;
$$;

-- 7. Grant execute permission on the get_user_statistics function to authenticated users
GRANT EXECUTE ON FUNCTION get_user_statistics() TO authenticated;

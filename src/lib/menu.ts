import { supabase } from "./supabase";

export type Category = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type PriceVariation = {
  name: string;
  price: number;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  price_variations: PriceVariation[] | null;
  image_url: string | null;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  contains_nuts: boolean;
  spice_level: number;
  is_available: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

// Get all categories for the current user
export const getCategories = async (): Promise<Category[]> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data as Category[];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// Create a new category
export const createCategory = async (
  category: Partial<Category>,
): Promise<Category | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("categories")
      .insert({
        ...category,
        profile_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch (error) {
    console.error("Error creating category:", error);
    return null;
  }
};

// Update a category
export const updateCategory = async (
  id: string,
  category: Partial<Category>,
): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .update(category)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as Category;
  } catch (error) {
    console.error("Error updating category:", error);
    return null;
  }
};

// Delete a category
export const deleteCategory = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting category:", error);
    return false;
  }
};

// Get all menu items for a category
export const getMenuItems = async (categoryId: string): Promise<MenuItem[]> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("category_id", categoryId)
      .order("display_order", { ascending: true });

    if (error) throw error;
    return data as MenuItem[];
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
};

// Create a new menu item
export const createMenuItem = async (
  menuItem: Partial<MenuItem>,
): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .insert(menuItem)
      .select()
      .single();

    if (error) throw error;
    return data as MenuItem;
  } catch (error) {
    console.error("Error creating menu item:", error);
    return null;
  }
};

// Update a menu item
export const updateMenuItem = async (
  id: string,
  menuItem: Partial<MenuItem>,
): Promise<MenuItem | null> => {
  try {
    const { data, error } = await supabase
      .from("menu_items")
      .update(menuItem)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as MenuItem;
  } catch (error) {
    console.error("Error updating menu item:", error);
    return null;
  }
};

// Update menu item display order
export const updateMenuItemOrder = async (
  items: { id: string; display_order: number }[],
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc("update_menu_item_order", {
      p_items: items,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating menu item order:", error);
    return false;
  }
};

// Update category display order
export const updateCategoryOrder = async (
  categories: { id: string; display_order: number }[],
): Promise<boolean> => {
  try {
    const { error } = await supabase.rpc("update_category_order", {
      p_categories: categories,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating category order:", error);
    return false;
  }
};

// Get public menu for a profile
export const getPublicMenu = async (profileId: string) => {
  try {
    const { data, error } = await supabase.rpc("get_public_menu", {
      profile_id: profileId,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching public menu:", error);
    return [];
  }
};

// Delete a menu item
export const deleteMenuItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting menu item:", error);
    return false;
  }
};

import { supabase } from "./supabase";

export type DailyMenuScan = {
  profile_id: string;
  scan_date: string;
  scan_count: number;
};

export type PopularMenuItem = {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  profile_id: string;
  business_name: string;
  view_count: number;
};

// Get daily menu scans for the current user
export const getDailyMenuScans = async (
  days: number = 30,
): Promise<DailyMenuScan[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from("daily_menu_scans")
      .select("*")
      .eq("profile_id", user.id)
      .gte("scan_date", startDate.toISOString().split("T")[0])
      .lte("scan_date", endDate.toISOString().split("T")[0])
      .order("scan_date", { ascending: false });

    if (error) throw error;
    return data as DailyMenuScan[];
  } catch (error) {
    console.error("Error fetching daily menu scans:", error);
    return [];
  }
};

// Get popular menu items for the current user
export const getPopularMenuItems = async (
  limit: number = 10,
): Promise<PopularMenuItem[]> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("popular_menu_items")
      .select("*")
      .eq("profile_id", user.id)
      .order("view_count", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data as PopularMenuItem[];
  } catch (error) {
    console.error("Error fetching popular menu items:", error);
    return [];
  }
};

// Track a menu item view
export const trackMenuItemView = async (
  menuItemId: string,
  menuViewId: string,
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("menu_item_views").insert({
      menu_item_id: menuItemId,
      menu_view_id: menuViewId,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error tracking menu item view:", error);
    return false;
  }
};

// Get total menu views for the current user
export const getTotalMenuViews = async (): Promise<number> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { count, error } = await supabase
      .from("menu_views")
      .select("*", { count: "exact", head: true })
      .eq("profile_id", user.id);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error("Error fetching total menu views:", error);
    return 0;
  }
};

import { supabase } from "./supabase";

export type UserSettings = {
  id: string;
  email_notifications: boolean;
  whatsapp_support: boolean;
  theme: string;
  created_at: string;
  updated_at: string;
};

// Get user settings
export const getUserSettings = async (): Promise<UserSettings | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("user_settings")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as UserSettings;
  } catch (error) {
    console.error("Error fetching user settings:", error);
    return null;
  }
};

// Update user settings
export const updateUserSettings = async (
  settings: Partial<UserSettings>,
): Promise<UserSettings | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("user_settings")
      .update(settings)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data as UserSettings;
  } catch (error) {
    console.error("Error updating user settings:", error);
    return null;
  }
};

// Change user password
export const changePassword = async (newPassword: string): Promise<boolean> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error changing password:", error);
    return false;
  }
};

// Delete user account
export const deleteAccount = async (): Promise<boolean> => {
  try {
    // This is a simplified version. In a real app, you might want to:
    // 1. Delete all user data from various tables first
    // 2. Then delete the user account
    const { error } = await supabase.rpc("delete_user");

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting account:", error);
    return false;
  }
};

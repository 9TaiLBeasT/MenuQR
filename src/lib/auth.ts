import { supabase } from "./supabase";

export type SignUpCredentials = {
  email: string;
  password: string;
  businessName?: string;
  address?: string;
  businessHours?: string;
  contactInfo?: string;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type Profile = {
  id: string;
  business_name: string | null;
  address: string | null;
  business_hours: string | null;
  contact_info: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
};

// Sign up a new user
export const signUp = async (credentials: SignUpCredentials) => {
  try {
    // Sign up the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (authError) throw authError;

    // If we have additional profile data, update the profile
    if (
      credentials.businessName ||
      credentials.address ||
      credentials.businessHours ||
      credentials.contactInfo
    ) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          business_name: credentials.businessName,
          address: credentials.address,
          business_hours: credentials.businessHours,
          contact_info: credentials.contactInfo,
        })
        .eq("id", authData.user?.id);

      if (profileError) throw profileError;
    }

    return { user: authData.user, session: authData.session };
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (credentials: LoginCredentials) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) throw error;
    return { user: data.user, session: data.session };
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Get the current user's profile
export const getProfile = async (): Promise<Profile | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
};

// Update the current user's profile
export const updateProfile = async (profile: Partial<Profile>) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("profiles")
      .update(profile)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;
    return data as Profile;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
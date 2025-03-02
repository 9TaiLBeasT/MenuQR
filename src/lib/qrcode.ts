import { supabase } from "./supabase";

export type QRCode = {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  custom_path: string | null;
  background_color: string;
  foreground_color: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
};

// Get all QR codes for the current user
export const getQRCodes = async (): Promise<QRCode[]> => {
  try {
    const { data, error } = await supabase
      .from("qr_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as QRCode[];
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return [];
  }
};

// Create a new QR code
export const createQRCode = async (
  qrCode: Partial<QRCode>,
): Promise<QRCode | null> => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("No user logged in");

    const { data, error } = await supabase
      .from("qr_codes")
      .insert({
        ...qrCode,
        profile_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data as QRCode;
  } catch (error) {
    console.error("Error creating QR code:", error);
    return null;
  }
};

// Update a QR code
export const updateQRCode = async (
  id: string,
  qrCode: Partial<QRCode>,
): Promise<QRCode | null> => {
  try {
    const { data, error } = await supabase
      .from("qr_codes")
      .update(qrCode)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data as QRCode;
  } catch (error) {
    console.error("Error updating QR code:", error);
    return null;
  }
};

// Delete a QR code
export const deleteQRCode = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from("qr_codes").delete().eq("id", id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error deleting QR code:", error);
    return false;
  }
};

// Track a QR code scan
export const trackQRCodeScan = async (
  qrCodeId: string,
  profileId: string,
  metadata: {
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
  } = {},
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("menu_views").insert({
      qr_code_id: qrCodeId,
      profile_id: profileId,
      ...metadata,
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error tracking QR code scan:", error);
    return false;
  }
};

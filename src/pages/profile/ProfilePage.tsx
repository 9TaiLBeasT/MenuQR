import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { getProfile, updateProfile, Profile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Upload,
  User,
  Building,
  MapPin,
  Clock,
  Phone,
  Mail,
} from "lucide-react";

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: "",
    address: "",
    business_hours: "",
    contact_info: "",
    logo_url: "",
    cover_image_url: "",
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        try {
          const profileData = await getProfile();
          setProfile(profileData);
          if (profileData) {
            setFormData({
              business_name: profileData.business_name || "",
              address: profileData.address || "",
              business_hours: profileData.business_hours || "",
              contact_info: profileData.contact_info || "",
              logo_url: profileData.logo_url || "",
              cover_image_url: profileData.cover_image_url || "",
            });
          }
        } catch (error) {
          console.error("Error loading profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updatedProfile = await updateProfile(formData);
      setProfile(updatedProfile);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Placeholder function for image upload
  const handleImageUpload = (type: "logo" | "cover") => {
    // In a real implementation, this would open a file picker and upload to storage
    toast({
      title: "Coming Soon",
      description: `${type === "logo" ? "Logo" : "Cover image"} upload will be available soon`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center">
                  <Avatar className="h-24 w-24 mb-4">
                    {profile?.logo_url ? (
                      <AvatarImage
                        src={profile.logo_url}
                        alt={profile.business_name || "Business"}
                      />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {(
                          profile?.business_name?.substring(0, 2) ||
                          user?.email?.substring(0, 2) ||
                          "BN"
                        ).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <h2 className="text-xl font-semibold text-center">
                    {profile?.business_name || "Your Business"}
                  </h2>
                  <p className="text-muted-foreground text-center mb-4">
                    {user?.email}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mb-2"
                    onClick={() => handleImageUpload("logo")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Logo
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => handleImageUpload("cover")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Cover Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Business Information</CardTitle>
                <CardDescription>
                  Update your business details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="business_name"
                        name="business_name"
                        placeholder="Your Restaurant or Cafe"
                        className="pl-10"
                        value={formData.business_name}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Main St, City, State"
                        className="pl-10"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business_hours">Business Hours</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="business_hours"
                        name="business_hours"
                        placeholder="Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-10PM"
                        className="pl-10"
                        value={formData.business_hours}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_info">Contact Information</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="contact_info"
                        name="contact_info"
                        placeholder="Contact person name and phone number"
                        className="pl-10"
                        value={formData.contact_info}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" disabled={isSaving}>
                      {isSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

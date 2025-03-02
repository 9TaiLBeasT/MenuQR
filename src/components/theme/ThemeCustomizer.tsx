import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Loader2, Palette, Upload, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface ThemeSettings {
  id?: string;
  profile_id?: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  background_image_url: string | null;
  logo_position: string;
}

const fontOptions = [
  { value: "Inter", label: "Inter (Default)" },
  { value: "Roboto, sans-serif", label: "Roboto" },
  { value: "Poppins, sans-serif", label: "Poppins" },
  { value: "Montserrat, sans-serif", label: "Montserrat" },
  { value: "Lato, sans-serif", label: "Lato" },
  { value: '"Playfair Display", serif', label: "Playfair Display" },
];

const logoPositionOptions = [
  { value: "top", label: "Top" },
  { value: "left", label: "Left" },
  { value: "right", label: "Right" },
];

const ThemeCustomizer: React.FC = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>({
    primary_color: "#0f766e",
    secondary_color: "#f3f4f6",
    font_family: "Inter",
    background_image_url: null,
    logo_position: "top",
  });

  // For preview
  const [previewSettings, setPreviewSettings] = useState<ThemeSettings>({
    primary_color: "#0f766e",
    secondary_color: "#f3f4f6",
    font_family: "Inter",
    background_image_url: null,
    logo_position: "top",
  });

  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("theme_settings")
        .select("*")
        .eq("profile_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is the error code for no rows returned
        throw error;
      }

      if (data) {
        setThemeSettings(data);
        setPreviewSettings(data);
      }
    } catch (error) {
      console.error("Error loading theme settings:", error);
      toast({
        title: "Error",
        description: "Failed to load theme settings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setThemeSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreview = () => {
    setPreviewSettings({ ...themeSettings });
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const { data: existingSettings } = await supabase
        .from("theme_settings")
        .select("id")
        .eq("profile_id", user.id)
        .single();

      let result;
      if (existingSettings) {
        // Update existing settings
        result = await supabase
          .from("theme_settings")
          .update({
            ...themeSettings,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSettings.id);
      } else {
        // Insert new settings
        result = await supabase.from("theme_settings").insert({
          ...themeSettings,
          profile_id: user.id,
        });
      }

      if (result.error) throw result.error;

      toast({
        title: "Theme Updated",
        description: "Your theme settings have been saved successfully",
      });

      // Update preview with saved settings
      setPreviewSettings({ ...themeSettings });
    } catch (error) {
      console.error("Error saving theme settings:", error);
      toast({
        title: "Error",
        description: "Failed to save theme settings",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleBackgroundImageUpload = () => {
    toast({
      title: "Coming Soon",
      description: "Background image upload will be available soon",
    });
  };

  const resetToDefaults = () => {
    setThemeSettings({
      primary_color: "#0f766e",
      secondary_color: "#f3f4f6",
      font_family: "Inter",
      background_image_url: null,
      logo_position: "top",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading theme settings...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" /> Theme Customization
          </CardTitle>
          <CardDescription>
            Customize the appearance of your digital menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="primary_color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: themeSettings.primary_color }}
                    onClick={() =>
                      document.getElementById("primary_color")?.click()
                    }
                  ></div>
                  <Input
                    id="primary_color"
                    name="primary_color"
                    type="color"
                    className="w-24 h-10 p-1"
                    value={themeSettings.primary_color}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="primary_color"
                    placeholder="#0f766e"
                    value={themeSettings.primary_color}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="secondary_color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: themeSettings.secondary_color }}
                    onClick={() =>
                      document.getElementById("secondary_color")?.click()
                    }
                  ></div>
                  <Input
                    id="secondary_color"
                    name="secondary_color"
                    type="color"
                    className="w-24 h-10 p-1"
                    value={themeSettings.secondary_color}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="secondary_color"
                    placeholder="#f3f4f6"
                    value={themeSettings.secondary_color}
                    onChange={handleInputChange}
                    className="flex-grow"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="typography" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="font_family">Font Family</Label>
                <select
                  id="font_family"
                  name="font_family"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={themeSettings.font_family}
                  onChange={handleInputChange}
                >
                  {fontOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 p-4 border rounded-md">
                <p className="text-sm text-muted-foreground mb-2">
                  Font Preview:
                </p>
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: themeSettings.font_family }}
                >
                  Heading Text
                </p>
                <p
                  className="text-base"
                  style={{ fontFamily: themeSettings.font_family }}
                >
                  This is how your menu text will appear to customers. The quick
                  brown fox jumps over the lazy dog.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="logo_position">Logo Position</Label>
                <select
                  id="logo_position"
                  name="logo_position"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={themeSettings.logo_position}
                  onChange={handleInputChange}
                >
                  {logoPositionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background_image_url">
                  Background Image (Optional)
                </Label>
                <div className="flex space-x-2">
                  <Input
                    id="background_image_url"
                    name="background_image_url"
                    placeholder="https://example.com/background.jpg"
                    value={themeSettings.background_image_url || ""}
                    onChange={handleInputChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleBackgroundImageUpload}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetToDefaults}>
            <RefreshCw className="mr-2 h-4 w-4" /> Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              Preview
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" /> Save Theme
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Preview Card */}
      <Card>
        <CardHeader>
          <CardTitle>Live Preview</CardTitle>
          <CardDescription>
            See how your menu will appear to customers
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 overflow-hidden">
          <div
            className="h-[500px] overflow-auto"
            style={{
              backgroundColor: previewSettings.secondary_color,
              backgroundImage: previewSettings.background_image_url
                ? `url(${previewSettings.background_image_url})`
                : "none",
              backgroundSize: "cover",
              backgroundPosition: "center",
              fontFamily: previewSettings.font_family,
            }}
          >
            {/* Header */}
            <div
              className="p-4 sticky top-0 z-10 backdrop-blur-sm border-b flex items-center"
              style={{ backgroundColor: `${previewSettings.primary_color}20` }} // 20 is for 12% opacity
            >
              <div
                className={`flex ${previewSettings.logo_position === "left" ? "justify-start" : previewSettings.logo_position === "right" ? "justify-end" : "justify-center"} w-full`}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ color: previewSettings.primary_color }}
                    >
                      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"></path>
                      <path d="M7 2v20"></path>
                      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"></path>
                    </svg>
                  </div>
                  <h1
                    className="text-xl font-bold"
                    style={{ color: previewSettings.primary_color }}
                  >
                    Your Restaurant
                  </h1>
                </div>
              </div>
            </div>

            {/* Menu content */}
            <div className="p-4 max-w-md mx-auto">
              {/* Category */}
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: previewSettings.primary_color }}
                >
                  Appetizers
                </h2>

                {/* Menu items */}
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="border rounded-lg overflow-hidden"
                      style={{
                        borderColor: `${previewSettings.primary_color}30`,
                      }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Sample Dish {i}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              A delicious description of this amazing menu item
                              that will make customers' mouths water.
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className="font-semibold"
                              style={{ color: previewSettings.primary_color }}
                            >
                              $12.99
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Another category */}
              <div>
                <h2
                  className="text-2xl font-bold mb-4"
                  style={{ color: previewSettings.primary_color }}
                >
                  Main Courses
                </h2>

                {/* Menu items */}
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="border rounded-lg overflow-hidden"
                      style={{
                        borderColor: `${previewSettings.primary_color}30`,
                      }}
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              Main Dish {i}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              A hearty main course that will satisfy your hunger
                              and delight your taste buds.
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className="font-semibold"
                              style={{ color: previewSettings.primary_color }}
                            >
                              $18.99
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeCustomizer;

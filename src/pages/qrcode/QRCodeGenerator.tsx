import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/components/auth/AuthContext";
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
  CardFooter,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Download,
  QrCode,
  Upload,
  Palette,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define QR code type
interface QRCode {
  id: string;
  profile_id: string;
  name: string;
  description: string | null;
  custom_path: string | null;
  foreground_color: string;
  background_color: string;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

// Mock functions for QR code operations
const getQRCodes = async (): Promise<QRCode[]> => {
  // In a real implementation, this would fetch from Supabase
  return [
    {
      id: "1",
      profile_id: "user-1",
      name: "Main Menu",
      description: "QR code for the main restaurant menu",
      custom_path: "main-menu",
      foreground_color: "#000000",
      background_color: "#FFFFFF",
      logo_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];
};

const createQRCode = async (
  qrCode: Partial<QRCode>,
): Promise<QRCode | null> => {
  // In a real implementation, this would create a QR code in Supabase
  const newQRCode: QRCode = {
    id: Math.random().toString(36).substring(2, 9),
    profile_id: "user-1",
    name: qrCode.name || "New QR Code",
    description: qrCode.description || null,
    custom_path: qrCode.custom_path || null,
    foreground_color: qrCode.foreground_color || "#000000",
    background_color: qrCode.background_color || "#FFFFFF",
    logo_url: qrCode.logo_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  return newQRCode;
};

const updateQRCode = async (
  id: string,
  qrCode: Partial<QRCode>,
): Promise<QRCode | null> => {
  // In a real implementation, this would update a QR code in Supabase
  return {
    id,
    profile_id: "user-1",
    name: qrCode.name || "Updated QR Code",
    description: qrCode.description || null,
    custom_path: qrCode.custom_path || null,
    foreground_color: qrCode.foreground_color || "#000000",
    background_color: qrCode.background_color || "#FFFFFF",
    logo_url: qrCode.logo_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
};

const deleteQRCode = async (id: string): Promise<boolean> => {
  // In a real implementation, this would delete a QR code from Supabase
  return true;
};

// Mock QR code generation (in a real app, this would use a QR code library)
const generateQRCodeDataURL = (text: string, options: any = {}) => {
  // This is a placeholder. In a real app, you would use a library like qrcode.react
  // For now, we'll just return a placeholder image URL
  const color = options.foregroundColor?.replace("#", "") || "000000";
  const bgColor = options.backgroundColor?.replace("#", "") || "FFFFFF";
  const size = options.size || 200;

  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(
    text,
  )}&size=${size}x${size}&color=${color}&bgcolor=${bgColor}`;
};

const QRCodeGenerator = () => {
  const { user, profile } = useAuth();
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingQRCode, setEditingQRCode] = useState<QRCode | null>(null);
  const [previewURL, setPreviewURL] = useState<string>("");

  // QR code form state
  const [qrCodeForm, setQRCodeForm] = useState({
    name: "",
    description: "",
    custom_path: "",
    background_color: "#FFFFFF",
    foreground_color: "#000000",
    logo_url: "",
  });

  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadQRCodes();
  }, []);

  useEffect(() => {
    if (selectedQRCode) {
      const menuUrl = `https://menuqr.com/menu/${selectedQRCode.custom_path || selectedQRCode.id}`;
      setPreviewURL(
        generateQRCodeDataURL(menuUrl, {
          foregroundColor: selectedQRCode.foreground_color,
          backgroundColor: selectedQRCode.background_color,
          size: 300,
        }),
      );
    }
  }, [selectedQRCode]);

  const loadQRCodes = async () => {
    setIsLoading(true);
    try {
      const qrCodesData = await getQRCodes();
      setQRCodes(qrCodesData);

      if (qrCodesData.length > 0 && !selectedQRCode) {
        setSelectedQRCode(qrCodesData[0]);
      }
    } catch (error) {
      console.error("Error loading QR codes:", error);
      toast({
        title: "Error",
        description: "Failed to load QR codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQRCodeSelect = (qrCode: QRCode) => {
    setSelectedQRCode(qrCode);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setQRCodeForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openQRCodeDialog = (qrCode?: QRCode) => {
    if (qrCode) {
      setEditingQRCode(qrCode);
      setQRCodeForm({
        name: qrCode.name,
        description: qrCode.description || "",
        custom_path: qrCode.custom_path || "",
        background_color: qrCode.background_color,
        foreground_color: qrCode.foreground_color,
        logo_url: qrCode.logo_url || "",
      });
    } else {
      setEditingQRCode(null);
      setQRCodeForm({
        name: "",
        description: "",
        custom_path: "",
        background_color: "#FFFFFF",
        foreground_color: "#000000",
        logo_url: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSaveQRCode = async () => {
    if (!qrCodeForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "QR code name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingQRCode) {
        // Update existing QR code
        const updatedQRCode = await updateQRCode(editingQRCode.id, qrCodeForm);
        if (updatedQRCode) {
          setSelectedQRCode(updatedQRCode);
        }
        toast({
          title: "QR Code Updated",
          description: "QR code has been updated successfully",
        });
      } else {
        // Create new QR code
        const newQRCode = await createQRCode(qrCodeForm);
        if (newQRCode) {
          setSelectedQRCode(newQRCode);
        }
        toast({
          title: "QR Code Created",
          description: "New QR code has been created successfully",
        });
      }

      // Refresh QR codes
      loadQRCodes();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving QR code:", error);
      toast({
        title: "Error",
        description: "Failed to save QR code",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteQRCode = async (qrCodeId: string) => {
    if (!confirm("Are you sure you want to delete this QR code?")) {
      return;
    }

    try {
      await deleteQRCode(qrCodeId);
      toast({
        title: "QR Code Deleted",
        description: "QR code has been deleted successfully",
      });

      // Refresh QR codes
      loadQRCodes();

      // If the deleted QR code was selected, select another one
      if (selectedQRCode?.id === qrCodeId) {
        const remainingQRCodes = qrCodes.filter((qr) => qr.id !== qrCodeId);
        if (remainingQRCodes.length > 0) {
          setSelectedQRCode(remainingQRCodes[0]);
        } else {
          setSelectedQRCode(null);
        }
      }
    } catch (error) {
      console.error("Error deleting QR code:", error);
      toast({
        title: "Error",
        description: "Failed to delete QR code",
        variant: "destructive",
      });
    }
  };

  const handleDownload = (format: "png" | "svg" | "pdf") => {
    if (!selectedQRCode) return;

    // In a real app, this would generate and download the file
    // For now, we'll just show a toast
    toast({
      title: "Download Started",
      description: `Your QR code is being downloaded as ${format.toUpperCase()}`,
    });

    // Simulate download by opening the image in a new tab (for PNG only)
    if (format === "png" && previewURL) {
      window.open(previewURL, "_blank");
    }
  };

  // Placeholder function for logo upload
  const handleLogoUpload = () => {
    toast({
      title: "Coming Soon",
      description: "Logo upload will be available soon",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading QR code generator...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            QR Code Generator
          </h1>
          <p className="text-muted-foreground mt-1">
            Create and customize QR codes for your digital menu
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={() => openQRCodeDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Create New QR Code
          </Button>
        </div>
      </div>

      {qrCodes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <QrCode className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No QR Codes Yet</h2>
            <p className="text-muted-foreground mb-6">
              Create your first QR code to share your digital menu with
              customers.
            </p>
            <Button onClick={() => openQRCodeDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Create First QR Code
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* QR codes list */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Your QR Codes</CardTitle>
                <CardDescription>
                  Select a QR code to view or edit
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {qrCodes.map((qrCode) => (
                    <div
                      key={qrCode.id}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted ${selectedQRCode?.id === qrCode.id ? "bg-muted" : ""}`}
                      onClick={() => handleQRCodeSelect(qrCode)}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 mr-3 flex-shrink-0">
                          <img
                            src={generateQRCodeDataURL(
                              `https://menuqr.com/menu/${qrCode.custom_path || qrCode.id}`,
                              {
                                foregroundColor: qrCode.foreground_color,
                                backgroundColor: qrCode.background_color,
                                size: 40,
                              },
                            )}
                            alt={qrCode.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div>
                          <p className="font-medium truncate">{qrCode.name}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {qrCode.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openQRCodeDialog(qrCode);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQRCode(qrCode.id);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => openQRCodeDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create New QR Code
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* QR code preview and download */}
          <div className="md:col-span-2">
            {selectedQRCode ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedQRCode.name}</CardTitle>
                    <CardDescription>
                      {selectedQRCode.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div
                      ref={qrCodeRef}
                      className="bg-white p-6 rounded-lg shadow-sm border mb-4"
                      style={{ maxWidth: "300px" }}
                    >
                      <img
                        src={previewURL}
                        alt="QR Code Preview"
                        className="w-full h-auto"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Scan to view your digital menu
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload("png")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PNG
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload("svg")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        SVG
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload("pdf")}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>QR Code Details</CardTitle>
                    <CardDescription>
                      Information about this QR code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Menu URL</p>
                      <p className="text-sm text-muted-foreground break-all">
                        https://menuqr.com/menu/
                        {selectedQRCode.custom_path || selectedQRCode.id}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Created</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedQRCode.created_at,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(
                          selectedQRCode.updated_at,
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Colors</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: selectedQRCode.foreground_color,
                          }}
                        ></div>
                        <p className="text-sm text-muted-foreground">
                          {selectedQRCode.foreground_color}
                        </p>
                        <div
                          className="w-6 h-6 rounded-full border ml-4"
                          style={{
                            backgroundColor: selectedQRCode.background_color,
                          }}
                        ></div>
                        <p className="text-sm text-muted-foreground">
                          {selectedQRCode.background_color}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openQRCodeDialog(selectedQRCode)}
                    >
                      <Edit className="mr-2 h-4 w-4" /> Edit QR Code
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <h2 className="text-xl font-semibold mb-2">
                    No QR Code Selected
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Please select a QR code from the list or create a new one.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingQRCode ? "Edit QR Code" : "Create New QR Code"}
            </DialogTitle>
            <DialogDescription>
              {editingQRCode
                ? "Update your QR code details"
                : "Create a new QR code for your menu"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">QR Code Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Main Menu, Bar Menu"
                  value={qrCodeForm.name}
                  onChange={handleFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this QR code"
                  value={qrCodeForm.description}
                  onChange={handleFormChange}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom_path">Custom URL Path (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    menuqr.com/menu/
                  </span>
                  <Input
                    id="custom_path"
                    name="custom_path"
                    placeholder="my-restaurant-menu"
                    value={qrCodeForm.custom_path}
                    onChange={handleFormChange}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Leave blank to use an automatically generated ID
                </p>
              </div>
            </TabsContent>
            <TabsContent value="appearance" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="foreground_color">QR Code Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: qrCodeForm.foreground_color }}
                    onClick={() =>
                      document.getElementById("foreground_color")?.click()
                    }
                  ></div>
                  <Input
                    id="foreground_color"
                    name="foreground_color"
                    type="color"
                    className="w-24 h-10 p-1"
                    value={qrCodeForm.foreground_color}
                    onChange={handleFormChange}
                  />
                  <Input
                    name="foreground_color"
                    placeholder="#000000"
                    value={qrCodeForm.foreground_color}
                    onChange={handleFormChange}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="background_color">Background Color</Label>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full border cursor-pointer"
                    style={{ backgroundColor: qrCodeForm.background_color }}
                    onClick={() =>
                      document.getElementById("background_color")?.click()
                    }
                  ></div>
                  <Input
                    id="background_color"
                    name="background_color"
                    type="color"
                    className="w-24 h-10 p-1"
                    value={qrCodeForm.background_color}
                    onChange={handleFormChange}
                  />
                  <Input
                    name="background_color"
                    placeholder="#FFFFFF"
                    value={qrCodeForm.background_color}
                    onChange={handleFormChange}
                    className="flex-grow"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL (Optional)</Label>
                <div className="flex space-x-2">
                  <Input
                    id="logo_url"
                    name="logo_url"
                    placeholder="https://example.com/logo.png"
                    value={qrCodeForm.logo_url}
                    onChange={handleFormChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleLogoUpload}
                  >
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Add your restaurant logo to the center of the QR code
                </p>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveQRCode} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingQRCode ? "Update QR Code" : "Create QR Code"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QRCodeGenerator;

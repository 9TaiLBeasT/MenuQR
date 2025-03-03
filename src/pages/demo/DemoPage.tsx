import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import {
  MenuSquare,
  QrCode,
  Smartphone,
  Plus,
  Trash2,
  Download,
  Leaf,
  Wheat,
  Nut,
  ArrowRight,
} from "lucide-react";

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState("menu-builder");
  const [menuItems, setMenuItems] = useState([
    {
      id: "1",
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      price: 12.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      containsNuts: false,
    },
    {
      id: "2",
      name: "Garden Salad",
      description:
        "Fresh mixed greens with seasonal vegetables and vinaigrette",
      price: 8.99,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      containsNuts: false,
    },
    {
      id: "3",
      name: "Chocolate Brownie",
      description: "Rich chocolate brownie with vanilla ice cream",
      price: 6.99,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      containsNuts: true,
    },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    containsNuts: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (field: string, checked: boolean) => {
    setNewItem((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description:
          "Please provide at least a name and price for the menu item",
        variant: "destructive",
      });
      return;
    }

    const price = parseFloat(newItem.price);
    if (isNaN(price)) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const newMenuItem = {
      id: Date.now().toString(),
      name: newItem.name,
      description: newItem.description,
      price,
      isVegetarian: newItem.isVegetarian,
      isVegan: newItem.isVegan,
      isGlutenFree: newItem.isGlutenFree,
      containsNuts: newItem.containsNuts,
    };

    setMenuItems((prev) => [...prev, newMenuItem]);
    setNewItem({
      name: "",
      description: "",
      price: "",
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      containsNuts: false,
    });

    toast({
      title: "Item Added",
      description: `${newItem.name} has been added to your menu`,
    });
  };

  const handleDeleteItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Item Removed",
      description: "Menu item has been removed",
    });
  };

  const handleGenerateQR = () => {
    toast({
      title: "QR Code Generated",
      description:
        "Your demo QR code has been generated. You can now download it or preview the menu.",
    });
    setActiveTab("qr-code");
  };

  const handleDownloadQR = () => {
    toast({
      title: "QR Code Downloaded",
      description: "Your QR code has been downloaded successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Try our digital menu platform without signing up. Create a sample
              menu, generate a QR code, and see how it looks on a mobile device.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
              <TabsTrigger
                value="menu-builder"
                className="flex items-center gap-2"
              >
                <MenuSquare className="h-4 w-4" /> Menu Builder
              </TabsTrigger>
              <TabsTrigger value="qr-code" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" /> QR Code Generator
              </TabsTrigger>
              <TabsTrigger
                value="mobile-preview"
                className="flex items-center gap-2"
              >
                <Smartphone className="h-4 w-4" /> Mobile Preview
              </TabsTrigger>
            </TabsList>

            {/* Menu Builder Tab */}
            <TabsContent value="menu-builder" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Add Menu Items</CardTitle>
                    <CardDescription>
                      Create your digital menu by adding items below.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Item Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="e.g., Margherita Pizza"
                        value={newItem.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Describe your dish..."
                        value={newItem.description}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-muted-foreground">
                          $
                        </span>
                        <Input
                          id="price"
                          name="price"
                          placeholder="0.00"
                          className="pl-8"
                          value={newItem.price}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4">
                      <h3 className="font-medium">Dietary Information</h3>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="isVegetarian"
                          className="cursor-pointer"
                        >
                          Vegetarian
                        </Label>
                        <Switch
                          id="isVegetarian"
                          checked={newItem.isVegetarian}
                          onCheckedChange={(checked) =>
                            handleToggleChange("isVegetarian", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="isVegan" className="cursor-pointer">
                          Vegan
                        </Label>
                        <Switch
                          id="isVegan"
                          checked={newItem.isVegan}
                          onCheckedChange={(checked) =>
                            handleToggleChange("isVegan", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="isGlutenFree"
                          className="cursor-pointer"
                        >
                          Gluten-Free
                        </Label>
                        <Switch
                          id="isGlutenFree"
                          checked={newItem.isGlutenFree}
                          onCheckedChange={(checked) =>
                            handleToggleChange("isGlutenFree", checked)
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="containsNuts"
                          className="cursor-pointer"
                        >
                          Contains Nuts
                        </Label>
                        <Switch
                          id="containsNuts"
                          checked={newItem.containsNuts}
                          onCheckedChange={(checked) =>
                            handleToggleChange("containsNuts", checked)
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleAddItem} className="w-full">
                      <Plus className="mr-2 h-4 w-4" /> Add to Menu
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Your Menu</CardTitle>
                    <CardDescription>
                      {menuItems.length === 0
                        ? "Your menu is empty. Add some items to get started."
                        : `${menuItems.length} items in your menu`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {menuItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <MenuSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No menu items yet</p>
                        </div>
                      ) : (
                        menuItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-4 border rounded-lg flex justify-between items-start hover:bg-muted/50 transition-colors"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{item.name}</h3>
                                <span className="font-semibold text-primary">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                              {item.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {item.description}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-2">
                                {item.isVegetarian && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                  >
                                    <Leaf className="h-3 w-3" /> Vegetarian
                                  </Badge>
                                )}
                                {item.isVegan && (
                                  <Badge
                                    variant="outline"
                                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                  >
                                    <Leaf className="h-3 w-3" /> Vegan
                                  </Badge>
                                )}
                                {item.isGlutenFree && (
                                  <Badge
                                    variant="outline"
                                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                                  >
                                    <Wheat className="h-3 w-3" /> Gluten-Free
                                  </Badge>
                                )}
                                {item.containsNuts && (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                                  >
                                    <Nut className="h-3 w-3" /> Contains Nuts
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteItem(item.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMenuItems([]);
                        toast({
                          title: "Menu Cleared",
                          description: "All menu items have been removed",
                        });
                      }}
                      disabled={menuItems.length === 0}
                    >
                      Clear All
                    </Button>
                    <Button
                      onClick={handleGenerateQR}
                      disabled={menuItems.length === 0}
                    >
                      Generate QR Code
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* QR Code Generator Tab */}
            <TabsContent value="qr-code" className="mt-6">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader className="text-center">
                    <CardTitle>Your QR Code</CardTitle>
                    <CardDescription>
                      Scan this QR code with your phone to view your digital
                      menu
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?data=https://menuqr.com/demo-menu&size=250x250&color=0f766e"
                        alt="Demo QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-md">
                      <Button variant="outline" onClick={handleDownloadQR}>
                        <Download className="mr-2 h-4 w-4" /> PNG
                      </Button>
                      <Button variant="outline" onClick={handleDownloadQR}>
                        <Download className="mr-2 h-4 w-4" /> SVG
                      </Button>
                      <Button variant="outline" onClick={handleDownloadQR}>
                        <Download className="mr-2 h-4 w-4" /> PDF
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center">
                    <Button onClick={() => setActiveTab("mobile-preview")}>
                      Preview Menu <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            {/* Mobile Preview Tab */}
            <TabsContent value="mobile-preview" className="mt-6">
              <div className="max-w-md mx-auto">
                <div className="border-8 border-gray-800 rounded-[40px] overflow-hidden shadow-xl bg-white">
                  <div className="h-6 bg-gray-800 flex items-center justify-center">
                    <div className="w-20 h-1 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="h-[600px] overflow-y-auto">
                    <div className="bg-primary/10 p-4 sticky top-0 z-10 backdrop-blur-sm border-b">
                      <h1 className="text-xl font-bold">Demo Restaurant</h1>
                      <p className="text-sm text-muted-foreground">
                        Digital Menu
                      </p>
                    </div>

                    <div className="p-4">
                      <h2 className="text-lg font-semibold mb-4">Our Menu</h2>

                      {menuItems.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No menu items available</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {menuItems.map((item) => (
                            <div
                              key={item.id}
                              className="border rounded-lg overflow-hidden"
                            >
                              <div className="p-4">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-medium">{item.name}</h3>
                                  <span className="font-semibold">
                                    ${item.price.toFixed(2)}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {item.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-1 mt-2">
                                  {item.isVegetarian && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                    >
                                      <Leaf className="h-3 w-3" /> Veg
                                    </Badge>
                                  )}
                                  {item.isVegan && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                                    >
                                      <Leaf className="h-3 w-3" /> Vegan
                                    </Badge>
                                  )}
                                  {item.isGlutenFree && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                                    >
                                      <Wheat className="h-3 w-3" /> GF
                                    </Badge>
                                  )}
                                  {item.containsNuts && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                                    >
                                      <Nut className="h-3 w-3" /> Nuts
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="h-1 bg-gray-800"></div>
                </div>

                <div className="text-center mt-8">
                  <p className="text-muted-foreground mb-4">
                    This is how your menu will appear on your customers' phones
                    when they scan your QR code.
                  </p>
                  <Button asChild>
                    <Link to="/">Get Started For Free</Link>
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DemoPage;

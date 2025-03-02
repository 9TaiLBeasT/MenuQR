import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
} from "@/lib/menu";
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  MenuItem,
  updateMenuItemOrder,
} from "@/lib/menu";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  MoveVertical,
  Image,
  DollarSign,
  Utensils,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";
import MenuPreview from "@/components/menu/MenuPreview";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

const MenuBuilder = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Dialog states
  const [isCategoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [isMenuItemDialogOpen, setMenuItemDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [menuItemForm, setMenuItemForm] = useState({
    name: "",
    description: "",
    price: "",
    price_variations: [] as { name: string; price: number }[],
    image_url: "",
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    contains_nuts: false,
    spice_level: 0,
    is_available: true,
  });

  // State for drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  // State for price variations
  const [showPriceVariations, setShowPriceVariations] = useState(false);
  const [variationName, setVariationName] = useState("");
  const [variationPrice, setVariationPrice] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);

      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].id);
        loadMenuItems(categoriesData[0].id);
      } else if (selectedCategory) {
        loadMenuItems(selectedCategory);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Error",
        description: "Failed to load menu categories",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuItems = async (categoryId: string) => {
    try {
      const items = await getMenuItems(categoryId);
      setMenuItems(items);
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadMenuItems(categoryId);
  };

  const handleCategoryFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCategoryForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuItemFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setMenuItemForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (field: string, checked: boolean) => {
    setMenuItemForm((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const openCategoryDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        description: category.description || "",
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: "",
        description: "",
      });
    }
    setCategoryDialogOpen(true);
  };

  const openMenuItemDialog = (item?: MenuItem) => {
    if (item) {
      setEditingMenuItem(item);
      setMenuItemForm({
        name: item.name,
        description: item.description || "",
        price: item.price.toString(),
        price_variations: item.price_variations || [],
        image_url: item.image_url || "",
        is_vegetarian: item.is_vegetarian,
        is_vegan: item.is_vegan,
        is_gluten_free: item.is_gluten_free,
        contains_nuts: item.contains_nuts,
        spice_level: item.spice_level,
        is_available: item.is_available,
      });
      setShowPriceVariations(
        !!item.price_variations && item.price_variations.length > 0,
      );
    } else {
      setEditingMenuItem(null);
      setMenuItemForm({
        name: "",
        description: "",
        price: "",
        price_variations: [],
        image_url: "",
        is_vegetarian: false,
        is_vegan: false,
        is_gluten_free: false,
        contains_nuts: false,
        spice_level: 0,
        is_available: true,
      });
      setShowPriceVariations(false);
    }
    setVariationName("");
    setVariationPrice("");
    setMenuItemDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      if (editingCategory) {
        // Update existing category
        await updateCategory(editingCategory.id, {
          name: categoryForm.name,
          description: categoryForm.description,
        });
        toast({
          title: "Category Updated",
          description: "Menu category has been updated successfully",
        });
      } else {
        // Create new category
        const newCategory = await createCategory({
          name: categoryForm.name,
          description: categoryForm.description,
          display_order: categories.length,
        });

        if (newCategory) {
          setSelectedCategory(newCategory.id);
        }

        toast({
          title: "Category Created",
          description: "New menu category has been created successfully",
        });
      }

      // Refresh categories
      loadCategories();
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save menu category",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this category? All menu items in this category will also be deleted.",
      )
    ) {
      return;
    }

    try {
      await deleteCategory(categoryId);
      toast({
        title: "Category Deleted",
        description: "Menu category has been deleted successfully",
      });

      // Refresh categories
      loadCategories();

      // If the deleted category was selected, select the first available category
      if (selectedCategory === categoryId) {
        const remainingCategories = categories.filter(
          (c) => c.id !== categoryId,
        );
        if (remainingCategories.length > 0) {
          setSelectedCategory(remainingCategories[0].id);
          loadMenuItems(remainingCategories[0].id);
        } else {
          setSelectedCategory(null);
          setMenuItems([]);
        }
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu category",
        variant: "destructive",
      });
    }
  };

  const handleSaveMenuItem = async () => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select or create a category first",
        variant: "destructive",
      });
      return;
    }

    if (!menuItemForm.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Menu item name is required",
        variant: "destructive",
      });
      return;
    }

    // Validate price based on whether we're using variations or not
    if (showPriceVariations) {
      if (menuItemForm.price_variations.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one price variation",
          variant: "destructive",
        });
        return;
      }
    } else {
      if (!menuItemForm.price.trim() || isNaN(parseFloat(menuItemForm.price))) {
        toast({
          title: "Validation Error",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        return;
      }
    }

    setIsSaving(true);

    try {
      const itemData = {
        name: menuItemForm.name,
        description: menuItemForm.description,
        price: showPriceVariations
          ? menuItemForm.price_variations[0]?.price ||
            parseFloat(menuItemForm.price)
          : parseFloat(menuItemForm.price),
        price_variations: showPriceVariations
          ? menuItemForm.price_variations
          : null,
        image_url: menuItemForm.image_url,
        is_vegetarian: menuItemForm.is_vegetarian,
        is_vegan: menuItemForm.is_vegan,
        is_gluten_free: menuItemForm.is_gluten_free,
        contains_nuts: menuItemForm.contains_nuts,
        spice_level: menuItemForm.spice_level,
        is_available: menuItemForm.is_available,
      };

      if (editingMenuItem) {
        // Update existing menu item
        await updateMenuItem(editingMenuItem.id, itemData);
        toast({
          title: "Menu Item Updated",
          description: "Menu item has been updated successfully",
        });
      } else {
        // Create new menu item
        await createMenuItem({
          ...itemData,
          category_id: selectedCategory,
          display_order: menuItems.length,
        });
        toast({
          title: "Menu Item Created",
          description: "New menu item has been created successfully",
        });
      }

      // Refresh menu items
      loadMenuItems(selectedCategory);
      setMenuItemDialogOpen(false);
    } catch (error) {
      console.error("Error saving menu item:", error);
      toast({
        title: "Error",
        description: "Failed to save menu item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding a price variation
  const handleAddPriceVariation = () => {
    if (!variationName.trim()) {
      toast({
        title: "Validation Error",
        description: "Variation name is required",
        variant: "destructive",
      });
      return;
    }

    if (!variationPrice.trim() || isNaN(parseFloat(variationPrice))) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    const newVariation = {
      name: variationName,
      price: parseFloat(variationPrice),
    };

    setMenuItemForm((prev) => ({
      ...prev,
      price_variations: [...prev.price_variations, newVariation],
    }));

    setVariationName("");
    setVariationPrice("");
  };

  // Handle removing a price variation
  const handleRemovePriceVariation = (index: number) => {
    setMenuItemForm((prev) => ({
      ...prev,
      price_variations: prev.price_variations.filter((_, i) => i !== index),
    }));
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setIsDragging(true);
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
    // Add a transparent image to prevent default drag ghost
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent, itemId: string) => {
    e.preventDefault();
    if (draggedItem === itemId) return;

    // Find the positions of the dragged item and the target item
    const draggedIndex = menuItems.findIndex((item) => item.id === draggedItem);
    const targetIndex = menuItems.findIndex((item) => item.id === itemId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    // Create a new array with the items in the new order
    const newItems = [...menuItems];
    const [draggedItemObj] = newItems.splice(draggedIndex, 1);
    newItems.splice(targetIndex, 0, draggedItemObj);

    // Update the display order
    const updatedItems = newItems.map((item, index) => ({
      ...item,
      display_order: index,
    }));

    setMenuItems(updatedItems);
  };

  // Handle drag end
  const handleDragEnd = async () => {
    setIsDragging(false);
    setDraggedItem(null);

    if (selectedCategory) {
      // Save the new order to the database
      const orderData = menuItems.map((item, index) => ({
        id: item.id,
        display_order: index,
      }));

      try {
        await updateMenuItemOrder(orderData);
      } catch (error) {
        console.error("Error updating menu item order:", error);
        toast({
          title: "Error",
          description: "Failed to save menu item order",
          variant: "destructive",
        });
        // Reload the original order
        loadMenuItems(selectedCategory);
      }
    }
  };

  const handleDeleteMenuItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this menu item?")) {
      return;
    }

    try {
      await deleteMenuItem(itemId);
      toast({
        title: "Menu Item Deleted",
        description: "Menu item has been deleted successfully",
      });

      // Refresh menu items
      if (selectedCategory) {
        loadMenuItems(selectedCategory);
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
      toast({
        title: "Error",
        description: "Failed to delete menu item",
        variant: "destructive",
      });
    }
  };

  // Placeholder function for image upload
  const handleImageUpload = () => {
    toast({
      title: "Coming Soon",
      description: "Image upload will be available soon",
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading menu builder...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Builder</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage your digital menu
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={() => openCategoryDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
          <Button
            variant="outline"
            onClick={() => openMenuItemDialog()}
            disabled={!selectedCategory}
          >
            <Plus className="mr-2 h-4 w-4" /> Add Menu Item
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Utensils className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">
              No Menu Categories Yet
            </h2>
            <p className="text-muted-foreground mb-6">
              Start by creating your first menu category, then add items to it.
            </p>
            <Button onClick={() => openCategoryDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Create First Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Categories sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-muted ${selectedCategory === category.id ? "bg-muted" : ""}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      <span className="font-medium truncate">
                        {category.name}
                      </span>
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
                              openCategoryDialog(category);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id);
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
                  onClick={() => openCategoryDialog()}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Menu items and preview */}
          <div className="md:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Menu items */}
            <div>
              {selectedCategory ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {categories.find((c) => c.id === selectedCategory)
                        ?.name || "Menu Items"}
                    </CardTitle>
                    <CardDescription>
                      {categories.find((c) => c.id === selectedCategory)
                        ?.description || "Manage items in this category"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {menuItems.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          No items in this category yet
                        </p>
                        <Button onClick={() => openMenuItemDialog()}>
                          <Plus className="mr-2 h-4 w-4" /> Add First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {menuItems.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-start p-4 border rounded-lg hover:bg-muted/50 ${isDragging && draggedItem === item.id ? "opacity-50" : ""}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, item.id)}
                            onDragOver={(e) => handleDragOver(e, item.id)}
                            onDragEnd={handleDragEnd}
                          >
                            <div className="flex-shrink-0 mr-4">
                              {item.image_url ? (
                                <img
                                  src={item.image_url}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-md"
                                />
                              ) : (
                                <div className="w-20 h-20 bg-muted rounded-md flex items-center justify-center">
                                  <Image className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-grow">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="font-medium">{item.name}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                  <div className="flex items-center mt-1">
                                    <span className="font-medium text-primary">
                                      {item.price_variations &&
                                      item.price_variations.length > 0 ? (
                                        <>
                                          From $
                                          {Math.min(
                                            ...item.price_variations.map(
                                              (v) => v.price,
                                            ),
                                          ).toFixed(2)}
                                        </>
                                      ) : (
                                        <>${item.price.toFixed(2)}</>
                                      )}
                                    </span>
                                    <div className="flex ml-4 space-x-2">
                                      {item.is_vegetarian && (
                                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                          Vegetarian
                                        </span>
                                      )}
                                      {item.is_vegan && (
                                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                          Vegan
                                        </span>
                                      )}
                                      {item.is_gluten_free && (
                                        <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                          Gluten-Free
                                        </span>
                                      )}
                                      {item.contains_nuts && (
                                        <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">
                                          Contains Nuts
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openMenuItemDialog(item)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-destructive hover:text-destructive"
                                    onClick={() =>
                                      handleDeleteMenuItem(item.id)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                  <div
                                    className="cursor-move"
                                    title="Drag to reorder"
                                  >
                                    <MoveVertical className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => openMenuItemDialog()}
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Menu Item
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card className="text-center py-12">
                  <CardContent>
                    <h2 className="text-xl font-semibold mb-2">
                      No Category Selected
                    </h2>
                    <p className="text-muted-foreground mb-4">
                      Please select a category from the sidebar or create a new
                      one.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Live preview */}
            <div className="hidden lg:block">
              <MenuPreview
                categories={categories}
                menuItems={menuItems}
                selectedCategory={selectedCategory}
              />
            </div>
          </div>
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={isCategoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update your menu category details"
                : "Create a new menu category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Appetizers, Main Course, Desserts"
                value={categoryForm.name}
                onChange={handleCategoryFormChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of this category"
                value={categoryForm.description}
                onChange={handleCategoryFormChange}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Menu Item Dialog */}
      <Dialog open={isMenuItemDialogOpen} onOpenChange={setMenuItemDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMenuItem ? "Edit Menu Item" : "Add New Menu Item"}
            </DialogTitle>
            <DialogDescription>
              {editingMenuItem
                ? "Update your menu item details"
                : "Create a new menu item"}
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="basic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="details">Details & Dietary</TabsTrigger>
            </TabsList>
            <TabsContent value="basic" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Caesar Salad, Margherita Pizza"
                  value={menuItemForm.name}
                  onChange={handleMenuItemFormChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the dish, ingredients, etc."
                  value={menuItemForm.description}
                  onChange={handleMenuItemFormChange}
                  rows={3}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="price_variations">Price Variations</Label>
                    <p className="text-sm text-muted-foreground">
                      Add different sizes or options with different prices
                    </p>
                  </div>
                  <Switch
                    id="price_variations"
                    checked={showPriceVariations}
                    onCheckedChange={setShowPriceVariations}
                  />
                </div>

                {showPriceVariations ? (
                  <div className="space-y-4 border rounded-md p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="variation_name">Variation Name</Label>
                        <Input
                          id="variation_name"
                          placeholder="e.g., Small, Medium, Large"
                          value={variationName}
                          onChange={(e) => setVariationName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="variation_price">Price</Label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="variation_price"
                            placeholder="0.00"
                            className="pl-10"
                            value={variationPrice}
                            onChange={(e) => setVariationPrice(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddPriceVariation}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Variation
                    </Button>

                    {menuItemForm.price_variations.length > 0 && (
                      <div className="space-y-2 mt-4">
                        <Label>Current Variations</Label>
                        <div className="space-y-2">
                          {menuItemForm.price_variations.map(
                            (variation, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 border rounded-md"
                              >
                                <span>{variation.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">
                                    ${variation.price.toFixed(2)}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-destructive hover:text-destructive"
                                    onClick={() =>
                                      handleRemovePriceVariation(index)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="price"
                          name="price"
                          placeholder="0.00"
                          className="pl-10"
                          value={menuItemForm.price}
                          onChange={handleMenuItemFormChange}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="image_url">Image URL</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="image_url"
                          name="image_url"
                          placeholder="https://example.com/image.jpg"
                          value={menuItemForm.image_url}
                          onChange={handleMenuItemFormChange}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={handleImageUpload}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_vegetarian">Vegetarian</Label>
                    <p className="text-sm text-muted-foreground">
                      This dish contains no meat
                    </p>
                  </div>
                  <Switch
                    id="is_vegetarian"
                    checked={menuItemForm.is_vegetarian}
                    onCheckedChange={(checked) =>
                      handleToggleChange("is_vegetarian", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_vegan">Vegan</Label>
                    <p className="text-sm text-muted-foreground">
                      This dish contains no animal products
                    </p>
                  </div>
                  <Switch
                    id="is_vegan"
                    checked={menuItemForm.is_vegan}
                    onCheckedChange={(checked) =>
                      handleToggleChange("is_vegan", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_gluten_free">Gluten Free</Label>
                    <p className="text-sm text-muted-foreground">
                      This dish contains no gluten
                    </p>
                  </div>
                  <Switch
                    id="is_gluten_free"
                    checked={menuItemForm.is_gluten_free}
                    onCheckedChange={(checked) =>
                      handleToggleChange("is_gluten_free", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="contains_nuts">Contains Nuts</Label>
                    <p className="text-sm text-muted-foreground">
                      This dish contains nuts or nut products
                    </p>
                  </div>
                  <Switch
                    id="contains_nuts"
                    checked={menuItemForm.contains_nuts}
                    onCheckedChange={(checked) =>
                      handleToggleChange("contains_nuts", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_available">Available</Label>
                    <p className="text-sm text-muted-foreground">
                      This item is currently available on the menu
                    </p>
                  </div>
                  <Switch
                    id="is_available"
                    checked={menuItemForm.is_available}
                    onCheckedChange={(checked) =>
                      handleToggleChange("is_available", checked)
                    }
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMenuItemDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMenuItem} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingMenuItem ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuBuilder;

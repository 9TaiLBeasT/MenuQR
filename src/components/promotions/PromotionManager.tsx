import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  Loader2,
  Plus,
  Trash2,
  Edit,
  Calendar,
  DollarSign,
  Tag,
  Percent,
} from "lucide-react";
import { format } from "date-fns";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string;
  end_date: string;
  banner_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  menu_items?: string[];
}

interface MenuItem {
  id: string;
  name: string;
  category_name: string;
  price: number;
}

const PromotionManager: React.FC = () => {
  const { user } = useAuth();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
    null,
  );

  // Form state
  const [promotionForm, setPromotionForm] = useState({
    title: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed_amount",
    discount_value: "",
    start_date: "",
    end_date: "",
    banner_image_url: "",
    is_active: true,
    menu_items: [] as string[],
  });

  useEffect(() => {
    loadPromotions();
    loadMenuItems();
  }, []);

  const loadPromotions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First get all promotions
      const { data: promotionsData, error: promotionsError } = await supabase
        .from("promotions")
        .select("*")
        .eq("profile_id", user.id)
        .order("created_at", { ascending: false });

      if (promotionsError) throw promotionsError;

      // Then get promotion-menu item relationships
      const { data: relationshipsData, error: relationshipsError } =
        await supabase
          .from("promotion_menu_items")
          .select("promotion_id, menu_item_id");

      if (relationshipsError) throw relationshipsError;

      // Map menu items to promotions
      const promotionsWithItems = promotionsData.map((promotion) => {
        const menuItemIds = relationshipsData
          .filter((rel) => rel.promotion_id === promotion.id)
          .map((rel) => rel.menu_item_id);

        return {
          ...promotion,
          menu_items: menuItemIds,
        };
      });

      setPromotions(promotionsWithItems);
    } catch (error) {
      console.error("Error loading promotions:", error);
      toast({
        title: "Error",
        description: "Failed to load promotions",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMenuItems = async () => {
    if (!user) return;

    try {
      // Get all menu items with their category names
      const { data, error } = await supabase
        .from("menu_items")
        .select(
          `
          id,
          name,
          price,
          categories!inner(name)
        `,
        )
        .order("name");

      if (error) throw error;

      // Format the data
      const formattedItems = data.map((item) => ({
        id: item.id,
        name: item.name,
        category_name: item.categories.name,
        price: item.price,
      }));

      setMenuItems(formattedItems);
    } catch (error) {
      console.error("Error loading menu items:", error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setPromotionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleChange = (field: string, checked: boolean) => {
    setPromotionForm((prev) => ({
      ...prev,
      [field]: checked,
    }));
  };

  const handleMenuItemToggle = (itemId: string) => {
    setPromotionForm((prev) => {
      const isSelected = prev.menu_items.includes(itemId);
      return {
        ...prev,
        menu_items: isSelected
          ? prev.menu_items.filter((id) => id !== itemId)
          : [...prev.menu_items, itemId],
      };
    });
  };

  const openPromotionDialog = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setPromotionForm({
        title: promotion.title,
        description: promotion.description || "",
        discount_type: promotion.discount_type,
        discount_value: promotion.discount_value.toString(),
        start_date: format(new Date(promotion.start_date), "yyyy-MM-dd"),
        end_date: format(new Date(promotion.end_date), "yyyy-MM-dd"),
        banner_image_url: promotion.banner_image_url || "",
        is_active: promotion.is_active,
        menu_items: promotion.menu_items || [],
      });
    } else {
      setEditingPromotion(null);
      setPromotionForm({
        title: "",
        description: "",
        discount_type: "percentage",
        discount_value: "",
        start_date: format(new Date(), "yyyy-MM-dd"),
        end_date: format(
          new Date(new Date().setDate(new Date().getDate() + 7)),
          "yyyy-MM-dd",
        ),
        banner_image_url: "",
        is_active: true,
        menu_items: [],
      });
    }
    setIsDialogOpen(true);
  };

  const handleSavePromotion = async () => {
    if (!user) return;

    // Validation
    if (!promotionForm.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Promotion title is required",
        variant: "destructive",
      });
      return;
    }

    if (
      !promotionForm.discount_value.trim() ||
      isNaN(parseFloat(promotionForm.discount_value))
    ) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid discount value",
        variant: "destructive",
      });
      return;
    }

    if (!promotionForm.start_date || !promotionForm.end_date) {
      toast({
        title: "Validation Error",
        description: "Start and end dates are required",
        variant: "destructive",
      });
      return;
    }

    if (new Date(promotionForm.end_date) < new Date(promotionForm.start_date)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    if (promotionForm.menu_items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select at least one menu item for this promotion",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let promotionId;

      if (editingPromotion) {
        // Update existing promotion
        const { data, error } = await supabase
          .from("promotions")
          .update({
            title: promotionForm.title,
            description: promotionForm.description || null,
            discount_type: promotionForm.discount_type,
            discount_value: parseFloat(promotionForm.discount_value),
            start_date: new Date(promotionForm.start_date).toISOString(),
            end_date: new Date(promotionForm.end_date).toISOString(),
            banner_image_url: promotionForm.banner_image_url || null,
            is_active: promotionForm.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPromotion.id)
          .select()
          .single();

        if (error) throw error;
        promotionId = editingPromotion.id;

        // Delete existing menu item relationships
        const { error: deleteError } = await supabase
          .from("promotion_menu_items")
          .delete()
          .eq("promotion_id", promotionId);

        if (deleteError) throw deleteError;
      } else {
        // Create new promotion
        const { data, error } = await supabase
          .from("promotions")
          .insert({
            profile_id: user.id,
            title: promotionForm.title,
            description: promotionForm.description || null,
            discount_type: promotionForm.discount_type,
            discount_value: parseFloat(promotionForm.discount_value),
            start_date: new Date(promotionForm.start_date).toISOString(),
            end_date: new Date(promotionForm.end_date).toISOString(),
            banner_image_url: promotionForm.banner_image_url || null,
            is_active: promotionForm.is_active,
          })
          .select()
          .single();

        if (error) throw error;
        promotionId = data.id;
      }

      // Insert menu item relationships
      if (promotionForm.menu_items.length > 0) {
        const menuItemRelationships = promotionForm.menu_items.map(
          (menuItemId) => ({
            promotion_id: promotionId,
            menu_item_id: menuItemId,
          }),
        );

        const { error: relationshipError } = await supabase
          .from("promotion_menu_items")
          .insert(menuItemRelationships);

        if (relationshipError) throw relationshipError;
      }

      toast({
        title: editingPromotion ? "Promotion Updated" : "Promotion Created",
        description: editingPromotion
          ? "Your promotion has been updated successfully"
          : "New promotion has been created successfully",
      });

      // Refresh promotions
      loadPromotions();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast({
        title: "Error",
        description: "Failed to save promotion",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePromotion = async (promotionId: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) {
      return;
    }

    try {
      // Delete the promotion (cascade will handle relationships)
      const { error } = await supabase
        .from("promotions")
        .delete()
        .eq("id", promotionId);

      if (error) throw error;

      toast({
        title: "Promotion Deleted",
        description: "Promotion has been deleted successfully",
      });

      // Refresh promotions
      loadPromotions();
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast({
        title: "Error",
        description: "Failed to delete promotion",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (promotionId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("promotions")
        .update({ is_active: !isActive, updated_at: new Date().toISOString() })
        .eq("id", promotionId);

      if (error) throw error;

      toast({
        title: isActive ? "Promotion Deactivated" : "Promotion Activated",
        description: `Promotion has been ${isActive ? "deactivated" : "activated"} successfully`,
      });

      // Refresh promotions
      loadPromotions();
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast({
        title: "Error",
        description: "Failed to update promotion status",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading promotions...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Promotions & Special Offers</h2>
        <Button onClick={() => openPromotionDialog()}>
          <Plus className="mr-2 h-4 w-4" /> Create Promotion
        </Button>
      </div>

      {promotions.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Tag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Promotions Yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first promotion to attract more customers and boost
              sales.
            </p>
            <Button onClick={() => openPromotionDialog()}>
              <Plus className="mr-2 h-4 w-4" /> Create First Promotion
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map((promotion) => {
            const isExpired = new Date(promotion.end_date) < new Date();
            const isUpcoming = new Date(promotion.start_date) > new Date();
            const isActive = promotion.is_active && !isExpired && !isUpcoming;

            return (
              <Card
                key={promotion.id}
                className={`overflow-hidden ${!isActive ? "opacity-70" : ""}`}
              >
                {promotion.banner_image_url ? (
                  <div className="h-40 overflow-hidden">
                    <img
                      src={promotion.banner_image_url}
                      alt={promotion.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-40 bg-primary/10 flex items-center justify-center">
                    {promotion.discount_type === "percentage" ? (
                      <Percent className="h-16 w-16 text-primary/40" />
                    ) : (
                      <DollarSign className="h-16 w-16 text-primary/40" />
                    )}
                  </div>
                )}

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{promotion.title}</CardTitle>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openPromotionDialog(promotion)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeletePromotion(promotion.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {promotion.discount_type === "percentage" ? (
                      <span className="font-semibold text-lg">
                        {promotion.discount_value}% off
                      </span>
                    ) : (
                      <span className="font-semibold text-lg">
                        ${promotion.discount_value.toFixed(2)} off
                      </span>
                    )}
                    {promotion.description && (
                      <p className="mt-1">{promotion.description}</p>
                    )}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>
                        {new Date(promotion.start_date).toLocaleDateString()} -{" "}
                        {new Date(promotion.end_date).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-sm">
                      <p className="font-medium mb-1">
                        Applied to {promotion.menu_items?.length || 0} items:
                      </p>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {menuItems
                          .filter((item) =>
                            promotion.menu_items?.includes(item.id),
                          )
                          .slice(0, 3)
                          .map((item) => (
                            <li key={item.id} className="truncate">
                              {item.name}
                            </li>
                          ))}
                        {(promotion.menu_items?.length || 0) > 3 && (
                          <li>
                            And {(promotion.menu_items?.length || 0) - 3}{" "}
                            more...
                          </li>
                        )}
                      </ul>
                    </div>

                    {(isExpired || isUpcoming) && (
                      <div className="mt-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${isExpired ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}
                        >
                          {isExpired ? "Expired" : "Upcoming"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                  <div className="flex items-center">
                    <Label htmlFor={`active-${promotion.id}`} className="mr-2">
                      Active
                    </Label>
                    <Switch
                      id={`active-${promotion.id}`}
                      checked={promotion.is_active}
                      onCheckedChange={() =>
                        handleToggleActive(promotion.id, promotion.is_active)
                      }
                      disabled={isExpired}
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openPromotionDialog(promotion)}
                  >
                    Edit Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Promotion Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? "Edit Promotion" : "Create New Promotion"}
            </DialogTitle>
            <DialogDescription>
              {editingPromotion
                ? "Update your promotion details"
                : "Create a new special offer for your customers"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column - Promotion details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Promotion Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., Summer Special, Happy Hour"
                  value={promotionForm.title}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of this promotion"
                  value={promotionForm.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <select
                    id="discount_type"
                    name="discount_type"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={promotionForm.discount_type}
                    onChange={handleInputChange}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed_amount">Fixed Amount ($)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount_value">Discount Value</Label>
                  <div className="relative">
                    {promotionForm.discount_type === "fixed_amount" ? (
                      <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    )}
                    <Input
                      id="discount_value"
                      name="discount_value"
                      placeholder={
                        promotionForm.discount_type === "percentage"
                          ? "10"
                          : "5.00"
                      }
                      className="pl-10"
                      value={promotionForm.discount_value}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={promotionForm.start_date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={promotionForm.end_date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="banner_image_url">
                  Banner Image URL (Optional)
                </Label>
                <Input
                  id="banner_image_url"
                  name="banner_image_url"
                  placeholder="https://example.com/banner.jpg"
                  value={promotionForm.banner_image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable or disable this promotion
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={promotionForm.is_active}
                  onCheckedChange={(checked) =>
                    handleToggleChange("is_active", checked)
                  }
                />
              </div>
            </div>

            {/* Right column - Menu items selection */}
            <div className="space-y-4">
              <div>
                <Label className="mb-2 block">Select Menu Items</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose which menu items this promotion applies to
                </p>

                <div className="border rounded-md h-[300px] overflow-y-auto p-2">
                  {menuItems.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      No menu items available. Please create menu items first.
                    </p>
                  ) : (
                    <div className="space-y-1">
                      {/* Group by category */}
                      {Array.from(
                        new Set(menuItems.map((item) => item.category_name)),
                      ).map((categoryName) => (
                        <div key={categoryName} className="mb-3">
                          <h4 className="font-medium text-sm mb-1">
                            {categoryName}
                          </h4>
                          {menuItems
                            .filter(
                              (item) => item.category_name === categoryName,
                            )
                            .map((item) => (
                              <div
                                key={item.id}
                                className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-muted/50 ${promotionForm.menu_items.includes(item.id) ? "bg-primary/10" : ""}`}
                                onClick={() => handleMenuItemToggle(item.id)}
                              >
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={promotionForm.menu_items.includes(
                                      item.id,
                                    )}
                                    onChange={() => {}}
                                    className="mr-2"
                                  />
                                  <span>{item.name}</span>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  ${item.price.toFixed(2)}
                                </span>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  {promotionForm.menu_items.length} items selected
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePromotion} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Promotion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PromotionManager;

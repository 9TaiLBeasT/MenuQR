import React, { useState, useEffect } from "react";
import { getPublicMenu } from "@/lib/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Utensils, Leaf, Wheat, Nut } from "lucide-react";

interface CustomerMenuProps {
  profileId: string;
}

interface MenuCategory {
  category_id: string;
  category_name: string;
  category_description: string | null;
  category_order: number;
  items: MenuItem[];
}

interface MenuItem {
  item_id: string;
  item_name: string;
  item_description: string | null;
  item_price: number;
  item_price_variations: { name: string; price: number }[] | null;
  item_image_url: string | null;
  item_is_vegetarian: boolean;
  item_is_vegan: boolean;
  item_is_gluten_free: boolean;
  item_contains_nuts: boolean;
  item_spice_level: number;
  item_order: number;
}

const CustomerMenu: React.FC<CustomerMenuProps> = ({ profileId }) => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [businessInfo, setBusinessInfo] = useState({ name: "", logo: "" });
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setIsLoading(true);
        const menuData = await getPublicMenu(profileId);

        if (menuData && menuData.length > 0) {
          // Extract business info
          setBusinessInfo({
            name: menuData[0].business_name || "Restaurant Menu",
            logo: menuData[0].business_logo || "",
          });

          // Group items by category
          const categoriesMap = new Map<string, MenuCategory>();

          menuData.forEach((item) => {
            if (!categoriesMap.has(item.category_id)) {
              categoriesMap.set(item.category_id, {
                category_id: item.category_id,
                category_name: item.category_name,
                category_description: item.category_description,
                category_order: item.category_order,
                items: [],
              });
            }

            const category = categoriesMap.get(item.category_id);
            if (category) {
              category.items.push({
                item_id: item.item_id,
                item_name: item.item_name,
                item_description: item.item_description,
                item_price: item.item_price,
                item_price_variations: item.item_price_variations,
                item_image_url: item.item_image_url,
                item_is_vegetarian: item.item_is_vegetarian,
                item_is_vegan: item.item_is_vegan,
                item_is_gluten_free: item.item_is_gluten_free,
                item_contains_nuts: item.item_contains_nuts,
                item_spice_level: item.item_spice_level,
                item_order: item.item_order,
              });
            }
          });

          // Convert map to array and sort by display order
          const categoriesArray = Array.from(categoriesMap.values()).sort(
            (a, b) => a.category_order - b.category_order,
          );

          setCategories(categoriesArray);

          // Set initial active category
          if (categoriesArray.length > 0) {
            setActiveCategory(categoriesArray[0].category_id);
          }
        }
      } catch (error) {
        console.error("Error fetching menu:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenu();
  }, [profileId]);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
  };

  const closeItemDetails = () => {
    setSelectedItem(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p>Loading menu...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Utensils className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Menu Available</h2>
        <p className="text-muted-foreground text-center">
          This restaurant hasn't added any menu items yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen pb-20">
      {/* Restaurant header */}
      <div className="bg-primary/10 p-4 sticky top-0 z-10 backdrop-blur-sm border-b">
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          <div className="flex items-center">
            {businessInfo.logo ? (
              <img
                src={businessInfo.logo}
                alt={businessInfo.name}
                className="h-10 w-10 rounded-full mr-3 object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
            )}
            <h1 className="text-xl font-bold">{businessInfo.name}</h1>
          </div>
        </div>
      </div>

      {/* Categories tabs */}
      <div className="sticky top-[73px] bg-background z-10 border-b">
        <div className="max-w-3xl mx-auto px-4">
          <Tabs
            value={activeCategory || undefined}
            onValueChange={setActiveCategory}
            className="w-full"
          >
            <TabsList className="w-full overflow-x-auto flex-nowrap justify-start h-auto py-2 bg-transparent">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.category_id}
                  value={category.category_id}
                  className="px-4 py-2 whitespace-nowrap"
                >
                  {category.category_name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Menu content */}
      <div className="max-w-3xl mx-auto p-4">
        {categories.map((category) => (
          <TabsContent
            key={category.category_id}
            value={category.category_id}
            className="mt-4 space-y-6"
          >
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {category.category_name}
              </h2>
              {category.category_description && (
                <p className="text-muted-foreground mb-4">
                  {category.category_description}
                </p>
              )}

              <div className="space-y-4">
                {category.items.map((item) => (
                  <Card
                    key={item.item_id}
                    className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="flex">
                      {item.item_image_url && (
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
                          <img
                            src={item.item_image_url}
                            alt={item.item_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {item.item_name}
                            </h3>
                            {item.item_description && (
                              <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                                {item.item_description}
                              </p>
                            )}
                          </div>
                          <div className="text-right">
                            {item.item_price_variations ? (
                              <div className="text-sm">
                                <span className="font-medium">From </span>
                                <span className="font-semibold">
                                  $
                                  {Math.min(
                                    ...item.item_price_variations.map(
                                      (v) => v.price,
                                    ),
                                  ).toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <span className="font-semibold">
                                ${item.item_price.toFixed(2)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Dietary badges */}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.item_is_vegetarian && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                            >
                              <Leaf className="h-3 w-3" /> Vegetarian
                            </Badge>
                          )}
                          {item.item_is_vegan && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                            >
                              <Leaf className="h-3 w-3" /> Vegan
                            </Badge>
                          )}
                          {item.item_is_gluten_free && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                            >
                              <Wheat className="h-3 w-3" /> Gluten-Free
                            </Badge>
                          )}
                          {item.item_contains_nuts && (
                            <Badge
                              variant="outline"
                              className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                            >
                              <Nut className="h-3 w-3" /> Contains Nuts
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
          <div
            className="bg-background rounded-t-lg sm:rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.item_image_url && (
              <div className="w-full h-48 sm:h-64 relative">
                <img
                  src={selectedItem.item_image_url}
                  alt={selectedItem.item_name}
                  className="w-full h-full object-cover"
                />
                <button
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2"
                  onClick={closeItemDetails}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            )}

            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {selectedItem.item_name}
              </h2>
              {selectedItem.item_description && (
                <p className="text-muted-foreground mb-4">
                  {selectedItem.item_description}
                </p>
              )}

              {/* Dietary information */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedItem.item_is_vegetarian && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                  >
                    <Leaf className="h-3 w-3" /> Vegetarian
                  </Badge>
                )}
                {selectedItem.item_is_vegan && (
                  <Badge
                    variant="outline"
                    className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                  >
                    <Leaf className="h-3 w-3" /> Vegan
                  </Badge>
                )}
                {selectedItem.item_is_gluten_free && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                  >
                    <Wheat className="h-3 w-3" /> Gluten-Free
                  </Badge>
                )}
                {selectedItem.item_contains_nuts && (
                  <Badge
                    variant="outline"
                    className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
                  >
                    <Nut className="h-3 w-3" /> Contains Nuts
                  </Badge>
                )}
              </div>

              {/* Price variations */}
              {selectedItem.item_price_variations ? (
                <div className="space-y-2">
                  <h3 className="font-semibold">Options</h3>
                  <div className="space-y-2">
                    {selectedItem.item_price_variations.map(
                      (variation, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 border rounded-md"
                        >
                          <span>{variation.name}</span>
                          <span className="font-semibold">
                            ${variation.price.toFixed(2)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-xl font-bold mt-4">
                  ${selectedItem.item_price.toFixed(2)}
                </div>
              )}

              {/* Spice level indicator if applicable */}
              {selectedItem.item_spice_level > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Spice Level</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill={
                          i < selectedItem.item_spice_level
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={
                          i < selectedItem.item_spice_level
                            ? "text-red-500"
                            : "text-gray-300"
                        }
                      >
                        <path d="M10.5 8.5a2.5 2.5 0 1 1 3 4l-3 3-3-3a2.5 2.5 0 1 1 3-4Z"></path>
                        <path d="M9.5 14.5A2.5 2.5 0 0 0 7 17c0 1.4.5 2.5 1.5 3.5 1 1 2.1 1.5 3.5 1.5s2.5-.5 3.5-1.5c1-1 1.5-2.1 1.5-3.5a2.5 2.5 0 0 0-2.5-2.5h-5Z"></path>
                      </svg>
                    ))}
                  </div>
                </div>
              )}

              <button
                className="w-full mt-8 py-3 bg-primary text-primary-foreground rounded-md font-medium"
                onClick={closeItemDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenu;

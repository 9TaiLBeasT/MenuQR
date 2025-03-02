import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, Wheat, Nut } from "lucide-react";
import { Category, MenuItem } from "@/lib/menu";

interface MenuPreviewProps {
  categories: Category[];
  menuItems: MenuItem[];
  selectedCategory: string | null;
}

const MenuPreview: React.FC<MenuPreviewProps> = ({
  categories,
  menuItems,
  selectedCategory,
}) => {
  // Get the current category
  const currentCategory = categories.find((c) => c.id === selectedCategory);

  if (!currentCategory) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Menu Preview</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Select a category to preview your menu
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-auto">
      <CardHeader>
        <CardTitle>Menu Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-white rounded-lg shadow-sm max-w-md mx-auto overflow-hidden">
          {/* Restaurant header */}
          <div className="bg-primary/10 p-4">
            <h2 className="text-xl font-bold">{currentCategory.name}</h2>
            {currentCategory.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {currentCategory.description}
              </p>
            )}
          </div>

          {/* Menu items */}
          <div className="p-4 space-y-4">
            {menuItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  No items in this category yet
                </p>
              </div>
            ) : (
              menuItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg overflow-hidden"
                >
                  {item.image_url && (
                    <div className="w-full h-40 bg-gray-100">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{item.name}</h3>
                      <div>
                        {item.price_variations &&
                        item.price_variations.length > 0 ? (
                          <span className="font-medium text-sm">
                            From $
                            {Math.min(
                              ...item.price_variations.map((v) => v.price),
                            ).toFixed(2)}
                          </span>
                        ) : (
                          <span className="font-medium">
                            ${item.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    )}

                    {/* Price variations */}
                    {item.price_variations &&
                      item.price_variations.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {item.price_variations.map((variation, index) => (
                            <div
                              key={index}
                              className="flex justify-between text-sm"
                            >
                              <span>{variation.name}</span>
                              <span className="font-medium">
                                ${variation.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                    {/* Dietary badges */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.is_vegetarian && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <Leaf className="h-3 w-3" /> Veg
                        </Badge>
                      )}
                      {item.is_vegan && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
                        >
                          <Leaf className="h-3 w-3" /> Vegan
                        </Badge>
                      )}
                      {item.is_gluten_free && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
                        >
                          <Wheat className="h-3 w-3" /> GF
                        </Badge>
                      )}
                      {item.contains_nuts && (
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
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuPreview;

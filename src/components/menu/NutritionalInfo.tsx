import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NutritionalInfoProps {
  calories?: number | null;
  protein?: number | null;
  carbs?: number | null;
  fat?: number | null;
  allergens?: string[] | null;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  containsNuts?: boolean;
}

const NutritionalInfo: React.FC<NutritionalInfoProps> = ({
  calories = null,
  protein = null,
  carbs = null,
  fat = null,
  allergens = null,
  isVegetarian = false,
  isVegan = false,
  isGlutenFree = false,
  containsNuts = false,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Nutritional Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Dietary badges */}
          <div className="flex flex-wrap gap-2">
            {isVegetarian && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Vegetarian
              </Badge>
            )}
            {isVegan && (
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Vegan
              </Badge>
            )}
            {isGlutenFree && (
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200"
              >
                Gluten-Free
              </Badge>
            )}
            {containsNuts && (
              <Badge
                variant="outline"
                className="bg-red-50 text-red-700 border-red-200"
              >
                Contains Nuts
              </Badge>
            )}
          </div>

          {/* Calories and macros */}
          {calories !== null && (
            <div>
              <h4 className="font-medium mb-2">Calories & Macronutrients</h4>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-muted rounded-md">
                  <div className="text-lg font-bold">{calories}</div>
                  <div className="text-xs text-muted-foreground">Calories</div>
                </div>
                {protein !== null && (
                  <div className="p-2 bg-muted rounded-md">
                    <div className="text-lg font-bold">{protein}g</div>
                    <div className="text-xs text-muted-foreground">Protein</div>
                  </div>
                )}
                {carbs !== null && (
                  <div className="p-2 bg-muted rounded-md">
                    <div className="text-lg font-bold">{carbs}g</div>
                    <div className="text-xs text-muted-foreground">Carbs</div>
                  </div>
                )}
                {fat !== null && (
                  <div className="p-2 bg-muted rounded-md">
                    <div className="text-lg font-bold">{fat}g</div>
                    <div className="text-xs text-muted-foreground">Fat</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Allergens */}
          {allergens && allergens.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Allergens</h4>
              <div className="flex flex-wrap gap-2">
                {allergens.map((allergen, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                  >
                    {allergen}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* If no nutritional info is available */}
          {!calories &&
            !protein &&
            !carbs &&
            !fat &&
            (!allergens || allergens.length === 0) &&
            !isVegetarian &&
            !isVegan &&
            !isGlutenFree &&
            !containsNuts && (
              <p className="text-sm text-muted-foreground text-center py-2">
                Nutritional information not available for this item.
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NutritionalInfo;

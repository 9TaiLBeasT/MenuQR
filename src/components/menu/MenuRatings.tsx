import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Star, StarHalf, Loader2, ThumbsUp } from "lucide-react";

interface MenuRatingsProps {
  menuItemId: string;
  menuItemName: string;
}

interface Rating {
  id: string;
  rating: number;
  comment: string;
  customer_name: string;
  created_at: string;
}

const MenuRatings: React.FC<MenuRatingsProps> = ({
  menuItemId,
  menuItemName,
}) => {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  // Form state
  const [ratingForm, setRatingForm] = useState({
    rating: 5,
    comment: "",
    customer_name: "",
  });

  useEffect(() => {
    loadRatings();
  }, [menuItemId]);

  const loadRatings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("menu_item_ratings")
        .select("*")
        .eq("menu_item_id", menuItemId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setRatings(data || []);

      // Calculate average rating
      if (data && data.length > 0) {
        const sum = data.reduce((acc, curr) => acc + curr.rating, 0);
        setAverageRating(sum / data.length);
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
      toast({
        title: "Error",
        description: "Failed to load ratings",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setRatingForm((prev) => ({
      ...prev,
      [name]: name === "rating" ? parseInt(value) : value,
    }));
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ratingForm.customer_name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("menu_item_ratings").insert({
        menu_item_id: menuItemId,
        rating: ratingForm.rating,
        comment: ratingForm.comment,
        customer_name: ratingForm.customer_name,
      });

      if (error) throw error;

      toast({
        title: "Thank You!",
        description: "Your rating has been submitted successfully",
      });

      // Reset form and reload ratings
      setRatingForm({
        rating: 5,
        comment: "",
        customer_name: "",
      });
      setShowRatingForm(false);
      loadRatings();
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast({
        title: "Error",
        description: "Failed to submit rating",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-5 w-5 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-5 w-5 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-5 w-5 text-gray-300" />);
    }

    return stars;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading ratings...</span>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Ratings & Reviews for {menuItemName}</span>
          <div className="flex items-center">
            {renderStars(averageRating)}
            <span className="ml-2 text-lg">{averageRating.toFixed(1)}</span>
          </div>
        </CardTitle>
        <CardDescription>
          {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {showRatingForm ? (
          <form onSubmit={handleSubmitRating} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="rating">Your Rating</Label>
              <div className="flex items-center">
                <input
                  type="range"
                  id="rating"
                  name="rating"
                  min="1"
                  max="5"
                  step="1"
                  value={ratingForm.rating}
                  onChange={handleInputChange}
                  className="w-full"
                />
                <div className="ml-4 flex">
                  {renderStars(ratingForm.rating)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customer_name">Your Name</Label>
              <Input
                id="customer_name"
                name="customer_name"
                placeholder="Enter your name"
                value={ratingForm.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review (Optional)</Label>
              <Textarea
                id="comment"
                name="comment"
                placeholder="Share your experience with this dish"
                value={ratingForm.comment}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRatingForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </Button>
            </div>
          </form>
        ) : (
          <>
            {ratings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No reviews yet. Be the first to rate this item!
                </p>
                <Button onClick={() => setShowRatingForm(true)}>
                  Write a Review
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center">
                          {renderStars(rating.rating)}
                        </div>
                        <p className="font-medium mt-1">
                          {rating.customer_name}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {rating.comment && (
                      <p className="mt-2 text-sm">{rating.comment}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
      {!showRatingForm && ratings.length > 0 && (
        <CardFooter>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowRatingForm(true)}
          >
            <ThumbsUp className="mr-2 h-4 w-4" /> Add Your Review
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default MenuRatings;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerMenu from "./CustomerMenu";
import { Loader2 } from "lucide-react";

const PublicMenuView = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Track menu view
    const trackView = async () => {
      try {
        // In a real implementation, you would track the view in your analytics
        // For now, we'll just simulate a delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load menu");
        setIsLoading(false);
      }
    };

    if (profileId) {
      trackView();
    } else {
      setError("Invalid menu link");
      setIsLoading(false);
    }
  }, [profileId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading menu...</span>
      </div>
    );
  }

  if (error || !profileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p className="text-muted-foreground text-center">
          {error || "Invalid menu link"}
        </p>
      </div>
    );
  }

  return <CustomerMenu profileId={profileId} />;
};

export default PublicMenuView;

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { getTotalMenuViews } from "@/lib/analytics";
import { getQRCodes } from "@/lib/qrcode";
import { getCategories } from "@/lib/menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, BarChart3, Utensils, Plus } from "lucide-react";

const Dashboard = () => {
  const { profile } = useAuth();
  const [totalViews, setTotalViews] = useState<number>(0);
  const [qrCodesCount, setQrCodesCount] = useState<number>(0);
  const [categoriesCount, setCategoriesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // Fetch analytics data
        const views = await getTotalMenuViews();
        setTotalViews(views);

        // Fetch QR codes
        const qrCodes = await getQRCodes();
        setQrCodesCount(qrCodes.length);

        // Fetch menu categories
        const categories = await getCategories();
        setCategoriesCount(categories.length);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.business_name || "Restaurant Owner"}!
          </p>
        </div>
        <div className="mt-4 md:mt-0 space-x-2">
          <Button onClick={() => (window.location.href = "/menu")}>
            <Plus className="mr-2 h-4 w-4" /> Create Menu
          </Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/qrcode")}
          >
            <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Menu Views
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : totalViews}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lifetime menu scans
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">QR Codes</CardTitle>
            <QrCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : qrCodesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active QR codes
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Menu Categories
            </CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : categoriesCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Menu categories
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Placeholder for future dashboard sections */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your menu's recent views and interactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading activity data...</p>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity to display</p>
                <p className="text-sm mt-2">
                  Activity will appear here once your menu gets views
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Popular Items</CardTitle>
            <CardDescription>Your most viewed menu items</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading popular items...</p>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No popular items to display</p>
                <p className="text-sm mt-2">
                  Add menu items to see which ones are most popular
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            Complete these steps to set up your digital menu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                <Utensils className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Create Your Menu</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Add categories and menu items to display to your customers
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (window.location.href = "/menu")}
                >
                  Create Menu
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                <QrCode className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Generate QR Code</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Create a custom QR code that links to your digital menu
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (window.location.href = "/qrcode")}
                >
                  Generate QR Code
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg">
              <div className="bg-primary/10 p-2 rounded-full">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Track Performance</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Monitor menu views and popular items with analytics
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => (window.location.href = "/dashboard")}
                >
                  View Analytics
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

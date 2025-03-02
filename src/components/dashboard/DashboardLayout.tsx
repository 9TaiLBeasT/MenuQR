import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Loader2 } from "lucide-react";
import DashboardNavbar from "../layout/DashboardNavbar";

const DashboardLayout = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNavbar />
      <div className="flex-grow pt-16">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { signIn, signUp } from "@/lib/auth";
import { toast } from "../ui/use-toast";

interface AuthModalProps {
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultTab?: "login" | "signup";
  onLoginSuccess?: (data: any) => void;
  onSignupSuccess?: (data: any) => void;
}

const AuthModal = ({
  isOpen = true,
  onOpenChange = () => {},
  defaultTab = "login",
  onLoginSuccess = () => {},
  onSignupSuccess = () => {},
}: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">(defaultTab);
  const [loginError, setLoginError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoginSubmit = async (data: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const { user } = await signIn({
        email: data.email,
        password: data.password,
      });

      toast({
        title: "Login successful",
        description: `Welcome back, ${user?.email}!`,
      });

      onLoginSuccess({
        email: user?.email,
        id: user?.id,
      });
      onOpenChange(false);

      // Redirect to dashboard after successful login
      window.location.href = "/dashboard";
    } catch (error: any) {
      setLoginError(error.message || "Invalid email or password");
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (data: any) => {
    setIsLoading(true);

    try {
      const { user } = await signUp({
        email: data.email || data.phone,
        password: data.password,
        businessName: data.businessName,
        address: data.address,
        businessHours: data.businessHours,
        contactInfo: data.contactInfo,
      });

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      });

      onSignupSuccess({
        email: user?.email,
        id: user?.id,
        businessName: data.businessName,
      });
      onOpenChange(false);

      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchToSignup = () => {
    setActiveTab("signup");
    setLoginError("");
  };

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background">
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="login" className="rounded-none py-3">
              Login
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-none py-3">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="p-0 m-0">
            <LoginForm
              onSubmit={handleLoginSubmit}
              onSwitchToSignup={handleSwitchToSignup}
              isLoading={isLoading}
              error={loginError}
            />
          </TabsContent>

          <TabsContent value="signup" className="p-0 m-0">
            <SignupForm
              onSubmit={handleSignupSubmit}
              isOpen={activeTab === "signup"}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;

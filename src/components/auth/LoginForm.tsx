import React, { useState } from "react";
import { Mail, Lock, Phone, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onSwitchToSignup?: () => void;
  isLoading?: boolean;
  error?: string;
}

const LoginForm = ({
  onSubmit = () => {},
  onSwitchToSignup = () => {},
  isLoading = false,
  error = "",
}: LoginFormProps) => {
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email: loginMethod === "email" ? email : phone, password });
  };

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Login to Your Account
      </h2>

      {/* Login method toggle */}
      <div className="flex mb-6 border rounded-md overflow-hidden">
        <button
          type="button"
          className={`flex-1 py-2 text-center ${loginMethod === "email" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          onClick={() => setLoginMethod("email")}
        >
          Email
        </button>
        <button
          type="button"
          className={`flex-1 py-2 text-center ${loginMethod === "phone" ? "bg-primary text-primary-foreground" : "bg-background"}`}
          onClick={() => setLoginMethod("phone")}
        >
          Phone
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive rounded-md flex items-center gap-2 text-destructive">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Email/Phone input */}
        <div className="mb-4">
          <Label htmlFor="credential" className="block mb-2">
            {loginMethod === "email" ? "Email" : "Phone Number"}
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              {loginMethod === "email" ? (
                <Mail size={16} />
              ) : (
                <Phone size={16} />
              )}
            </div>
            {loginMethod === "email" ? (
              <Input
                id="credential"
                type="email"
                placeholder="your@email.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            ) : (
              <Input
                id="credential"
                type="tel"
                placeholder="+1 (555) 123-4567"
                className="pl-10"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            )}
          </div>
        </div>

        {/* Password input */}
        <div className="mb-6">
          <Label htmlFor="password" className="block mb-2">
            Password
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
              <Lock size={16} />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-1 text-right">
            <a href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </a>
          </div>
        </div>

        {/* Submit button */}
        <Button type="submit" className="w-full mb-4" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        {/* Google login */}
        <div className="relative mb-4">
          <Separator className="my-4" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="bg-white px-2 text-sm text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full mb-6"
          onClick={() => console.log("Google login clicked")}
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Google
        </Button>

        {/* Sign up link */}
        <p className="text-center text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={onSwitchToSignup}
          >
            Sign up
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;

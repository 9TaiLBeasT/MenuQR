import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, Lock, Building, MapPin, Clock, User } from "lucide-react";

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void;
  isOpen?: boolean;
}

interface SignupFormData {
  authMethod: string;
  email?: string;
  phone?: string;
  password?: string;
  businessName?: string;
  address?: string;
  businessHours?: string;
  contactInfo?: string;
}

const SignupForm = ({
  onSubmit = () => {},
  isOpen = true,
}: SignupFormProps) => {
  const [authMethod, setAuthMethod] = useState<string>("email");
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<SignupFormData>({
    authMethod: "email",
    email: "",
    phone: "",
    password: "",
    businessName: "",
    address: "",
    businessHours: "",
    contactInfo: "",
  });

  const handleAuthMethodChange = (value: string) => {
    setAuthMethod(value);
    setFormData((prev) => ({ ...prev, authMethod: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        Create Your Account
      </h2>

      <form onSubmit={handleSubmit}>
        {step === 1 ? (
          <div className="space-y-4">
            <div className="mb-4">
              <Label className="block mb-2">Choose Authentication Method</Label>
              <Tabs
                defaultValue="email"
                value={authMethod}
                onValueChange={handleAuthMethodChange}
                className="w-full"
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="phone">Phone</TabsTrigger>
                  <TabsTrigger value="google">Google</TabsTrigger>
                </TabsList>

                <TabsContent value="email" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="phone" className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        className="pl-10"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="google" className="space-y-4 mt-4">
                  <div className="flex justify-center">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full flex items-center gap-2"
                      onClick={() => console.log("Google sign up clicked")}
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                        <path d="M1 1h22v22H1z" fill="none" />
                      </svg>
                      Continue with Google
                    </Button>
                  </div>
                  <p className="text-sm text-center text-muted-foreground mt-4">
                    You'll complete your business profile after Google
                    authentication
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleNextStep}
              disabled={
                authMethod === "google"
                  ? false
                  : !formData.password || !(formData.email || formData.phone)
              }
            >
              Continue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Business Details</h3>

            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessName"
                  name="businessName"
                  placeholder="Your Restaurant or Cafe"
                  className="pl-10"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Business Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  name="address"
                  placeholder="123 Main St, City, State"
                  className="pl-10"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessHours">Business Hours</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="businessHours"
                  name="businessHours"
                  placeholder="Mon-Fri: 9AM-9PM, Sat-Sun: 10AM-10PM"
                  className="pl-10"
                  value={formData.businessHours}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo">Contact Information</Label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  placeholder="Contact person name and role"
                  className="pl-10"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-1/2"
                onClick={() => setStep(1)}
              >
                Back
              </Button>
              <Button type="submit" className="w-1/2">
                Create Account
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SignupForm;

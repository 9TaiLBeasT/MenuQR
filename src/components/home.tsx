import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import HeroSection from "./landing/HeroSection";
import FeatureSection from "./landing/FeatureSection";
import Footer from "./layout/Footer";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "./auth/AuthContext";
import { toast } from "./ui/use-toast";

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, session, isLoading, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: "User",
    avatar: "",
  });

  // Update userProfile when auth state changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.email?.split("@")[0] || "User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      });
    } else {
      setUserProfile({
        name: "User",
        avatar: "",
      });
    }
  }, [user]);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (data: any) => {
    console.log("Login successful:", data);
    setIsAuthModalOpen(false);
    toast({
      title: "Welcome back!",
      description: "You have successfully logged in.",
    });
  };

  const handleSignupSuccess = (data: any) => {
    console.log("Signup successful:", data);
    setIsAuthModalOpen(false);
    toast({
      title: "Account created",
      description: "Your account has been created successfully.",
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to dashboard
      window.location.href = "/dashboard";
    } else {
      // If not logged in, open auth modal
      handleOpenAuthModal();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar
        onOpenAuthModal={handleOpenAuthModal}
        isLoggedIn={!!user}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {/* Add top padding to account for fixed navbar */}
        <div className="pt-20">
          <HeroSection
            onGetStarted={handleGetStarted}
            onLearnMore={() =>
              document
                .getElementById("features")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          />

          <div id="features">
            <FeatureSection />
          </div>

          {/* Free Plan Section */}
          <section id="pricing" className="py-16 px-4 bg-white">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                100% Free, Forever
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12">
                Our platform is completely free for all restaurants and cafes
              </p>

              <div className="max-w-lg mx-auto">
                <div className="border-2 border-primary rounded-lg p-8 bg-background flex flex-col h-full relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium">
                    FREE FOREVER
                  </div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">
                      All Features Included
                    </h3>
                    <p className="text-muted-foreground">
                      Everything you need to create digital menus
                    </p>
                  </div>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    <li className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Unlimited QR code menus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Unlimited menu items</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Advanced analytics & reporting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Custom branding options</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>Community support</span>
                    </li>
                  </ul>
                  <button
                    className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    onClick={handleGetStarted}
                  >
                    Get Started For Free
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Trusted by Restaurants Everywhere
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Testimonial 1 */}
                <div className="bg-background p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=cafe1"
                        alt="Restaurant Owner"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">
                        Cafe Deluxe
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Since implementing MenuQR, we've seen a 30% reduction in
                    wait times and customers love being able to browse our full
                    menu with photos."
                  </p>
                </div>

                {/* Testimonial 2 */}
                <div className="bg-background p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=bistro2"
                        alt="Restaurant Owner"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Bistro 22</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "The QR code menu has been a game-changer for us. We update
                    our specials daily without any printing costs, and our
                    customers appreciate the contactless option."
                  </p>
                </div>

                {/* Testimonial 3 */}
                <div className="bg-background p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <img
                        src="https://api.dicebear.com/7.x/avataaars/svg?seed=trattoria3"
                        alt="Restaurant Owner"
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold">Elena Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">
                        Trattoria Bella
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    "Setting up our digital menu took less than an hour, and the
                    customer support team was incredibly helpful. Our diners
                    love the dietary filters!"
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onOpenChange={setIsAuthModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />
    </div>
  );
};

export default Home;

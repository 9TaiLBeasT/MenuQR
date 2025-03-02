import React, { useState, useEffect } from "react";
import Navbar from "./layout/Navbar";
import HeroSection from "./landing/HeroSection";
import FeatureSection from "./landing/FeatureSection";
import Footer from "./layout/Footer";
import AuthModal from "./auth/AuthModal";
import { useAuth } from "./auth/AuthContext";
import { signOut } from "@/lib/auth";
import { toast } from "./ui/use-toast";

const Home = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, profile, isLoading } = useAuth();
  const [userProfile, setUserProfile] = useState({
    name: "User",
    avatar: "",
  });

  // Update userProfile when auth state changes
  useEffect(() => {
    if (user) {
      setUserProfile({
        name: profile?.business_name || user.email?.split("@")[0] || "User",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`,
      });
    } else {
      setUserProfile({
        name: "User",
        avatar: "",
      });
    }
  }, [user, profile]);

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (data: any) => {
    console.log("Login successful:", data);
    // Auth state is handled by AuthContext
  };

  const handleSignupSuccess = (data: any) => {
    console.log("Signup successful:", data);
    // Auth state is handled by AuthContext
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

          <section id="faq" className="py-16 px-4 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
                Everything you need to know about our digital menu platform
              </p>

              <div className="space-y-6">
                {[
                  {
                    question: "How does the QR code menu work?",
                    answer:
                      "Our platform generates a unique QR code for your menu. When customers scan it with their smartphone camera, they're taken directly to your digital menu in their web browser - no app download required.",
                  },
                  {
                    question: "Can I update my menu in real-time?",
                    answer:
                      "Yes! You can update your menu items, prices, and availability in real-time. Changes are reflected immediately on your digital menu.",
                  },
                  {
                    question:
                      "Do I need technical skills to use this platform?",
                    answer:
                      "Not at all. Our platform is designed to be user-friendly with an intuitive interface. If you can use social media, you can create and manage your digital menu.",
                  },
                  {
                    question: "Can I customize the look of my digital menu?",
                    answer:
                      "Yes, you can customize colors, fonts, and layout to match your brand identity. Pro and Enterprise plans offer more extensive customization options.",
                  },
                  {
                    question: "What analytics do you provide?",
                    answer:
                      "Our platform tracks menu views, most viewed items, and customer engagement patterns. This data helps you understand customer preferences and optimize your menu accordingly.",
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-6 bg-white"
                  >
                    <h3 className="text-xl font-medium mb-2">{faq.question}</h3>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="contact" className="py-16 px-4 bg-white">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
                Get In Touch
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-12 text-center">
                Have questions or need assistance? We're here to help!
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-8 rounded-lg">
                  <h3 className="text-xl font-bold mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-primary mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Email</p>
                        <a
                          href="mailto:support@menuqr.com"
                          className="text-primary hover:underline"
                        >
                          support@menuqr.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-primary mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Phone</p>
                        <a
                          href="tel:+15551234567"
                          className="text-primary hover:underline"
                        >
                          +1 (555) 123-4567
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg
                        className="h-5 w-5 text-primary mt-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-muted-foreground">
                          123 Menu Street, Food City, FC 12345
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium mb-1"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium mb-1"
                      >
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="How can we help?"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium mb-1"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Your message..."
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
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

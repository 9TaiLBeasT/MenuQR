import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, QrCode, BarChart3, MenuSquare } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onGetStarted?: () => void;
  onLearnMore?: () => void;
}

const HeroSection = ({
  onGetStarted = () => console.log("Get started clicked"),
  onLearnMore = () => console.log("Learn more clicked"),
}: HeroSectionProps) => {
  return (
    <section className="w-full bg-gradient-to-b from-background to-background/80 py-20 px-4 md:px-6 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col space-y-6"
          >
            <div>
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                Digital Menu Platform
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Modernize Your Restaurant Experience
              </h1>
              <p className="mt-6 text-xl text-muted-foreground">
                Create QR code-based digital menus without requiring customers
                to download an app. Perfect for small restaurants and cafes
                looking to reduce costs and enhance customer experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" onClick={onGetStarted} className="group">
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline" onClick={onLearnMore}>
                Learn More
              </Button>
            </div>

            <div className="pt-6">
              <p className="text-sm text-muted-foreground">
                Join over 1,000+ restaurants already using our platform
              </p>
              <div className="flex mt-4 space-x-6">
                {["Restaurant A", "Cafe B", "Bistro C", "Diner D"].map(
                  (name, i) => (
                    <img
                      key={i}
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${name}`}
                      alt={`${name} logo`}
                      className="h-8 w-auto grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all"
                    />
                  ),
                )}
              </div>
            </div>
          </motion.div>

          {/* Right column - Visual representation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-2 border border-border shadow-xl"
          >
            <div className="aspect-[4/3] bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-[80%] h-[80%] bg-background/80 backdrop-blur-md rounded-lg shadow-lg p-6 flex flex-col">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <MenuSquare className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Digital Menu</h3>
                        <p className="text-xs text-muted-foreground">
                          Cafe Example
                        </p>
                      </div>
                    </div>
                    <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <QrCode className="h-6 w-6 text-primary" />
                    </div>
                  </div>

                  <div className="flex-1 grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((item) => (
                      <div
                        key={item}
                        className="bg-white/20 rounded-lg p-3 flex flex-col"
                      >
                        <div className="h-16 bg-primary/5 rounded-md mb-2"></div>
                        <div className="h-3 w-3/4 bg-primary/10 rounded-full mb-1"></div>
                        <div className="h-2 w-1/2 bg-primary/10 rounded-full"></div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-xs">128 views today</span>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      Edit Menu
                    </Button>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 left-4 h-24 w-24 bg-primary/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-8 right-8 h-32 w-32 bg-primary/30 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/3 h-16 w-16 bg-primary/20 rounded-full blur-lg"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

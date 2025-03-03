import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MenuSquare,
  QrCode,
  Eye,
  Moon,
  BarChart3,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const FeaturesPage = () => {
  const features = [
    {
      title: "Menu Builder",
      description:
        "Add and customize menu items easily with our intuitive drag-and-drop interface.",
      icon: <MenuSquare className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
    {
      title: "QR Code Generation",
      description:
        "Generate and print custom QR codes that match your brand identity.",
      icon: <QrCode className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
    {
      title: "Live Menu Preview",
      description:
        "See how your menu looks before publishing it to ensure a perfect customer experience.",
      icon: <Eye className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
    {
      title: "Dark Mode & Custom Branding",
      description:
        "Personalize colors and themes to match your restaurant's unique style and brand.",
      icon: <Moon className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
    {
      title: "Analytics & Insights",
      description:
        "Track QR code scans and menu views to understand customer engagement.",
      icon: <BarChart3 className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
    {
      title: "Customer Reviews & Feedback",
      description:
        "Allow customers to rate dishes and provide feedback to improve your offerings.",
      icon: <MessageSquare className="h-12 w-12 text-primary" />,
      link: "/demo",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-20 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Powerful Features for Your Digital Menu
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Everything you need to create and manage a professional digital
              menu experience for your restaurant or café.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/demo">Try Demo</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="h-full flex flex-col hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={feature.link}>
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="bg-primary/5 py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Menu Experience?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of restaurants already using our platform to
              enhance their customer experience.
            </p>
            <Button size="lg" asChild>
              <Link to="/">Get Started Free</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FeaturesPage;

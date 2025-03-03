import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  MenuSquare,
  QrCode,
  Smartphone,
  CreditCard,
  Settings,
  HelpCircle,
  MessageSquare,
  ArrowRight,
} from "lucide-react";

const HelpCenterPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: <MenuSquare className="h-5 w-5" />,
      description: "Learn the basics of setting up your digital menu",
    },
    {
      id: "qr-codes",
      name: "QR Codes",
      icon: <QrCode className="h-5 w-5" />,
      description: "Everything about generating and using QR codes",
    },
    {
      id: "menu-management",
      name: "Menu Management",
      icon: <Smartphone className="h-5 w-5" />,
      description: "Tips for creating and managing your digital menu",
    },
    {
      id: "billing",
      name: "Billing & Account",
      icon: <CreditCard className="h-5 w-5" />,
      description: "Information about your account and billing",
    },
    {
      id: "customization",
      name: "Customization",
      icon: <Settings className="h-5 w-5" />,
      description: "Learn how to customize your menu's appearance",
    },
    {
      id: "troubleshooting",
      name: "Troubleshooting",
      icon: <HelpCircle className="h-5 w-5" />,
      description: "Solutions to common issues and problems",
    },
  ];

  const faqs = [
    {
      category: "getting-started",
      question: "How do I create my first digital menu?",
      answer:
        "To create your first digital menu, log in to your account, click on 'Menu Builder' in the dashboard, and follow the step-by-step guide to add categories and menu items. Once you've added your items, you can preview and publish your menu.",
    },
    {
      category: "getting-started",
      question: "What information do I need to set up my account?",
      answer:
        "To set up your account, you'll need your business name, address, contact information, and business hours. You can also upload your logo and cover image to brand your digital menu.",
    },
    {
      category: "qr-codes",
      question: "How do I generate a QR code for my menu?",
      answer:
        "After creating your menu, go to the 'QR Code Generator' section in your dashboard. You can customize the appearance of your QR code, then download it in various formats (PNG, SVG, PDF) for printing or digital use.",
    },
    {
      category: "qr-codes",
      question: "What if customers can't scan my QR code?",
      answer:
        "If customers have trouble scanning your QR code, ensure it's printed clearly with good contrast and adequate size. Make sure there's sufficient lighting and the code isn't damaged. You can also provide a direct URL as a backup.",
    },
    {
      category: "menu-management",
      question: "How do I update my menu items?",
      answer:
        "To update menu items, go to the 'Menu Builder' section, select the category containing the item, then click on the item you want to edit. Make your changes and save them. Updates will be reflected immediately on your digital menu.",
    },
    {
      category: "menu-management",
      question: "Can I temporarily hide certain menu items?",
      answer:
        "Yes, you can hide menu items without deleting them. In the Menu Builder, find the item you want to hide, toggle the 'Available' switch to off. You can make it visible again anytime by toggling the switch back on.",
    },
    {
      category: "billing",
      question: "Is the platform really free to use?",
      answer:
        "Yes, our platform is completely free for all restaurants and cafes. There are no hidden fees or charges for using any of our features.",
    },
    {
      category: "customization",
      question: "How do I change the colors and fonts of my menu?",
      answer:
        "To customize your menu's appearance, go to the 'Theme Customizer' in your dashboard. Here you can change colors, fonts, and layout options to match your brand identity.",
    },
    {
      category: "troubleshooting",
      question: "What should I do if my menu isn't displaying correctly?",
      answer:
        "If your menu isn't displaying correctly, first try refreshing the page. If the issue persists, check your browser's cache or try viewing it in a different browser. If problems continue, contact our support team for assistance.",
    },
  ];

  // Filter FAQs based on search and category
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? faq.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Help Center</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to common questions and learn how to get the most out
              of our platform
            </p>

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for help..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${selectedCategory === category.id ? "border-primary ring-1 ring-primary" : ""}`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.id ? null : category.id,
                  )
                }
              >
                <CardHeader className="flex flex-row items-start space-y-0 pb-2">
                  <div className="bg-primary/10 p-2 rounded-full mr-4">
                    {category.icon}
                  </div>
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {category.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* FAQs */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">
              {selectedCategory
                ? `${categories.find((c) => c.id === selectedCategory)?.name} FAQs`
                : "Frequently Asked Questions"}
            </h2>

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  No results found for your search. Try different keywords or
                  browse all categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}

            <div className="mt-12 bg-primary/5 rounded-lg p-6 text-center">
              <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
              <p className="text-muted-foreground mb-4">
                Can't find what you're looking for? Our support team is here to
                help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/contact">
                    <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/tutorials">
                    <ArrowRight className="mr-2 h-4 w-4" /> View Tutorials
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HelpCenterPage;

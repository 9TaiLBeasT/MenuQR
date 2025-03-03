import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MessageSquare } from "lucide-react";

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FAQPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const faqCategories = [
    { id: "all", name: "All Questions" },
    { id: "general", name: "General" },
    { id: "account", name: "Account & Setup" },
    { id: "menu", name: "Menu Creation" },
    { id: "qr", name: "QR Codes" },
    { id: "technical", name: "Technical" },
  ];

  const faqs: FAQ[] = [
    {
      question: "What is MenuQR?",
      answer:
        "MenuQR is a digital menu platform that allows restaurants and cafes to create QR code-based menus without requiring customers to download an app. It helps businesses modernize their dining experience while reducing costs associated with printing physical menus.",
      category: "general",
    },
    {
      question: "Is MenuQR really free to use?",
      answer:
        "Yes, MenuQR is completely free for all restaurants and cafes. There are no hidden fees, subscription costs, or limits on the number of menu items you can create.",
      category: "general",
    },
    {
      question: "How do I create an account?",
      answer:
        "To create an account, click the 'Sign Up' button on the homepage. You can sign up using your email address, phone number, or Google account. Then, follow the prompts to enter your business details and create your profile.",
      category: "account",
    },
    {
      question: "What information do I need to set up my restaurant profile?",
      answer:
        "To set up your profile, you'll need your business name, address, business hours, and contact information. You can also upload your restaurant logo and a cover image to enhance your digital menu's appearance.",
      category: "account",
    },
    {
      question: "How do I create my first menu?",
      answer:
        "After logging in, navigate to the 'Menu Builder' section in your dashboard. Click 'Add Category' to create menu sections (like Appetizers, Main Courses, etc.), then add items to each category with names, descriptions, prices, and optional images and dietary information.",
      category: "menu",
    },
    {
      question: "Can I organize my menu into categories?",
      answer:
        "Yes, you can create as many categories as you need (e.g., Breakfast, Lunch, Dinner, Desserts). This helps customers navigate your menu more easily. You can also reorder categories and items within categories by dragging and dropping them.",
      category: "menu",
    },
    {
      question: "How do I generate a QR code for my menu?",
      answer:
        "Once your menu is created, go to the 'QR Code Generator' section in your dashboard. You can customize the appearance of your QR code, including colors and adding your logo. Then download it in various formats (PNG, SVG, PDF) for printing or digital use.",
      category: "qr",
    },
    {
      question: "Do customers need to download an app to view my menu?",
      answer:
        "No, that's the beauty of MenuQR! Customers simply scan the QR code with their phone's camera, and your menu opens directly in their web browser. No app download is required, making it convenient for everyone.",
      category: "qr",
    },
    {
      question: "Can I update my menu in real-time?",
      answer:
        "Yes, you can update your menu anytime, and changes appear instantly. This allows you to quickly adjust prices, add seasonal items, or mark items as sold out without needing to reprint physical menus or generate new QR codes.",
      category: "menu",
    },
    {
      question: "Is there a limit to how many menu items I can add?",
      answer:
        "No, there's no limit to the number of categories or menu items you can create with MenuQR. You can add as many items as your restaurant offers.",
      category: "menu",
    },
    {
      question: "How do I indicate dietary restrictions on menu items?",
      answer:
        "When adding or editing a menu item, you'll find toggles for common dietary indicators like Vegetarian, Vegan, Gluten-Free, and Contains Nuts. These will display as badges on your menu items, helping customers with dietary restrictions identify suitable options.",
      category: "menu",
    },
    {
      question: "Can I see how many people have viewed my menu?",
      answer:
        "Yes, MenuQR includes analytics that show you how many times your QR code has been scanned, which menu items are viewed most frequently, and other useful insights to help you understand customer preferences.",
      category: "technical",
    },
    {
      question: "What if my internet connection goes down?",
      answer:
        "Once a customer has loaded your menu, it will remain accessible even if your internet connection drops temporarily. However, for the best experience, a stable internet connection is recommended for both you and your customers.",
      category: "technical",
    },
    {
      question: "How do I contact support if I need help?",
      answer:
        "You can reach our support team through the 'Contact Us' page on our website, or by emailing support@menuqr.com. We also have a comprehensive Help Center with guides and tutorials to help you get the most out of MenuQR.",
      category: "general",
    },
  ];

  // Filter FAQs based on search and active tab
  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeTab === "all" || faq.category === activeTab;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Find answers to common questions about our digital menu platform
            </p>

            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search for answers..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-8">
              {faqCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No questions found matching your search. Try different
                    keywords or browse all categories.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveTab("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <Accordion type="single" collapsible className="w-full">
                  {filteredFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-16 bg-primary/5 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our support team is here
              to help with any questions you might have about our digital menu
              platform.
            </p>
            <Button asChild>
              <Link to="/contact">
                <MessageSquare className="mr-2 h-4 w-4" /> Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;

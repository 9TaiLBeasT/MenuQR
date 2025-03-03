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
      answer: "MenuQR is a digital menu platform that allows restaurants and cafes to create QR code-based menus without requiring customers to download an app. It helps businesses modernize their dining experience while reducing costs associated with printing physical menus.",
      category: "general",
    },
    {
      question: "Is MenuQR really free to use?",
      answer: "Yes, MenuQR is completely free for all restaurants and cafes. There are no hidden fees, subscription costs, or limits on the number of menu items you can create.",
      category: "general",
    },
    {
      question: "How do I create an account?",
      answer: "To create an account, click the 'Sign Up' button on the homepage. You can sign up using your email address, phone number, or Google account. Then, follow the prompts to enter your business details and create your profile.",
      category: "account",
    },
    {
      question: "What information do I need to set up my restaurant profile?",
      answer: "To set up your profile, you'll need your business name, address, business hours, and contact information. You can also upload your restaurant logo and a cover image to enhance your digital menu's appearance.",
      category: "account",
    },
    {
      question: "How do I create my first menu?",
      answer: "After logging in, navigate to the 'Menu Builder' section in your dashboard. Click 'Add Category' to create menu sections (like Appetizers, Main Courses, etc.), then add items to each category with names, descriptions, prices, and optional images and dietary information.",
      category: "menu",
    },
    {
      question: "Can I organize my menu into categories?",
      answer: "Yes, you can create as many categories as you need (e.g., Breakfast, Lunch,
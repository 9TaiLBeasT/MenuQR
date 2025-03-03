import React from "react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Home,
  Layers,
  FileText,
  HelpCircle,
  BookOpen,
  MessageSquare,
  Video,
  ChevronUp,
  Github,
  Linkedin,
} from "lucide-react";

interface FooterProps {
  businessName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const Footer = ({
  businessName = "MenuQR",
  address = "123 Main Street, City, State 12345",
  phone = "+1 (555) 123-4567",
  email = "support@menuqr.com",
}: FooterProps) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-slate-900 text-white py-12 px-4 md:px-8 lg:px-12 relative">
      {/* Back to top button */}
      <button
        onClick={scrollToTop}
        className="absolute right-8 -top-5 bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-lg transition-all"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{businessName}</h3>
            <p className="text-slate-300 flex items-start gap-2">
              <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>{address}</span>
            </p>
            <p className="text-slate-300 flex items-center gap-2">
              <Phone className="h-5 w-5 flex-shrink-0" />
              <span>{phone}</span>
            </p>
            <p className="text-slate-300 flex items-center gap-2">
              <Mail className="h-5 w-5 flex-shrink-0" />
              <span>{email}</span>
            </p>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Main Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Home className="h-4 w-4" /> Home
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Layers className="h-4 w-4" /> Features
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Demo
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/blog"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" /> Blog
                </Link>
              </li>
              <li>
                <Link
                  to="/help-center"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" /> Help Center
                </Link>
              </li>
              <li>
                <Link
                  to="/tutorials"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Video className="h-4 w-4" /> Tutorials
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="h-4 w-4" /> FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" /> Resources
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Stay Updated</h3>
            <p className="text-slate-300">
              Subscribe to our newsletter for the latest updates and offers.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Email for newsletter"
              />
              <Button className="w-full">Subscribe</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} {businessName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-4 mt-4 md:mt-0">
            <Link
              to="/privacy-policy"
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms-of-service"
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="/cookie-policy"
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              to="/sitemap"
              className="text-slate-400 text-sm hover:text-white transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

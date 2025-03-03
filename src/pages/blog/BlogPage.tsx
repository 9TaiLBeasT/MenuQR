import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Search, Calendar, User, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  published_at: string;
  image_url: string;
  category: string;
  slug: string;
}

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Sample blog posts (in a real app, these would come from Supabase)
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "The Future of Contactless Dining",
      excerpt:
        "How QR code menus are transforming the restaurant industry post-pandemic.",
      content: "Full content would go here...",
      author: "Sarah Johnson",
      published_at: "2023-06-15T10:00:00Z",
      image_url:
        "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&auto=format&fit=crop",
      category: "Industry Trends",
      slug: "future-of-contactless-dining",
    },
    {
      id: "2",
      title: "5 Ways Digital Menus Improve Customer Experience",
      excerpt:
        "Discover how digital menus can enhance your customers' dining experience and boost satisfaction.",
      content: "Full content would go here...",
      author: "Michael Chen",
      published_at: "2023-05-22T14:30:00Z",
      image_url:
        "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&auto=format&fit=crop",
      category: "Customer Experience",
      slug: "digital-menus-improve-customer-experience",
    },
    {
      id: "3",
      title: "How to Design an Effective Digital Menu",
      excerpt:
        "Best practices for creating a digital menu that drives sales and enhances your brand.",
      content: "Full content would go here...",
      author: "Alex Rivera",
      published_at: "2023-04-10T09:15:00Z",
      image_url:
        "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop",
      category: "Design Tips",
      slug: "design-effective-digital-menu",
    },
    {
      id: "4",
      title: "Sustainability Benefits of Going Paperless with Digital Menus",
      excerpt:
        "How switching to digital menus can help restaurants reduce their environmental footprint.",
      content: "Full content would go here...",
      author: "Emma Wilson",
      published_at: "2023-03-05T11:45:00Z",
      image_url:
        "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop",
      category: "Sustainability",
      slug: "sustainability-benefits-digital-menus",
    },
    {
      id: "5",
      title:
        "Analyzing Menu Performance: Using Data to Optimize Your Offerings",
      excerpt:
        "How to use digital menu analytics to make data-driven decisions for your restaurant.",
      content: "Full content would go here...",
      author: "David Park",
      published_at: "2023-02-18T16:20:00Z",
      image_url:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      category: "Analytics",
      slug: "analyzing-menu-performance-data",
    },
    {
      id: "6",
      title: "QR Code Menu Security: Best Practices for Restaurants",
      excerpt:
        "How to ensure your digital menu system is secure and protects customer privacy.",
      content: "Full content would go here...",
      author: "Sophia Martinez",
      published_at: "2023-01-30T13:10:00Z",
      image_url:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
      category: "Security",
      slug: "qr-code-menu-security-best-practices",
    },
  ];

  useEffect(() => {
    // In a real app, this would fetch from Supabase
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setPosts(samplePosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Get unique categories
  const categories = Array.from(new Set(posts.map((post) => post.category)));

  // Filter posts based on search and category
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory
      ? post.category === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Insights, tips, and trends for restaurants and cafes in the
              digital age
            </p>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog posts */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
              <span>Loading articles...</span>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles found matching your criteria.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{post.category}</Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(post.published_at)}
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <User className="h-3 w-3 mr-1" />
                      <span>By {post.author}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to={`/blog/${post.slug}`}>
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Newsletter signup */}
          <div className="mt-16 bg-primary/5 rounded-lg p-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">
                Subscribe to Our Newsletter
              </h2>
              <p className="text-muted-foreground mb-6">
                Get the latest articles, tips, and industry insights delivered
                straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input placeholder="Your email address" type="email" />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BlogPage;

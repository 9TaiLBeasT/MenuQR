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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Play, Clock, Eye, ArrowRight } from "lucide-react";

interface Tutorial {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: string;
  views: number;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  slug: string;
}

const TutorialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Sample tutorials data
  const tutorials: Tutorial[] = [
    {
      id: "1",
      title: "Getting Started with Digital Menus",
      description:
        "Learn the basics of creating your first digital menu from scratch.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop",
      duration: "5:24",
      views: 1245,
      category: "getting-started",
      difficulty: "Beginner",
      slug: "getting-started-digital-menus",
    },
    {
      id: "2",
      title: "Creating and Customizing QR Codes",
      description:
        "How to generate custom QR codes that match your restaurant's branding.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1595079676339-1534801ad6cf?w=800&auto=format&fit=crop",
      duration: "7:15",
      views: 982,
      category: "qr-codes",
      difficulty: "Beginner",
      slug: "creating-customizing-qr-codes",
    },
    {
      id: "3",
      title: "Advanced Menu Organization Techniques",
      description:
        "Learn how to structure your menu for maximum impact and customer engagement.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&auto=format&fit=crop",
      duration: "10:32",
      views: 756,
      category: "menu-management",
      difficulty: "Intermediate",
      slug: "advanced-menu-organization",
    },
    {
      id: "4",
      title: "Using Analytics to Improve Your Menu",
      description:
        "How to interpret menu analytics and make data-driven decisions.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      duration: "8:47",
      views: 634,
      category: "analytics",
      difficulty: "Advanced",
      slug: "using-analytics-improve-menu",
    },
    {
      id: "5",
      title: "Customizing Your Menu's Appearance",
      description:
        "Learn how to style your digital menu to match your brand identity.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1484156818044-c040038b0719?w=800&auto=format&fit=crop",
      duration: "6:18",
      views: 892,
      category: "customization",
      difficulty: "Intermediate",
      slug: "customizing-menu-appearance",
    },
    {
      id: "6",
      title: "Troubleshooting Common QR Code Issues",
      description:
        "Solutions for the most frequent problems with QR code scanning.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnailUrl:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&auto=format&fit=crop",
      duration: "9:05",
      views: 1103,
      category: "troubleshooting",
      difficulty: "Beginner",
      slug: "troubleshooting-qr-code-issues",
    },
  ];

  // Filter tutorials based on search and active tab
  const filteredTutorials = tutorials.filter((tutorial) => {
    const matchesSearch =
      tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab =
      activeTab === "all" ||
      tutorial.category === activeTab ||
      (activeTab === "beginner" && tutorial.difficulty === "Beginner") ||
      (activeTab === "intermediate" &&
        tutorial.difficulty === "Intermediate") ||
      (activeTab === "advanced" && tutorial.difficulty === "Advanced");

    return matchesSearch && matchesTab;
  });

  // Format view count
  const formatViews = (views: number) => {
    return views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views.toString();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Video Tutorials</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Step-by-step guides to help you get the most out of our digital
              menu platform
            </p>

            <div className="relative max-w-2xl mx-auto mb-8">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                className="pl-10 h-12 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full max-w-3xl mx-auto"
            >
              <TabsList className="grid grid-cols-3 md:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="getting-started">
                  Getting Started
                </TabsTrigger>
                <TabsTrigger value="qr-codes">QR Codes</TabsTrigger>
                <TabsTrigger value="menu-management">Menu</TabsTrigger>
                <TabsTrigger value="beginner">Beginner</TabsTrigger>
                <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Tutorials grid */}
          {filteredTutorials.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No tutorials found matching your search criteria.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTutorials.map((tutorial) => (
                <Card
                  key={tutorial.id}
                  className="flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={tutorial.thumbnailUrl}
                      alt={tutorial.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full"
                      >
                        <Play className="h-6 w-6" fill="white" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {tutorial.duration}
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge
                        variant="outline"
                        className={`${tutorial.difficulty === "Beginner" ? "bg-green-50 text-green-700 border-green-200" : tutorial.difficulty === "Intermediate" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"}`}
                      >
                        {tutorial.difficulty}
                      </Badge>
                      <div className="text-sm text-muted-foreground flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {formatViews(tutorial.views)} views
                      </div>
                    </div>
                    <CardTitle className="line-clamp-2">
                      {tutorial.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {tutorial.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow"></CardContent>
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link to={`/tutorials/${tutorial.slug}`}>
                        Watch Tutorial <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}

          {/* Featured tutorial */}
          <div className="mt-16 bg-primary/5 rounded-lg p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Featured Tutorial</h2>
                <h3 className="text-xl font-semibold mb-2">
                  Complete Guide to Digital Menu Success
                </h3>
                <p className="text-muted-foreground mb-6">
                  This comprehensive tutorial covers everything from setting up
                  your account to advanced customization techniques. Perfect for
                  new users who want to get the most out of our platform.
                </p>
                <Button asChild>
                  <Link to="/tutorials/complete-guide">
                    Watch Now <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop"
                  alt="Complete Guide to Digital Menu Success"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <Play className="h-8 w-8" fill="white" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TutorialsPage;

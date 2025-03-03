import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, BarChart3, MenuSquare } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

const FeatureCard = ({
  icon,
  title,
  description,
  buttonText = "Learn More",
  onButtonClick = () => {},
}: FeatureCardProps) => {
  return (
    <Card className="bg-white h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <Button
          variant="outline"
          className="w-full mt-4"
          onClick={onButtonClick}
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

interface FeatureSectionProps {
  title?: string;
  subtitle?: string;
  features?: FeatureCardProps[];
}

const FeatureSection = ({
  title = "Powerful Features for Your Digital Menu",
  subtitle = "Everything you need to create and manage your restaurant's digital menu experience",
  features = [
    {
      icon: <MenuSquare size={24} />,
      title: "Menu Builder",
      description:
        "Create beautiful, categorized menus with images, descriptions, and dietary information.",
      buttonText: "Explore Menu Builder",
    },
    {
      icon: <QrCode size={24} />,
      title: "QR Code Generation",
      description:
        "Generate customized QR codes that match your brand and download in multiple formats.",
      buttonText: "Try QR Generator",
    },
    {
      icon: <BarChart3 size={24} />,
      title: "Analytics Dashboard",
      description:
        "Track menu views, popular items, and customer engagement with detailed analytics.",
      buttonText: "View Analytics Demo",
    },
  ],
}: FeatureSectionProps) => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              buttonText={feature.buttonText}
              onButtonClick={feature.onButtonClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;

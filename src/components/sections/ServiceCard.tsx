import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

export interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  price: string;
  priceNote: string;
  icon: string;
  color: string;
  slug: string;
}

const colorMap: Record<string, { bg: string; text: string; border: string; hover: string }> = {
  red: {
    bg: "bg-red-600",
    text: "text-red-500",
    border: "border-red-600",
    hover: "hover:bg-red-700 hover:border-red-700",
  },
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-500",
    border: "border-blue-600",
    hover: "hover:bg-blue-700 hover:border-blue-700",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-500",
    border: "border-purple-600",
    hover: "hover:bg-purple-700 hover:border-purple-700",
  },
  yellow: {
    bg: "bg-yellow-600",
    text: "text-yellow-500",
    border: "border-yellow-600",
    hover: "hover:bg-yellow-700 hover:border-yellow-700",
  },
  cyan: {
    bg: "bg-cyan-600",
    text: "text-cyan-500",
    border: "border-cyan-600",
    hover: "hover:bg-cyan-700 hover:border-cyan-700",
  },
  emerald: {
    bg: "bg-emerald-600",
    text: "text-emerald-500",
    border: "border-emerald-600",
    hover: "hover:bg-emerald-700 hover:border-emerald-700",
  },
};

export function ServiceCard({
  title,
  description,
  price,
  priceNote,
  icon,
  color = "red",
  slug,
}: ServiceCardProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;
  const colors = colorMap[color] || colorMap.red;

  return (
    <Card
      className={cn(
        "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-300",
        "hover:-translate-y-1 hover:shadow-xl",
        colors.hover
      )}
    >
      <CardContent className="p-6">
        <div className={cn("mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full", colors.bg)}>
          {IconComponent && <IconComponent className="h-8 w-8 text-white" />}
        </div>

        <h3 className="mb-3 text-center text-xl font-bold text-white">{title}</h3>

        <p className="mb-4 text-center text-sm text-gray-400">{description}</p>

        <div className="mb-6 text-center">
          <div className={cn("text-lg font-bold", colors.text)}>{price}</div>
          <div className="text-xs text-gray-400">{priceNote}</div>
        </div>

        <div className="space-y-3">
          <Button
            asChild
            className={cn("w-full", colors.bg, "text-white hover:opacity-90")}
          >
            <Link href={`/${slug}`}>Learn More</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className={cn("w-full", colors.border, "text-white hover:bg-gray-700")}
          >
            <Link href="/contact">Get Quote</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

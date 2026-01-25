import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PricingTier {
  name: string;
  price: string;
  description?: string;
  features: string[];
  highlight?: boolean;
}

export interface PricingTableProps {
  tiers: PricingTier[];
}

export function PricingTable({ tiers }: PricingTableProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tiers.map((tier) => (
        <Card
          key={tier.name}
          className={cn(
            "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-300",
            "hover:-translate-y-1 hover:shadow-xl",
            tier.highlight && "border-2 border-red-600 shadow-lg shadow-red-900/20"
          )}
        >
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">{tier.name}</CardTitle>
            {tier.description && (
              <CardDescription className="text-gray-400">{tier.description}</CardDescription>
            )}
            <div className="mt-4">
              <span className={cn(
                "text-4xl font-bold",
                tier.highlight ? "text-red-500" : "text-white"
              )}>
                {tier.price}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className={cn(
                    "h-5 w-5 flex-shrink-0 mt-0.5",
                    tier.highlight ? "text-red-500" : "text-gray-400"
                  )} />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import * as Icons from "lucide-react";

export interface BenefitCardProps {
  icon: string;
  title: string;
  description: string;
}

export function BenefitCard({ icon, title, description }: BenefitCardProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Card className="border-gray-800 bg-zinc-900">
      <CardContent className="p-6 text-center">
        {IconComponent && (
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-600/10">
              <IconComponent className="h-8 w-8 text-red-500" />
            </div>
          </div>
        )}
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </CardContent>
    </Card>
  );
}

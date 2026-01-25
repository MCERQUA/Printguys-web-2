import * as Icons from "lucide-react";

export interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
  highlighted?: boolean;
}

export function FeatureCard({ icon, title, description, highlighted = false }: FeatureCardProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div
      className={`rounded-xl p-8 border ${highlighted ? "border-red-600 bg-black" : "border-gray-700 bg-black"}`}
    >
      <div className="flex items-start">
        <div
          className={`mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${
            highlighted ? "bg-red-600" : "bg-gray-700"
          }`}
        >
          {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
        </div>
        <div>
          <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
          <p className="text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

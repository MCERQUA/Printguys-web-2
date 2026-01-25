import * as Icons from "lucide-react";

export interface ValueCardProps {
  icon: string;
  title: string;
  description: string;
}

export function ValueCard({ icon, title, description }: ValueCardProps) {
  const IconComponent = Icons[icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-600">
        {IconComponent && <IconComponent className="h-10 w-10 text-white" />}
      </div>
      <h3 className="mb-4 text-2xl font-bold text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

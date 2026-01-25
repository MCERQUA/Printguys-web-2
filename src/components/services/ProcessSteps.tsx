import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface ProcessStep {
  number: number;
  title: string;
  description: string;
}

export interface ProcessStepsProps {
  title?: string;
  steps: ProcessStep[];
}

export function ProcessSteps({ title, steps }: ProcessStepsProps) {
  return (
    <section className="w-full py-12">
      {title && (
        <h2 className="mb-8 text-center text-3xl font-bold text-white md:text-4xl">
          {title}
        </h2>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {steps.map((step) => (
          <Card
            key={step.number}
            className="border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <CardContent className="p-6 text-center">
              {/* Number Circle */}
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 shadow-lg">
                <span className="text-3xl font-bold text-white">
                  {step.number}
                </span>
              </div>

              {/* Step Title */}
              <h3 className="mb-3 text-lg font-bold text-white">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm text-gray-400">
                {step.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

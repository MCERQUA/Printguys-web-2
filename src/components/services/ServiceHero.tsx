import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

export interface ServiceHeroButton {
  text: string;
  href: string;
  variant?: "default" | "outline";
}

export interface ServiceHeroProps {
  title: string;
  subtitle: string;
  price?: string;
  priceNote?: string;
  features?: string[];
  ctaButtons?: ServiceHeroButton[];
}

export function ServiceHero({
  title,
  subtitle,
  price,
  priceNote,
  features = [],
  ctaButtons = [
    { text: "Get Started", href: "/contact", variant: "default" },
    { text: "Learn More", href: "#", variant: "outline" },
  ],
}: ServiceHeroProps) {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl">
          {/* Title Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-4xl font-bold lg:text-6xl">
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-xl text-gray-300 lg:text-2xl">{subtitle}</p>
          </div>

          {/* Price Section */}
          {price && (
            <div className="mb-8 text-center">
              <div className="mb-2 text-5xl font-bold text-red-500 lg:text-6xl">
                {price}
              </div>
              {priceNote && (
                <p className="text-lg text-gray-400">{priceNote}</p>
              )}
            </div>
          )}

          {/* Features List */}
          {features.length > 0 && (
            <div className="mb-10 flex flex-col items-center">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-lg text-gray-300"
                  >
                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-red-500" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            {ctaButtons.map((btn, index) => (
              <Button
                key={index}
                asChild
                variant={btn.variant === "outline" ? "outline" : "default"}
                size="lg"
                className={
                  btn.variant === "outline"
                    ? "border-2 border-red-600 bg-transparent text-red-500 hover:bg-red-600 hover:text-white px-8 py-4 text-lg font-bold"
                    : "bg-red-600 px-8 py-4 text-lg font-bold hover:bg-red-700"
                }
              >
                <Link href={btn.href}>{btn.text}</Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

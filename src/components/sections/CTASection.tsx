import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface CTAButton {
  label: string;
  href: string;
  variant?: "default" | "outline";
  isPhone?: boolean;
}

export interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButton?: CTAButton;
  secondaryButton?: CTAButton;
}

export function CTASection({
  title = "Ready to Start Your Project?",
  description = "Get in touch with our team for a custom quote on your next order",
  primaryButton = { label: "Get Quote", href: "/contact" },
  secondaryButton = { label: "Call 647-685-6286", href: "tel:6476856286", variant: "outline", isPhone: true },
}: CTASectionProps) {
  return (
    <section className="bg-zinc-900 py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">{title}</h2>
          <p className="mb-8 text-lg text-gray-300">{description}</p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-red-600 px-8 py-4 text-lg font-bold hover:bg-red-700"
            >
              <Link href={primaryButton.href}>{primaryButton.label}</Link>
            </Button>

            {secondaryButton?.isPhone ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-red-600 bg-transparent px-8 py-4 text-lg font-bold text-red-500 hover:bg-red-600 hover:text-white"
              >
                <a href={secondaryButton.href}>{secondaryButton.label}</a>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-red-600 bg-transparent px-8 py-4 text-lg font-bold text-red-500 hover:bg-red-600 hover:text-white"
              >
                <Link href={secondaryButton?.href || "#"}>{secondaryButton?.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

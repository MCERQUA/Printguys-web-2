import Link from "next/link";
import { Button } from "@/components/ui/button";

export interface StatItem {
  value: string;
  label: string;
}

export interface CTAButton {
  label: string;
  href: string;
  variant?: "default" | "outline";
}

export interface SecondaryLink {
  label: string;
  href: string;
}

export interface HeroProps {
  title?: string;
  subtitle?: string;
  stats?: StatItem[];
  ctaButtons?: CTAButton[];
  secondaryLinks?: SecondaryLink[];
}

export function Hero({
  title = "Professional DTF Printing & Custom Services",
  subtitle = "Custom Printed Merch and company apparel in vaughan -no minimums.",
  stats = [
    { value: "2-5 Days", label: "Fast Turnaround" },
    { value: "$0.038/sq\"", label: "DTF Transfer Pricing" },
    { value: "No Min", label: "Order Requirements" },
  ],
  ctaButtons = [
    { label: "Get Quote", href: "/contact", variant: "default" },
    { label: "View Portfolio", href: "/portfolio", variant: "outline" },
  ],
  secondaryLinks = [
    { label: "See Transparent Pricing", href: "/pricing" },
    { label: "Common Questions", href: "/faq" },
  ],
}: HeroProps) {
  return (
    <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-6 text-5xl font-bold lg:text-7xl">
            Professional{" "}
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              DTF Printing
            </span>
            <br />
            & Custom Services
          </h1>
          <p className="mb-6 text-xl text-gray-300 lg:text-2xl">{subtitle}</p>

          <p className="mb-8 max-w-4xl text-lg leading-relaxed text-gray-300">
            <strong className="text-red-500">PrintGuys</strong> is Canada&apos;s leading DTF
            printing and full-service apparel production company. From single-piece orders to
            large-scale production, we deliver professional results with{" "}
            <strong>transparent pricing</strong> and <strong>no minimum requirements</strong>.
          </p>

          {/* Key Stats */}
          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="mb-2 text-4xl font-bold text-red-500">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col justify-center gap-4 sm:flex-row">
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
                <Link href={btn.href}>{btn.label}</Link>
              </Button>
            ))}
          </div>

          {/* Additional Links */}
          <div className="flex flex-col justify-center gap-6 text-center sm:flex-row">
            {secondaryLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="font-semibold text-red-500 hover:text-red-400"
              >
                {link.label} →
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import {
  Users,
  Palette,
  DollarSign,
  Award,
  Shield,
  Check,
  Package,
  Shirt,
  Star,
} from "lucide-react";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Screen Printing Canada | Bulk Orders from $2.50/piece | PrintGuys",
  description: "Professional screen printing in Canada. Best for bulk orders starting at $2.50/piece. Vibrant colors, durable prints for uniforms, events & merchandise. Call 647-685-6286.",
  keywords: "screen printing Canada, bulk t-shirt printing, custom screen printing, team uniforms, event merchandise, wholesale screen printing",
};

const screenPrintingFeatures = [
  {
    icon: Palette,
    title: "Vibrant Colors",
    description: "Bold, opaque colors that stand out on any garment color",
  },
  {
    icon: Shield,
    title: "Durable",
    description: "Long-lasting prints that withstand 50+ wash cycles",
  },
  {
    icon: DollarSign,
    title: "Cost-Effective",
    description: "Best pricing for bulk orders - the more you print, the more you save",
  },
  {
    icon: Award,
    title: "Premium Quality",
    description: "Professional-grade inks and equipment for consistent results",
  },
  {
    icon: Users,
    title: "Team Ready",
    description: "Perfect for uniforms, team jerseys, and group apparel",
  },
  {
    icon: Package,
    title: "Fast Bulk Production",
    description: "Quick turnaround on large orders with streamlined workflow",
  },
];

const useCases = [
  {
    title: "Team Uniforms",
    description: "Sports teams, corporate uniforms, and staff apparel",
    items: ["Sports jerseys", "Work uniforms", "Safety vests", "Team shirts"],
    icon: Shirt,
  },
  {
    title: "Events & Merchandise",
    description: "Concerts, festivals, conferences, and promotional items",
    items: ["Event t-shirts", "Festival merch", "Conference swag", "Promotional gear"],
    icon: Star,
  },
  {
    title: "Bulk Orders",
    description: "Wholesale pricing for large quantity orders",
    items: ["100+ pieces", "School spirit wear", "Fundraising", "Retail merchandise"],
    icon: Package,
  },
];

const pricingTiers = [
  { quantity: "12-24", price: "$8.50", piece: "per piece", note: "Small batches" },
  { quantity: "25-49", price: "$5.00", piece: "per piece", note: "Medium orders" },
  { quantity: "50-99", price: "$3.50", piece: "per piece", note: "Large orders" },
  { quantity: "100-249", price: "$2.75", piece: "per piece", note: "Bulk pricing" },
  { quantity: "250+", price: "$2.50", piece: "per piece", note: "Best value", highlight: true },
];

const howItWorksSteps = [
  {
    number: 1,
    title: "Design Setup",
    description: "Submit your artwork or work with our design team to create perfect screens",
  },
  {
    number: 2,
    title: "Screen Preparation",
    description: "We create custom screens for each color in your design",
  },
  {
    number: 3,
    title: "Print Production",
    description: "Each garment is printed with precision using professional equipment",
  },
  {
    number: 4,
    title: "Quality & Delivery",
    description: "Rigorous quality check and fast shipping to your door",
  },
];

const inkTypes = [
  {
    title: "Standard Plastisol",
    description: "Most common ink type - vibrant, durable, and cost-effective",
    features: ["Bold colors", "Smooth finish", "Great coverage", "Affordable"],
  },
  {
    title: "Water-Based",
    description: "Eco-friendly option with soft, breathable feel",
    features: ["Soft hand feel", "Eco-friendly", "Vibrant colors", "Premium look"],
  },
  {
    title: "Specialty Inks",
    description: "Premium effects for standout designs",
    features: ["Metallic", "Glow-in-dark", "Puff/3D", "Discharge"],
  },
];

export default function ScreenPrintingPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://printguys.ca' },
        { name: 'Services', url: 'https://printguys.ca/services' },
        { name: 'Screen Printing', url: 'https://printguys.ca/services/screen-printing' },
      ]} />
      {/* Hero Section */}
      <ServiceHero
        title="Screen Printing"
        subtitle="Best for bulk orders - premium quality at unbeatable prices"
        price="$2.50"
        priceNote="Per piece (250+ pieces)"
        features={[
          "Vibrant, Bold Colors",
          "Durable & Long-Lasting",
          "Cost-Effective for Bulk",
          "Perfect for Teams & Events",
          "Multiple Ink Options",
          "Fast Production",
        ]}
        ctaButtons={[
          { text: "Get Screen Print Quote", href: "/contact", variant: "default" },
          { text: "Call: 647-685-6286", href: "tel:6476856286", variant: "outline" },
        ]}
      />

      {/* Key Stats */}
      <section className="border-y border-red-600/20 bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">$2.50</div>
              <div className="text-sm text-gray-400">From Per Piece</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">250+</div>
              <div className="text-sm text-gray-400">Bulk Orders</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">50+</div>
              <div className="text-sm text-gray-400">Wash Cycles</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Unlimited</div>
              <div className="text-sm text-gray-400">Colors Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Why Screen Printing?
            </h2>
            <p className="text-xl text-gray-400">
              The gold standard for bulk apparel printing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {screenPrintingFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-gray-800 bg-zinc-900 transition-colors hover:border-red-600/50"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Bulk Pricing Tiers
            </h2>
            <p className="text-xl text-gray-400">
              The more you order, the more you save
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  Price Per Piece (Single Color, One Location)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-bold text-white">Quantity</th>
                        <th className="py-3 px-4 font-bold text-white">Price</th>
                        <th className="py-3 px-4 font-bold text-white">Note</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {pricingTiers.map((tier, index) => (
                        <tr
                          key={index}
                          className={`border-b border-gray-700 transition-colors hover:bg-gray-800 ${
                            tier.highlight ? "bg-red-900/20" : ""
                          }`}
                        >
                          <td className="py-3 px-4 font-semibold text-white">
                            {tier.quantity}
                            {tier.highlight && (
                              <span className="ml-2 text-xs text-red-500">
                                Best Value
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 font-bold text-red-500">
                            {tier.price}
                          </td>
                          <td className="py-3 px-4 text-sm">{tier.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-lg border border-red-600/30 bg-zinc-900 p-4">
                  <p className="text-center text-sm text-gray-300">
                    <span className="font-bold text-white">Note:</span> Prices are for
                    single-color, one-location prints.{" "}
                    <Link href="/contact" className="text-red-500 underline hover:text-red-400">
                      Contact us
                    </Link>{" "}
                    for multi-color or multi-location quotes.
                  </p>
                </div>

                <div className="mt-6 flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="bg-red-600 px-6 py-3 font-bold hover:bg-red-700"
                  >
                    <Link href="/contact">Get Custom Quote</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-red-600 bg-transparent px-6 py-3 font-bold text-red-500 hover:bg-red-600 hover:text-white"
                  >
                    <a href="tel:6476856286">Call Now</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Perfect For Your Project
            </h2>
            <p className="text-xl text-gray-400">
              Screen printing excels at these applications
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="border-gray-800 bg-zinc-900">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white">{useCase.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-400">
                      {useCase.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.items.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="border-gray-700 text-gray-300"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ink Types Section */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Ink Options
            </h2>
            <p className="text-xl text-gray-400">
              Choose the right ink for your project
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {inkTypes.map((ink) => (
              <Card key={ink.title} className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">{ink.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-400">{ink.description}</p>
                  <ul className="space-y-2">
                    {ink.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <ProcessSteps
            title="How Screen Printing Works"
            steps={howItWorksSteps}
          />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready for Premium Screen Printing?"
        description="Get started with bulk pricing and professional quality today"
        primaryButton={{ label: "Get Your Screen Print Quote", href: "/contact" }}
        secondaryButton={{
          label: "Call 647-685-6286",
          href: "tel:6476856286",
          variant: "outline",
          isPhone: true,
        }}
      />
    </>
  );
}

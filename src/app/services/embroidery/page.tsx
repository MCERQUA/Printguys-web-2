import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import {
  Award,
  Shield,
  Gem,
  Building2,
  Shirt,
  Gift,
  Check,
  Crown,
  Medal,
} from "lucide-react";
import type { Metadata } from "next";
import { BreadcrumbSchema } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Custom Embroidery Canada | Professional Branding from $8/piece | PrintGuys",
  description: "Premium custom embroidery in Canada. Professional branding from $8.00/piece. Durable, premium quality for corporate wear, uniforms & gifts. Call 647-685-6286.",
  keywords: "custom embroidery Canada, embroidered polos, corporate embroidery, uniform embroidery, logo embroidery, custom embroidered apparel",
};

const embroideryFeatures = [
  {
    icon: Award,
    title: "Professional Look",
    description: "Elevated appearance that conveys quality and attention to detail",
  },
  {
    icon: Shield,
    title: "Durable",
    description: "Stitching that outlasts the garment itself - lifetime durability",
  },
  {
    icon: Gem,
    title: "Premium Quality",
    description: "High-end thread and precise stitching for exceptional results",
  },
  {
    icon: Crown,
    title: "Texture & Depth",
    description: "Tactile, dimensional design that stands out from flat prints",
  },
  {
    icon: Medal,
    title: "Color Options",
    description: "Unlimited thread colors to match any brand or design",
  },
  {
    icon: Building2,
    title: "Corporate Ready",
    description: "Perfect for businesses seeking professional branded apparel",
  },
];

const useCases = [
  {
    title: "Corporate Wear",
    description: "Professional branding for businesses and organizations",
    items: ["Polos", "Dress shirts", "Jackets", "Caps"],
    icon: Building2,
  },
  {
    title: "Uniforms",
    description: "Durable identification for staff and teams",
    items: ["Work uniforms", "Security", "Hospitality", "Healthcare"],
    icon: Shirt,
  },
  {
    title: "Premium Gifts",
    description: "High-end personalized items for clients and employees",
    items: ["Towels", "Robes", "Bags", "Aprons"],
    icon: Gift,
  },
];

const pricingTiers = [
  { quantity: "1-11", price: "$15.00", piece: "per piece", note: "Single items" },
  { quantity: "12-23", price: "$12.00", piece: "per piece", note: "Small batches" },
  { quantity: "24-49", price: "$10.00", piece: "per piece", note: "Medium orders" },
  { quantity: "50-99", price: "$9.00", piece: "per piece", note: "Large orders" },
  { quantity: "100+", price: "$8.00", piece: "per piece", note: "Bulk pricing", highlight: true },
];

const howItWorksSteps = [
  {
    number: 1,
    title: "Digitize Design",
    description: "Convert your logo into a stitch-ready digital format",
  },
  {
    number: 2,
    title: "Setup & Hoop",
    description: "Garment is prepared and hooped for precise stitching",
  },
  {
    number: 3,
    title: "Embroider",
    description: "Commercial machines stitch your design with precision",
  },
  {
    number: 4,
    title: "Finish & Deliver",
    description: "Backing is applied, excess thread removed, and shipped to you",
  },
];

const garmentTypes = [
  {
    title: "Headwear",
    items: ["Baseball caps", "Beanies", "Visors", "Bucket hats"],
    positions: ["Front", "Side", "Back"],
  },
  {
    title: "Shirts & Tops",
    items: ["Polos", "Dress shirts", "T-shirts", "Jackets"],
    positions: ["Left chest", "Right chest", "Back", "Sleeves"],
  },
  {
    title: "Outerwear",
    items: ["Hoodies", "Sweatshirts", "Vests", "Coats"],
    positions: ["Left chest", "Back yoke", "Full back"],
  },
  {
    title: "Accessories",
    items: ["Towels", "Bags", "Aprons", "Robes"],
    positions: ["Corner", "Center", "Custom placement"],
  },
];

const threadTypes = [
  {
    title: "Polyester Thread",
    description: "Standard premium thread - durable, colorfast, and vibrant",
    features: ["High sheen", "Colorfast", "Bleach resistant", "Most popular"],
  },
  {
    title: "Rayon Thread",
    description: "Premium thread with exceptional sheen for luxury items",
    features: ["Brilliant shine", "Smooth finish", "Premium look", "Light duty"],
  },
  {
    title: "Specialty Threads",
    description: "Unique effects for standout designs",
    features: ["Metallic gold/silver", "Glow-in-dark", "Variegated", "Neon"],
  },
];

export default function EmbroideryPage() {
  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://printguys.ca' },
        { name: 'Services', url: 'https://printguys.ca/services' },
        { name: 'Custom Embroidery', url: 'https://printguys.ca/services/embroidery' },
      ]} />
      {/* Hero Section */}
      <ServiceHero
        title="Custom Embroidery"
        subtitle="Professional branding with premium stitched quality"
        price="$8.00"
        priceNote="Per piece (100+ pieces)"
        features={[
          "Professional & Premium",
          "Lifetime Durability",
          "Tactile Texture & Depth",
          "Unlimited Thread Colors",
          "Any Garment Type",
          "Corporate Ready",
        ]}
        ctaButtons={[
          { text: "Get Embroidery Quote", href: "/contact", variant: "default" },
          { text: "Call: 647-685-6286", href: "tel:6476856286", variant: "outline" },
        ]}
      />

      {/* Key Stats */}
      <section className="border-y border-red-600/20 bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">$8.00</div>
              <div className="text-sm text-gray-400">From Per Piece</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Lifetime</div>
              <div className="text-sm text-gray-400">Durability</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">10,000+</div>
              <div className="text-sm text-gray-400">Thread Colors</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Any Garment</div>
              <div className="text-sm text-gray-400">Type Supported</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Why Choose Embroidery?
            </h2>
            <p className="text-xl text-gray-400">
              Premium branding that elevates your brand
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {embroideryFeatures.map((feature) => {
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
              Embroidery Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Based on stitch count and quantity
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <Card className="border-gray-800 bg-black">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  Price Per Piece (Left Chest Logo, ~5,000 stitches)
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
                    <span className="font-bold text-white">Note:</span> One-time digitization fee applies
                    ($15-50 depending on complexity).{" "}
                    <Link href="/contact" className="text-red-500 underline hover:text-red-400">
                      Contact us
                    </Link>{" "}
                    for custom stitch count quotes.
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
              Perfect Applications
            </h2>
            <p className="text-xl text-gray-400">
              Embroidery excels at professional branding
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

      {/* Garment Types & Positions */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Garment Types & Placement
            </h2>
            <p className="text-xl text-gray-400">
              We embroider on virtually any item
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {garmentTypes.map((garment) => (
              <Card key={garment.title} className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">{garment.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 text-sm text-gray-400">
                    <span className="font-semibold text-white">Items:</span> {garment.items.join(", ")}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {garment.positions.map((position) => (
                      <Badge
                        key={position}
                        variant="outline"
                        className="border-red-600/50 bg-red-600/10 text-red-400"
                      >
                        {position}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Thread Types Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Thread Options
            </h2>
            <p className="text-xl text-gray-400">
              Premium threads for premium results
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {threadTypes.map((thread) => (
              <Card key={thread.title} className="border-gray-800 bg-zinc-900">
                <CardHeader>
                  <CardTitle className="text-white">{thread.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-400">{thread.description}</p>
                  <ul className="space-y-2">
                    {thread.features.map((feature) => (
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
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <ProcessSteps
            title="How Embroidery Works"
            steps={howItWorksSteps}
          />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready for Premium Embroidery?"
        description="Get professional branding that lasts a lifetime"
        primaryButton={{ label: "Get Your Embroidery Quote", href: "/contact" }}
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, Phone, Mail, Flame, Zap, Scissors, Palette, Shield, Tag } from "lucide-react";

export const metadata = {
  title: "Pricing",
  description: "Transparent pricing for DTF transfers, screen printing, embroidery, and all custom printing services. No hidden fees, no minimums on DTF.",
};

const dtfPricing = [
  { size: "Small (up to 25 sq in)", example: '5" x 5"', price: "$0.95", perSq: "$0.038/sq in" },
  { size: "Medium (26-50 sq in)", example: '7" x 7"', price: "$1.90", perSq: "$0.038/sq in" },
  { size: "Large (51-100 sq in)", example: '10" x 10"', price: "$3.80", perSq: "$0.038/sq in" },
  { size: "XL (101-200 sq in)", example: '14" x 14"', price: "$7.60", perSq: "$0.038/sq in" },
  { size: "XXL (201-400 sq in)", example: '20" x 20"', price: "$15.20", perSq: "$0.038/sq in" },
];

const services = [
  {
    name: "DTF Heat Transfers",
    icon: Flame,
    color: "red",
    pricing: "$0.038/sq inch",
    minimum: "No minimum",
    turnaround: "2-5 days",
    features: [
      "Works on any fabric",
      "Full color prints",
      "50+ wash durability",
      "Gang sheet discounts",
    ],
  },
  {
    name: "Screen Printing",
    icon: Zap,
    color: "blue",
    pricing: "Starting at $8/shirt",
    minimum: "12 pieces",
    turnaround: "3-7 days",
    features: [
      "Best for bulk orders",
      "Up to 8 colors",
      "Volume discounts",
      "Plastisol & water-based inks",
    ],
  },
  {
    name: "Custom Embroidery",
    icon: Scissors,
    color: "purple",
    pricing: "Starting at $6/piece",
    minimum: "6 pieces",
    turnaround: "5-10 days",
    features: [
      "Premium thread quality",
      "50+ thread colors",
      "Digitizing included",
      "Perfect for corporate",
    ],
  },
  {
    name: "Sublimation",
    icon: Palette,
    color: "pink",
    pricing: "Starting at $12/piece",
    minimum: "No minimum",
    turnaround: "3-5 days",
    features: [
      "Photo-quality prints",
      "All-over printing",
      "Mugs, mousepads & more",
      "Polyester fabrics only",
    ],
  },
  {
    name: "Safety Wear",
    icon: Shield,
    color: "yellow",
    pricing: "Contact for quote",
    minimum: "6 pieces",
    turnaround: "5-10 days",
    features: [
      "CSA/ANSI compliant",
      "Hi-vis options",
      "Custom branding",
      "Bulk discounts",
    ],
  },
  {
    name: "UV DTF Stickers",
    icon: Tag,
    color: "green",
    pricing: "Starting at $0.50/piece",
    minimum: "No minimum",
    turnaround: "2-5 days",
    features: [
      "Waterproof & durable",
      "Any surface application",
      "Full color",
      "Custom shapes",
    ],
  },
];

const colorMap: Record<string, string> = {
  red: "bg-red-600",
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  pink: "bg-pink-600",
  yellow: "bg-yellow-600",
  green: "bg-green-600",
};

export default function PricingPage() {
  return (
    <main className="bg-black text-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">
              Transparent{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="mb-4 text-xl text-gray-300 lg:text-2xl">
              No hidden fees. No surprises. Just honest pricing.
            </p>
            <p className="text-lg text-gray-400">
              Get exactly what you pay for with our straightforward pricing structure.
            </p>
          </div>
        </div>
      </section>

      {/* DTF Pricing Table */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600/20 px-4 py-2 text-red-400">
              <Flame className="h-5 w-5" />
              <span>Most Popular</span>
            </div>
            <h2 className="mb-4 text-4xl font-bold text-white">DTF Transfer Pricing</h2>
            <p className="text-xl text-gray-400">
              Simple per-square-inch pricing with no minimums
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="overflow-hidden rounded-xl border border-gray-700">
              <table className="w-full">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-white">Size</th>
                    <th className="px-6 py-4 text-left font-bold text-white">Example</th>
                    <th className="px-6 py-4 text-right font-bold text-white">Starting Price</th>
                    <th className="px-6 py-4 text-right font-bold text-white">Per Sq Inch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {dtfPricing.map((tier, i) => (
                    <tr key={i} className="bg-gray-900 hover:bg-gray-800">
                      <td className="px-6 py-4 font-medium text-white">{tier.size}</td>
                      <td className="px-6 py-4 text-gray-400">{tier.example}</td>
                      <td className="px-6 py-4 text-right font-bold text-red-500">{tier.price}</td>
                      <td className="px-6 py-4 text-right text-gray-400">{tier.perSq}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-center text-sm text-gray-500">
              * Volume discounts available for orders over 100 pieces. Gang sheet pricing available.
            </p>
          </div>
        </div>
      </section>

      {/* All Services Pricing */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">All Services Pricing</h2>
            <p className="text-xl text-gray-400">
              Complete pricing overview for all our printing services
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <div
                  key={i}
                  className="rounded-xl border border-gray-700 bg-gray-900 p-6 transition-all hover:border-gray-600"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${colorMap[service.color]}`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  </div>

                  <div className="mb-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Pricing:</span>
                      <span className="font-bold text-red-500">{service.pricing}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Minimum:</span>
                      <span className="text-white">{service.minimum}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Turnaround:</span>
                      <span className="text-white">{service.turnaround}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-700 pt-4">
                    <ul className="space-y-2">
                      {service.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                          <Check className="h-4 w-4 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Volume Discounts */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Volume Discounts</h2>
            <p className="mb-8 text-xl text-gray-400">
              The more you order, the more you save
            </p>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg bg-black p-6">
                <div className="text-3xl font-bold text-white">1-49</div>
                <div className="text-gray-400">pieces</div>
                <div className="mt-2 text-lg font-bold text-red-500">Standard</div>
              </div>
              <div className="rounded-lg bg-black p-6">
                <div className="text-3xl font-bold text-white">50-99</div>
                <div className="text-gray-400">pieces</div>
                <div className="mt-2 text-lg font-bold text-red-500">5% Off</div>
              </div>
              <div className="rounded-lg bg-black p-6">
                <div className="text-3xl font-bold text-white">100-499</div>
                <div className="text-gray-400">pieces</div>
                <div className="mt-2 text-lg font-bold text-red-500">10% Off</div>
              </div>
              <div className="rounded-lg bg-black p-6">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-gray-400">pieces</div>
                <div className="mt-2 text-lg font-bold text-red-500">15% Off</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white">Ready to Get Started?</h2>
          <p className="mb-8 text-xl text-red-100">
            Get an instant quote or contact us for custom pricing
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold text-red-600 hover:bg-gray-100"
            >
              <Link href="/quote">Get Instant Quote</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white hover:bg-white hover:text-red-600"
            >
              <Link href="/contact">
                <Phone className="mr-2 h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-col justify-center gap-4 text-red-100 sm:flex-row sm:gap-8">
            <a href="tel:6476856286" className="flex items-center justify-center gap-2 hover:text-white">
              <Phone className="h-4 w-4" />
              647-685-6286
            </a>
            <a href="mailto:printguys.ca@gmail.com" className="flex items-center justify-center gap-2 hover:text-white">
              <Mail className="h-4 w-4" />
              printguys.ca@gmail.com
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

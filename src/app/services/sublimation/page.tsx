import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ProcessSteps } from "@/components/services/ProcessSteps";
import {
  Palette,
  Maximize,
  Shield,
  Shirt,
  Coffee,
  ShoppingBag,
  Check,
  Sparkles,
  Droplets,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sublimation Printing Canada | Photo-Quality Full Color | PrintGuys",
  description: "Professional sublimation printing in Canada. Photo-quality, full-color, edge-to-edge prints on mugs, apparel & promotional items. Permanent, vibrant results. Call 647-685-6286.",
  keywords: "sublimation printing Canada, custom mugs, photo printing, all over print, sublimation apparel, promotional items printing",
};

const sublimationFeatures = [
  {
    icon: Palette,
    title: "Full Color",
    description: "Unlimited colors with photo-quality resolution and gradient support",
  },
  {
    icon: Maximize,
    title: "Edge-to-Edge",
    description: "Print goes to the edges - no borders or limitations on design area",
  },
  {
    icon: Shield,
    title: "Permanent",
    description: "Ink becomes part of the material - won't crack, peel, or fade",
  },
  {
    icon: Droplets,
    title: "No Feel",
    description: "Smooth finish with no texture - you can't feel the print",
  },
  {
    icon: Sparkles,
    title: "Vibrant Results",
    description: "Colors are bright and continuous tone like a photograph",
  },
  {
    icon: Shirt,
    title: "All-Over Print",
    description: "Cover entire surfaces for maximum design impact",
  },
];

const productCategories = [
  {
    title: "Drinkware",
    description: "Custom printed mugs, tumblers, and bottles",
    items: ["Coffee mugs", "Travel tumblers", "Water bottles", "Stadium cups"],
    icon: Coffee,
  },
  {
    title: "Apparel",
    description: "Polyester garments with all-over printing",
    items: ["Performance shirts", "Jerseys", "Activewear", "Swimwear"],
    icon: Shirt,
  },
  {
    title: "Promotional Items",
    description: "Branded merchandise for events and marketing",
    items: ["Tote bags", "Mouse pads", "Phone cases", "Keychains"],
    icon: ShoppingBag,
  },
  {
    title: "Home & Office",
    description: "Custom products for everyday use",
    items: ["Coasters", "Placemats", "Pillow cases", "Wall art"],
    icon: Sparkles,
  },
];

const pricingExamples = [
  { item: "11oz Coffee Mug", price: "$8.50", note: "Full wrap print" },
  { item: "Performance T-Shirt", price: "$25.00", note: "All-over print" },
  { item: "Mouse Pad", price: "$6.00", note: "Full surface" },
  { item: "Tote Bag", price: "$12.00", note: "Both sides" },
  { item: "Phone Case", price: "$15.00", note: "Custom design" },
  { item: "Coaster Set (4)", price: "$10.00", note: "Per set" },
];

const howItWorksSteps = [
  {
    number: 1,
    title: "Design Creation",
    description: "Create or provide your full-color design - any resolution or complexity",
  },
  {
    number: 2,
    title: "Transfer Print",
    description: "Design is printed on special sublimation paper with sublimation ink",
  },
  {
    number: 3,
    title: "Heat Transfer",
    description: "Heat press transfers ink into the material at 400°F",
  },
  {
    number: 4,
    title: "Permanent Result",
    description: "Ink becomes part of the material - permanent, vibrant, and smooth",
  },
];

const designTips = [
  {
    title: "Use High Resolution",
    description: "300 DPI or higher for photo-quality results",
  },
  {
    title: "CMYK Color Mode",
    description: "Design in CMYK for accurate color reproduction",
  },
  {
    title: "Bold, Vibrant Colors",
    description: "Sublimation excels at bright, saturated colors",
  },
  {
    title: "No White Ink",
    description: "White areas show the material color - design accordingly",
  },
  {
    title: "Edge-to-Edge Design",
    description: "Use full surface area for maximum impact",
  },
  {
    title: "Photographs Welcome",
    description: "Photos and gradients print beautifully",
  },
];

const materialNotes = [
  {
    title: "Polyester Required",
    description: "Must be polyester or polymer-coated for sublimation to work",
    items: ["100% polyester best", "Poly-coated items", "Hard surfaces", "Specialty materials"],
  },
  {
    title: "No Cotton",
    description: "Cotton and natural fibers cannot be sublimated",
    items: ["Use HTV instead", "Screen printing option", "DTF alternative", "Ask us about alternatives"],
  },
];

export default function SublimationPage() {
  return (
    <>
      {/* Hero Section */}
      <ServiceHero
        title="Sublimation Printing"
        subtitle="Photo-quality, full-color, permanent prints"
        features={[
          "Full Color Unlimited",
          "Edge-to-Edge Printing",
          "Photo-Quality Results",
          "Permanent - No Cracking",
          "Smooth - No Texture",
          "All-Over Design Capability",
        ]}
        ctaButtons={[
          { text: "Get Sublimation Quote", href: "/contact", variant: "default" },
          { text: "Call: 647-685-6286", href: "tel:6476856286", variant: "outline" },
        ]}
      />

      {/* Key Stats */}
      <section className="border-y border-red-600/20 bg-zinc-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Full</div>
              <div className="text-sm text-gray-400">Color Spectrum</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Photo</div>
              <div className="text-sm text-gray-400">Quality Results</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">Edge</div>
              <div className="text-sm text-gray-400">To Edge Print</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-3xl font-bold text-red-500">No Feel</div>
              <div className="text-sm text-gray-400">Smooth Finish</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Why Sublimation?
            </h2>
            <p className="text-xl text-gray-400">
              The ultimate in full-color printing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {sublimationFeatures.map((feature) => {
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

      {/* Product Categories */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              What We Can Sublimate
            </h2>
            <p className="text-xl text-gray-400">
              Endless possibilities for full-color printing
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {productCategories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="border-gray-800 bg-black">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-400">
                      {category.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
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

      {/* Pricing Examples */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Sample Pricing
            </h2>
            <p className="text-xl text-gray-400">
              Popular items with sublimation printing
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Card className="border-gray-800 bg-zinc-900">
              <CardHeader>
                <CardTitle className="text-center text-white">
                  Common Items & Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="py-3 px-4 font-bold text-white">Item</th>
                        <th className="py-3 px-4 font-bold text-white">Price</th>
                        <th className="py-3 px-4 font-bold text-white">Details</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      {pricingExamples.map((item, index) => (
                        <tr
                          key={index}
                          className="border-b border-gray-700 transition-colors hover:bg-gray-800"
                        >
                          <td className="py-3 px-4 font-semibold text-white">
                            {item.item}
                          </td>
                          <td className="py-3 px-4 font-bold text-red-500">
                            {item.price}
                          </td>
                          <td className="py-3 px-4 text-sm">{item.note}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 rounded-lg border border-red-600/30 bg-zinc-900 p-4">
                  <p className="text-center text-sm text-gray-300">
                    <span className="font-bold text-white">Note:</span> Pricing varies based on
                    quantity, item type, and design complexity.{" "}
                    <Link href="/contact" className="text-red-500 underline hover:text-red-400">
                      Contact us
                    </Link>{" "}
                    for accurate quotes on your project.
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

      {/* Design Tips */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Design Tips for Best Results
            </h2>
            <p className="text-xl text-gray-400">
              How to prepare your artwork for sublimation
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {designTips.map((tip) => (
              <Card key={tip.title} className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Material Notes */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
              Important Material Notes
            </h2>
            <p className="text-xl text-gray-400">
              Understanding what can be sublimated
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-green-600/50 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-400">
                  <Check className="h-5 w-5" />
                  Can Be Sublimated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-400">
                  {materialNotes[0].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {materialNotes[0].items.map((item) => (
                    <Badge
                      key={item}
                      className="border-green-600/50 bg-green-600/10 text-green-400"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-600/50 bg-zinc-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-400">
                  Cannot Be Sublimated
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-400">
                  {materialNotes[1].description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {materialNotes[1].items.map((item) => (
                    <Badge
                      key={item}
                      variant="outline"
                      className="border-gray-700 text-gray-400"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <ProcessSteps
            title="How Sublimation Works"
            steps={howItWorksSteps}
          />
        </div>
      </section>

      {/* CTA Section */}
      <CTASection
        title="Ready for Full-Color Sublimation?"
        description="Get photo-quality, permanent prints on your items today"
        primaryButton={{ label: "Get Your Sublimation Quote", href: "/contact" }}
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

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import {
  Droplets,
  Sun,
  Scissors,
  Ruler,
  Smartphone,
  Laptop,
  Coffee,
  Shield,
  Sparkles,
} from "lucide-react";

export default function UvDtfStickersPage() {
  const features = [
    {
      icon: Droplets,
      title: "100% Waterproof",
      description: "UV DTF stickers are completely waterproof - perfect for water bottles, tumblers, and outdoor use",
    },
    {
      icon: Sun,
      title: "UV Resistant",
      description: "Special UV-cured top coat prevents fading from sun exposure for long-lasting vibrancy",
    },
    {
      icon: Shield,
      title: "Scratch Resistant",
      description: "Durable epoxy-like coating protects designs from scratches and daily wear",
    },
    {
      icon: Sparkles,
      title: "Vibrant Colors",
      description: "Full-color printing with exceptional color accuracy and detail",
    },
  ];

  const applications = [
    {
      icon: Coffee,
      title: "Drinkware",
      items: ["Water Bottles", "Tumblers", "Coffee Mugs", "Wine Glasses"],
    },
    {
      icon: Smartphone,
      title: "Tech Accessories",
      items: ["Phone Cases", "Laptops", "Tablets", "Chargers"],
    },
    {
      icon: Laptop,
      title: "Equipment",
      items: ["Tools", "Hard Hats", "Equipment Cases", "Vehicle Interiors"],
    },
    {
      icon: Scissors,
      title: "Custom Products",
      items: ["Cosmetics", "Product Labels", "Packaging", "Promotional Items"],
    },
  ];

  const sizeOptions = [
    { name: "Small", size: "Up to 2\"", description: "Logos, icons, small designs" },
    { name: "Medium", size: "2\" - 4\"", description: "Standard stickers, labels" },
    { name: "Large", size: "4\" - 6\"", description: "Full graphics, large designs" },
    { name: "Custom", size: "Any size", description: "Custom sizing available" },
  ];

  const comparisonData = [
    { feature: "Waterproof", uvDtf: true, vinyl: true, paper: false },
    { feature: "UV Resistant", uvDtf: true, vinyl: true, paper: false },
    { feature: "Full Color", uvDtf: true, vinyl: false, paper: true },
    { feature: "Complex Cuts", uvDtf: true, vinyl: false, paper: true },
    { feature: "Durability", uvDtf: "Excellent", vinyl: "Good", paper: "Poor" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-red-600 bg-red-600/20 text-red-500">
              UV DTF Stickers
            </Badge>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Waterproof{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Custom Stickers
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
              Premium UV-cured direct-to-film stickers. Waterproof, fade-resistant, and incredibly durable.
            </p>

            {/* Key Features */}
            <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">100%</div>
                <div className="text-sm text-gray-400">Waterproof</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">3+ Years</div>
                <div className="text-sm text-gray-400">Outdoor Life</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">Full Color</div>
                <div className="text-sm text-gray-400">Photo Quality</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">No Min</div>
                <div className="text-sm text-gray-400">Order 1 or 1000</div>
              </div>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-red-600 px-8 py-4 text-lg font-bold hover:bg-red-700"
              >
                <Link href="/contact">Get Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-red-600 bg-transparent px-8 py-4 text-lg font-bold text-red-500 hover:bg-red-600 hover:text-white"
              >
                <a href="tel:6476856286">Call: 647-685-6286</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Why UV DTF?</h2>
            <p className="text-xl text-gray-400">The ultimate sticker solution for any surface</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="border-gray-800 bg-zinc-900 hover:border-red-600/50 transition-colors">
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

      {/* Applications Section */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Perfect For</h2>
            <p className="text-xl text-gray-400">Indoor and outdoor applications</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {applications.map((app) => {
              const Icon = app.icon;
              return (
                <Card key={app.title} className="border-gray-800 bg-black">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20">
                        <Icon className="h-5 w-5 text-red-500" />
                      </div>
                      <CardTitle className="text-white">{app.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {app.items.map((item) => (
                        <Badge key={item} variant="outline" className="border-gray-700 text-gray-300">
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

      {/* Size Options */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Size Options</h2>
            <p className="text-xl text-gray-400">Custom sizes to fit your needs</p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
            {sizeOptions.map((option) => (
              <Card key={option.name} className="border-gray-800 bg-zinc-900">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-white">{option.name}</h3>
                      <p className="mb-2 text-2xl font-bold text-red-500">{option.size}</p>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                    <Ruler className="h-6 w-6 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">How It Works</h2>
            <p className="text-xl text-gray-400">Simple peel-and-stick application</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-6">
              <Card className="border-gray-800 bg-black">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                      1
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">Send Your Design</h3>
                      <p className="text-gray-400">
                        Send us your artwork or let us create a custom design for you
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                      2
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">We Print & Cure</h3>
                      <p className="text-gray-400">
                        Your design is printed with UV-cured inks and a protective top coat
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white font-bold">
                      3
                    </div>
                    <div>
                      <h3 className="mb-2 text-lg font-bold text-white">Peel & Stick</h3>
                      <p className="text-gray-400">
                        Simply peel off the backing and apply to any clean, smooth surface
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready for UV DTF Stickers?"
        description="Get started with your custom waterproof stickers today"
        primaryButton={{ label: "Get Sticker Quote", href: "/contact" }}
        secondaryButton={{ label: "Call 647-685-6286", href: "tel:6476856286", variant: "outline", isPhone: true }}
      />
    </>
  );
}

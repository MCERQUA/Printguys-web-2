import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import {
  Flag,
  Droplets,
  Sun,
  Scissors,
  CircleDot,
  Ruler,
  Store,
  Calendar,
  GraduationCap,
  Building2,
  HeartHandshake,
} from "lucide-react";

export default function VinylBannersPage() {
  const features = [
    {
      icon: Sun,
      title: "Weather Resistant",
      description: "Designed for outdoor use with UV-resistant inks that won't fade",
    },
    {
      icon: Droplets,
      title: "Waterproof",
      description: "Heavy-duty vinyl material stands up to rain, snow, and humidity",
    },
    {
      icon: Flag,
      title: "Durable & Long-Lasting",
      description: "13oz scrim vinyl with reinforced material for extended outdoor use",
    },
    {
      icon: Scissors,
      title: "Custom Finishing",
      description: "Choose from hemmed edges, grommets, or pole pockets",
    },
  ];

  const sizes = [
    { name: "Small", dimensions: "2' × 4'", price: "From $25", use: "Table displays, small signs" },
    { name: "Standard", dimensions: "4' × 6'", price: "From $45", use: "Events, storefronts" },
    { name: "Popular", dimensions: "4' × 8'", price: "From $60", use: "Most common size" },
    { name: "Large", dimensions: "8' × 12'", price: "From $120", use: "Backdrops, large displays" },
  ];

  const finishingOptions = [
    {
      name: "Hemmed Edges",
      description: "Reinforced folded edges for extra durability and clean appearance",
      icon: "🔲",
      recommended: true,
    },
    {
      name: "Grommets",
      description: "Metal grommets placed every 2-4 feet for easy hanging with rope or bungees",
      icon: "⭕",
      recommended: true,
    },
    {
      name: "Pole Pockets",
      description: "Sewn pockets on top/bottom or sides for banner poles or dowels",
      icon: "〰️",
      recommended: false,
    },
    {
      name: "Clean Cut",
      description: "Straight cut edges with no finishing - most economical option",
      icon: "✂️",
      recommended: false,
    },
  ];

  const useCases = [
    {
      icon: Store,
      title: "Business & Retail",
      items: ["Grand Openings", "Storefront Signs", "Sales & Promotions", "Holiday Decorations"],
    },
    {
      icon: Calendar,
      title: "Events & Parties",
      items: ["Birthdays", "Weddings", "Graduations", "Anniversaries"],
    },
    {
      icon: GraduationCap,
      title: "Schools & Organizations",
      items: ["Sports Teams", "Club Events", "Fundraisers", "School Spirit"],
    },
    {
      icon: HeartHandshake,
      title: "Community & Non-Profit",
      items: ["Charity Events", "Concerts", "Festivals", "Religious Gatherings"],
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-red-600 bg-red-600/20 text-red-500">
              Vinyl Banners
            </Badge>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Custom{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Vinyl Banners
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
              Durable, weather-resistant banners for indoor and outdoor use. Full color printing at competitive prices.
            </p>

            {/* Key Features */}
            <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">13oz</div>
                <div className="text-sm text-gray-400">Scrim Vinyl</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">Full Color</div>
                <div className="text-sm text-gray-400">CMYK Printing</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">Indoor/Outdoor</div>
                <div className="text-sm text-gray-400">Weather Resistant</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">48hrs</div>
                <div className="text-sm text-gray-400">Fast Turnaround</div>
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
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Why Vinyl Banners?</h2>
            <p className="text-xl text-gray-400">Built to last indoors and outdoors</p>
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

      {/* Size Options */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Popular Sizes</h2>
            <p className="text-xl text-gray-400">Standard sizes or custom dimensions available</p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
            {sizes.map((size) => (
              <Card key={size.name} className="border-gray-800 bg-black">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-xl font-bold text-white">{size.name}</h3>
                        {size.name === "Popular" && (
                          <Badge className="bg-red-600 text-white text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="mb-2 text-2xl font-bold text-red-500">{size.dimensions}</p>
                      <p className="mb-1 text-sm text-gray-400">{size.use}</p>
                      <p className="text-sm font-semibold text-white">{size.price}</p>
                    </div>
                    <Ruler className="h-6 w-6 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              Need a custom size?{" "}
              <Link href="/contact" className="text-red-500 hover:underline">
                Contact us for a quote
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Finishing Options */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Finishing Options</h2>
            <p className="text-xl text-gray-400">Choose how your banner is finished</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {finishingOptions.map((option) => (
              <Card key={option.name} className={`border ${option.recommended ? "border-red-600" : "border-gray-800"} bg-zinc-900`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-zinc-800 text-2xl">
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{option.name}</h3>
                        {option.recommended && (
                          <Badge className="bg-red-600 text-white text-xs">Recommended</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{option.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Perfect For</h2>
            <p className="text-xl text-gray-400">Any occasion, any message</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="border-gray-800 bg-black">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20">
                        <Icon className="h-5 w-5 text-red-500" />
                      </div>
                      <CardTitle className="text-white">{useCase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {useCase.items.map((item) => (
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

      {/* Material Specs */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">Material Specifications</h2>

            <Card className="border-gray-800 bg-zinc-900">
              <CardContent className="p-8">
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-white">Banner Material</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• 13oz scrim vinyl</li>
                      <li>• 1000×1000 denier</li>
                      <li>• Flexible but durable</li>
                      <li>• Smooth print surface</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-white">Print Quality</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Full-color CMYK printing</li>
                      <li>• 720-1440 DPI resolution</li>
                      <li>• UV-resistant eco-solvent inks</li>
                      <li>• Photo-quality detail</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-white">Weather Resistance</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• 1-3 year outdoor life</li>
                      <li>• Waterproof</li>
                      <li>• Temperature resistant -20°C to 50°C</li>
                      <li>• Fade resistant</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="mb-4 text-lg font-bold text-white">Size Range</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Min: 1&apos; × 1&apos;</li>
                      <li>• Max: 16&apos; wide (any length)</li>
                      <li>• Larger available with seams</li>
                      <li>• Custom sizes welcome</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready for Your Vinyl Banner?"
        description="Get started with your custom banner today"
        primaryButton={{ label: "Get Banner Quote", href: "/contact" }}
        secondaryButton={{ label: "Call 647-685-6286", href: "tel:6476856286", variant: "outline", isPhone: true }}
      />
    </>
  );
}

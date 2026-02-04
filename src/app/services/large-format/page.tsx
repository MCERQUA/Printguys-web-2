import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import {
  Ruler,
  Layout,
  Droplets,
  Sun,
  Warehouse,
  Store,
  Calendar,
  Megaphone,
  Waves,
  StickyNote,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo/schema-markup";

export default function LargeFormatPage() {
  const materials = [
    {
      name: "Vinyl Banners",
      description: "Durable, weather-resistant vinyl for indoor and outdoor use",
      icon: Layout,
      uses: ["Events", "Storefronts", "Trade Shows"],
    },
    {
      name: "Fabric Banners",
      description: "Premium polyester fabric with dye-sublimation printing",
      icon: Droplets,
      uses: ["Backdrops", "Photo Walls", "Interior Displays"],
    },
    {
      name: "Mesh Banners",
      description: "Perforated vinyl that allows wind flow for outdoor installations",
      icon: Waves,
      uses: ["Building Wraps", "Fences", "Scaffolding"],
    },
    {
      name: "Adhesive Vinyl",
      description: "Self-adhesive vinyl for windows, vehicles, and smooth surfaces",
      icon: StickyNote,
      uses: ["Window Graphics", "Vehicle Decals", "Floor Graphics"],
    },
  ];

  const sizes = [
    { name: "Small", dimensions: "2' × 4'", use: "Tabletop displays, small signs" },
    { name: "Medium", dimensions: "4' × 8'", use: "Standard banners, posters" },
    { name: "Large", dimensions: "8' × 12'", use: "Event backdrops, storefronts" },
    { name: "Extra Large", dimensions: "Custom up to 16' wide", use: "Building wraps, stage backdrops" },
  ];

  const useCases = [
    {
      icon: Store,
      title: "Retail & Business",
      items: ["Grand Opening Banners", "Storefront Signs", "Promotional Displays", "Window Graphics"],
    },
    {
      icon: Calendar,
      title: "Events & Celebrations",
      items: ["Wedding Backdrops", "Birthday Banners", "Graduation Displays", "Photo Booths"],
    },
    {
      icon: Warehouse,
      title: "Trade Shows",
      items: ["Booth Backdrops", "Retractable Banners", "Table Throws", "Pop-up Displays"],
    },
    {
      icon: Megaphone,
      title: "Marketing & Advertising",
      items: ["Building Wraps", "Construction Site Signs", "Event Sponsorship", "Fence Graphics"],
    },
  ];

  return (
    <>
      <BreadcrumbSchema items={[
        { name: 'Home', url: 'https://printguys.ca' },
        { name: 'Services', url: 'https://printguys.ca/services' },
        { name: 'Large Format Printing', url: 'https://printguys.ca/services/large-format' },
      ]} />
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-red-600 bg-red-600/20 text-red-500">
              Large Format Printing
            </Badge>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Banners, Signs &{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Displays
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
              Premium large format printing for any project. From small banners to building wraps.
            </p>

            {/* Key Features */}
            <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">16ft</div>
                <div className="text-sm text-gray-400">Max Width</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">Full Color</div>
                <div className="text-sm text-gray-400">CMYK Printing</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">Weatherproof</div>
                <div className="text-sm text-gray-400">Indoor/Outdoor</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">48hrs</div>
                <div className="text-sm text-gray-400">Turnaround</div>
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

      {/* Materials Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Material Options</h2>
            <p className="text-xl text-gray-400">Choose the perfect material for your application</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {materials.map((material) => {
              const Icon = material.icon;
              return (
                <Card key={material.name} className="border-gray-800 bg-zinc-900 hover:border-red-600/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                      <Icon className="h-6 w-6 text-red-500" />
                    </div>
                    <CardTitle className="text-white">{material.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-400">{material.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {material.uses.map((use) => (
                        <Badge key={use} variant="outline" className="border-gray-700 text-gray-300">
                          {use}
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
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Size Options</h2>
            <p className="text-xl text-gray-400">From tabletop displays to building wraps</p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-4 md:grid-cols-2">
            {sizes.map((size) => (
              <Card key={size.name} className="border-gray-800 bg-black">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-xl font-bold text-white">{size.name}</h3>
                      <p className="mb-2 text-2xl font-bold text-red-500">{size.dimensions}</p>
                      <p className="text-sm text-gray-400">{size.use}</p>
                    </div>
                    <Ruler className="h-6 w-6 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Popular Uses</h2>
            <p className="text-xl text-gray-400">Perfect for businesses and events</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {useCases.map((useCase) => {
              const Icon = useCase.icon;
              return (
                <Card key={useCase.title} className="border-gray-800 bg-zinc-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600/20">
                        <Icon className="h-5 w-5 text-red-500" />
                      </div>
                      <CardTitle className="text-white">{useCase.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                      {useCase.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-red-500">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Finishing Options */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-white">Finishing Options</h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-gray-800 bg-black text-center">
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">Hemmed Edges</h3>
                  <p className="text-sm text-gray-400">
                    Reinforced edges for durability and clean appearance
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black text-center">
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">Grommets</h3>
                  <p className="text-sm text-gray-400">
                    Metal grommets placed every 2-4 feet for easy hanging
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-800 bg-black text-center">
                <CardContent className="p-6">
                  <h3 className="mb-3 text-lg font-bold text-white">Pole Pockets</h3>
                  <p className="text-sm text-gray-400">
                    Sewn pockets for banner poles or dowels
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready for Large Format Printing?"
        description="Get started with your custom banners, signs, and displays today"
        primaryButton={{ label: "Get Large Format Quote", href: "/contact" }}
        secondaryButton={{ label: "Call 647-685-6286", href: "tel:6476856286", variant: "outline", isPhone: true }}
      />
    </>
  );
}

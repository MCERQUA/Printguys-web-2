import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CTASection } from "@/components/sections/CTASection";
import {
  ShieldCheck,
  Shirt,
  HardHat,
  Briefcase,
  Users,
  Factory,
  Construction,
  AlertTriangle,
} from "lucide-react";

export default function SafetyWearPage() {
  const certifications = [
    { name: "CSA Z96-15", description: "Canadian High-Visibility Safety Apparel Standard" },
    { name: "ANSI/ISEA 107", description: "American High-Visibility Safety Apparel Standard" },
    { name: "CSA Z161", description: "Safety Footwear Standard" },
    { name: "NFPA 70E", description: "Electrical Safety Requirements" },
  ];

  const categories = [
    {
      icon: Shirt,
      title: "High-Vis Vests",
      description: "Class 2 and Class 3 safety vests in various styles",
      items: ["Surveyor Vests", "Breakaway Vests", "Mesh Vests", "Solid Vests"],
    },
    {
      icon: Briefcase,
      title: "Safety Jackets",
      description: "Weather-resistant jackets with reflective trim",
      items: ["Rain Jackets", "Insulated Jackets", "Windbreakers", "Fleece-Lined"],
    },
    {
      icon: HardHat,
      title: "Safety Pants",
      description: "High-visibility pants for full-body coverage",
      items: ["Work Pants", "Rain Pants", "Insulated Bibs", "Coveralls"],
    },
    {
      icon: Shirt,
      title: "Safety Shirts",
      description: "Comfortable t-shirts and polo shirts with reflective elements",
      items: ["T-Shirts", "Long Sleeve", "Polo Shirts", "Button-Up Shirts"],
    },
  ];

  const industries = [
    {
      icon: Construction,
      title: "Construction",
      items: ["Site Safety", "Trade Identification", "Company Branding"],
    },
    {
      icon: Factory,
      title: "Manufacturing",
      items: ["Warehouse Safety", "Equipment Operators", "Safety Teams"],
    },
    {
      icon: AlertTriangle,
      title: "Utilities",
      items: ["Road Crews", "Line Workers", "Emergency Response"],
    },
    {
      icon: Users,
      title: "Event Staff",
      items: ["Security", "Crowd Control", "Parking Attendants"],
    },
  ];

  const brandingOptions = [
    {
      name: "Screen Printing",
      description: "Perfect for large logos and simple designs on vests and shirts",
      bestFor: "Large orders, simple designs",
    },
    {
      name: "Vinyl Graphics",
      description: "Durable, high-visibility graphics perfect for names and departments",
      bestFor: "Individual names, numbering",
    },
    {
      name: "Heat Transfer",
      description: "Full-color designs with crisp detail and excellent durability",
      bestFor: "Complex logos, multiple colors",
    },
    {
      name: "Embroidery",
      description: "Premium, professional look for polos and jackets",
      bestFor: "Corporate branding, logos",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <Badge className="mb-4 border-orange-600 bg-orange-600/20 text-orange-500">
              Safety Wear
            </Badge>
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              CSA/ANSI Compliant{" "}
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Safety Apparel
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
              Certified high-visibility safety wear with custom branding options. Keep your team safe and professional.
            </p>

            {/* Certifications Badge */}
            <div className="mb-12 flex flex-wrap justify-center gap-3">
              <Badge variant="outline" className="border-orange-600/50 bg-orange-600/10 px-4 py-2 text-orange-500">
                <ShieldCheck className="mr-2 h-4 w-4" />
                CSA Certified
              </Badge>
              <Badge variant="outline" className="border-orange-600/50 bg-orange-600/10 px-4 py-2 text-orange-500">
                <ShieldCheck className="mr-2 h-4 w-4" />
                ANSI Compliant
              </Badge>
              <Badge variant="outline" className="border-orange-600/50 bg-orange-600/10 px-4 py-2 text-orange-500">
                Class 2 & Class 3
              </Badge>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-orange-600 px-8 py-4 text-lg font-bold hover:bg-orange-700"
              >
                <Link href="/contact">Get Quote</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-orange-600 bg-transparent px-8 py-4 text-lg font-bold text-orange-500 hover:bg-orange-600 hover:text-white"
              >
                <a href="tel:6476856286">Call: 647-685-6286</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Certified Compliance</h2>
            <p className="text-xl text-gray-400">Meets all Canadian and American safety standards</p>
          </div>

          <div className="mx-auto grid max-w-4xl gap-4 md:grid-cols-2">
            {certifications.map((cert) => (
              <Card key={cert.name} className="border-orange-600/30 bg-zinc-900">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 shrink-0 text-orange-500" />
                    <div>
                      <h3 className="mb-1 font-bold text-white">{cert.name}</h3>
                      <p className="text-sm text-gray-400">{cert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Product Categories</h2>
            <p className="text-xl text-gray-400">Complete safety apparel solutions</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.title} className="border-gray-800 bg-black hover:border-orange-600/50 transition-colors">
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-600/20">
                      <Icon className="h-6 w-6 text-orange-500" />
                    </div>
                    <CardTitle className="text-white">{category.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-sm text-gray-400">{category.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {category.items.map((item) => (
                        <Badge key={item} variant="outline" className="border-gray-700 text-gray-300 text-xs">
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

      {/* Industries */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Industries We Serve</h2>
            <p className="text-xl text-gray-400">Safety wear for every workplace</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {industries.map((industry) => {
              const Icon = industry.icon;
              return (
                <Card key={industry.title} className="border-gray-800 bg-zinc-900">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600/20">
                        <Icon className="h-5 w-5 text-orange-500" />
                      </div>
                      <CardTitle className="text-white">{industry.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-gray-400 sm:grid-cols-3">
                      {industry.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="text-orange-500">•</span>
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

      {/* Branding Options */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Custom Branding Options</h2>
            <p className="text-xl text-gray-400">Add your company identity to safety gear</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {brandingOptions.map((option) => (
              <Card key={option.name} className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="text-white">{option.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-3 text-sm text-gray-400">{option.description}</p>
                  <Badge variant="outline" className="border-gray-700 text-gray-300 text-xs">
                    {option.bestFor}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bulk Orders */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 border-red-600 bg-red-600/20 text-red-500">
              Bulk Orders
            </Badge>
            <h2 className="mb-6 text-3xl font-bold text-white lg:text-4xl">
              Outfit Your Entire Crew
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              We offer competitive pricing for bulk orders. Whether you need 10 vests for a small crew
              or 500 jackets for a large operation, we&apos;ve got you covered with fast turnaround and
              consistent quality.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-500">No Min</div>
                <div className="text-sm text-gray-400">For Blanks</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-500">12+</div>
                <div className="text-sm text-gray-400">For Custom</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-orange-500">48hrs</div>
                <div className="text-sm text-gray-400">Turnaround</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Ready to Outfit Your Team?"
        description="Get compliant safety wear with your company branding today"
        primaryButton={{ label: "Get Safety Wear Quote", href: "/contact" }}
        secondaryButton={{ label: "Call 647-685-6286", href: "tel:6476856286", variant: "outline", isPhone: true }}
      />
    </>
  );
}

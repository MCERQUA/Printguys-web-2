import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/sections/Hero";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { BenefitCard } from "@/components/sections/BenefitCard";
import { CTASection } from "@/components/sections/CTASection";
import { services } from "@/lib/data/services";

export default function Home() {
  // Display first 4 services on homepage
  const featuredServices = services.slice(0, 4);

  const benefits = [
    {
      icon: "Package",
      title: "No Minimums",
      description: "Order any quantity from 1 piece to thousands",
    },
    {
      icon: "Clock",
      title: "Fast Turnaround",
      description: "24-48 hour rush available on most orders",
    },
    {
      icon: "Award",
      title: "Premium Quality",
      description: "Vibrant, long-lasting prints that stand the test of time",
    },
    {
      icon: "MapPin",
      title: "Canadian Made",
      description: "Local production with fast shipping across Canada",
    },
  ];

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <Hero />

      {/* Services Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Our Professional Services</h2>
            <p className="text-xl text-gray-400">Complete custom printing solutions for all your needs</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>

          {/* View All Services Link */}
          <div className="mt-12 text-center">
            <Button
              asChild
              variant="outline"
              className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700"
            >
              <Link href="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section - Why Choose Us */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Why Choose PrintGuys?</h2>
            <p className="text-xl text-gray-400">
              Canada&apos;s trusted partner for custom printing and apparel
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <BenefitCard key={index} {...benefit} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <CTASection />
    </main>
  );
}

import { Metadata } from "next";
import { ServiceCard } from "@/components/sections/ServiceCard";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Our Services | PrintGuys - Custom Printing & Apparel",
  description: "Complete custom printing solutions including DTF transfers, screen printing, embroidery, sublimation, and more. No minimums, fast turnaround, premium quality.",
  keywords: ["custom printing", "DTF transfers", "screen printing", "embroidery", "sublimation", "UV DTF stickers", "safety wear", "Canada"],
};

export default function ServicesPage() {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Our{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Professional Services
              </span>
            </h1>
            <p className="mb-8 text-xl text-gray-300 lg:text-2xl">
              Complete custom printing solutions for all your needs. From single pieces to bulk orders, we deliver premium quality with fast turnaround.
            </p>

            {/* Key Stats */}
            <div className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">6+</div>
                <div className="text-sm text-gray-400">Service Types</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">No Min</div>
                <div className="text-sm text-gray-400">Order Quantity</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">24-48h</div>
                <div className="text-sm text-gray-400">Rush Available</div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-3xl font-bold text-red-500">100%</div>
                <div className="text-sm text-gray-400">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Explore Our Services</h2>
            <p className="text-xl text-gray-400">Click on any service to learn more and get pricing</p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Why PrintGuys?</h2>
            <p className="text-xl text-gray-400">
              Canada&apos;s trusted partner for custom printing and apparel
            </p>
          </div>

          <div className="mx-auto max-w-4xl grid gap-6 md:grid-cols-2">
            <div className="border-gray-800 bg-zinc-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">No Minimum Orders</h3>
              <p className="text-gray-400">Order 1 piece or 1,000 - we accommodate any order size with the same quality and care.</p>
            </div>

            <div className="border-gray-800 bg-zinc-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Fast Turnaround</h3>
              <p className="text-gray-400">24-48 hour rush service available on most orders. Standard production is just 3-5 business days.</p>
            </div>

            <div className="border-gray-800 bg-zinc-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Premium Quality</h3>
              <p className="text-gray-400">Vibrant, long-lasting prints that stand the test of time. We use only the best materials and equipment.</p>
            </div>

            <div className="border-gray-800 bg-zinc-900 p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600/20">
                <svg className="h-6 w-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">Canadian Made</h3>
              <p className="text-gray-400">Local production with fast shipping across Canada. Support Canadian business while getting great service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">Need Help Choosing?</h2>
            <p className="mb-8 text-xl text-gray-300">
              Our team is here to help you find the perfect printing solution for your project. Contact us today for a free consultation and quote.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-lg bg-red-600 px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-red-700"
              >
                Get Free Quote
              </a>
              <a
                href="tel:6476856286"
                className="inline-flex items-center justify-center rounded-lg border-2 border-red-600 bg-transparent px-8 py-4 text-lg font-bold text-red-500 transition-colors hover:bg-red-600 hover:text-white"
              >
                Call: 647-685-6286
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

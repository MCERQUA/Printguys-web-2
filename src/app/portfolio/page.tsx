'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { portfolioItems, type PortfolioCategory, portfolioCategories } from '@/lib/data/portfolio';

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>('All');

  const filteredItems = activeFilter === 'All'
    ? portfolioItems
    : portfolioItems.filter(item => item.category === activeFilter);

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-white">Our Work</h1>
            <p className="text-xl text-gray-400">
              Browse through our portfolio of custom printing projects
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {portfolioCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className={`
                  rounded-full px-6 py-2 font-medium transition-all
                  ${
                    activeFilter === category
                      ? 'bg-white text-black'
                      : 'border border-gray-700 bg-gray-900 text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Gallery */}
      <section className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, index) => (
              <Card
                key={item.id}
                className="
                  overflow-hidden border-gray-800 bg-gray-900
                  transition-all duration-300 hover:scale-[1.02] hover:border-gray-700 hover:shadow-xl
                "
                style={{
                  animation: `fadeIn 0.5s ease-out ${index * 0.1}s both`,
                }}
              >
                <CardContent className="p-0">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-gray-800">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="mb-3">
                      <Badge
                        variant="secondary"
                        className="bg-gray-800 text-gray-300"
                      >
                        {item.category}
                      </Badge>
                    </div>
                    <h3 className="mb-2 text-xl font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-xl text-gray-500">
                No projects found in this category.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-black to-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gray-900/50 p-12 text-center backdrop-blur">
            <h2 className="mb-4 text-3xl font-bold text-white">
              Ready to Start Your Project?
            </h2>
            <p className="mb-8 text-lg text-gray-400">
              Get an instant quote for your custom printing needs
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
            >
              <Link href="/quote">Start Your Project</Link>
            </Button>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}

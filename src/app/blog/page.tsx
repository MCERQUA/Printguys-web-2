import { BlogCard } from "@/components/blog/BlogCard";
import { getAllBlogPosts, getFeaturedBlogPosts } from "@/lib/data/blog-posts";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PrintGuys Blog - Custom Printing Tips & Industry News",
  description:
    "Latest news, tips, and insights from PrintGuys. Learn about DTF printing, design best practices, and custom printing trends.",
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts();

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">
              PrintGuys{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Blog
              </span>
            </h1>
            <p className="mx-auto mb-4 max-w-3xl text-xl text-zinc-300 lg:text-2xl">
              Custom printing tips, industry insights & latest news
            </p>
            <p className="text-zinc-400">
              Expert advice on DTF transfers, design best practices, and everything you need to know
              about custom apparel printing.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="bg-zinc-900 py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Featured Article</h2>
            </div>
            <div className="mx-auto max-w-4xl">
              <BlogCard post={featuredPosts[0]} variant="featured" />
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Latest Articles</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {allPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Start Your Custom Printing Project?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-red-100">
            Get expert advice and a free quote for your next custom apparel order. From single pieces to
            large-scale production, we deliver professional results.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-white px-8 py-4 text-lg font-bold text-red-600 transition-colors hover:bg-gray-100"
            >
              Get Instant Quote
            </a>
            <a
              href="/services"
              className="inline-flex items-center justify-center rounded-md border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white transition-colors hover:bg-white hover:text-red-600"
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug, getAllBlogPosts, getBlogPostsByCategory } from "@/lib/data/blog-posts";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generate metadata for each post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | PrintGuys Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const relatedPosts = getBlogPostsByCategory(post.category)
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  // Process content to convert markdown-style headings to HTML
  const processContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      // Handle headings
      if (line.startsWith("# ")) {
        return (
          <h1 key={index} className="text-4xl font-bold text-white mt-12 mb-6">
            {line.replace("# ", "")}
          </h1>
        );
      } else if (line.startsWith("## ")) {
        return (
          <h2 key={index} className="text-3xl font-bold text-white mt-10 mb-5">
            {line.replace("## ", "")}
          </h2>
        );
      } else if (line.startsWith("### ")) {
        return (
          <h3 key={index} className="text-2xl font-bold text-white mt-8 mb-4">
            {line.replace("### ", "")}
          </h3>
        );
      }
      // Handle lists
      else if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="text-zinc-300 ml-6 mb-2 list-decimal">
            {line.replace(/^\d+\.\s*/, "")}
          </li>
        );
      } else if (line.startsWith("- ")) {
        return (
          <li key={index} className="text-zinc-300 ml-6 mb-2 list-disc">
            {line.replace("- ", "")}
          </li>
        );
      } else if (line.match(/^\*\*(.+)\*\*:\s*\*\*(.+)\*\*/)) {
        // Table row format
        const parts = line.split("**").filter(Boolean);
        return (
          <tr key={index} className="border-b border-zinc-800">
            {parts.map((part, i) => (
              <td key={i} className="py-3 px-4 text-zinc-300">
                {part}
              </td>
            ))}
          </tr>
        );
      } else if (line.startsWith("| ")) {
        // Table row
        const cells = line.split("|").filter(Boolean);
        return (
          <tr key={index} className="border-b border-zinc-800">
            {cells.map((cell, i) => (
              <td key={i} className="py-3 px-4 text-zinc-300">
                {cell.trim()}
              </td>
            ))}
          </tr>
        );
      } else if (line.startsWith("---")) {
        return <hr key={index} className="border-zinc-800 my-8" />;
      } else if (line.trim() === "") {
        return <br key={index} />;
      } else {
        return (
          <p key={index} className="text-zinc-300 mb-4 leading-relaxed">
            {line}
          </p>
        );
      }
    });
  };

  return (
    <main className="bg-black text-white">
      {/* Back to Blog */}
      <section className="bg-zinc-900 py-6">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </section>

      {/* Article Header */}
      <section className="bg-gradient-to-br from-black via-zinc-900 to-black py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6">
              <Badge
                variant="outline"
                className="border-red-500/50 text-red-400 bg-red-500/10 px-3 py-1"
              >
                {post.category}
              </Badge>
            </div>

            <h1 className="mb-6 text-4xl font-bold lg:text-5xl text-white">{post.title}</h1>

            <p className="mb-8 text-xl text-zinc-300">{post.excerpt}</p>

            <div className="flex flex-wrap items-center gap-6 text-zinc-400">
              <span className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {post.readTime}
              </span>
              {post.author && (
                <span className="flex items-center gap-2">
                  <span className="font-semibold">By {post.author}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="prose prose-invert prose-lg max-w-none">
              {processContent(post.content)}
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-black py-16">
          <div className="container mx-auto px-4">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white">Related Articles</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group block"
                >
                  <div className="border border-zinc-800 bg-zinc-900/50 rounded-xl p-6 transition-all duration-300 hover:border-red-500/50">
                    <div className="mb-3">
                      <Badge
                        variant="outline"
                        className="border-red-500/30 text-red-400 bg-red-500/10 text-xs"
                      >
                        {relatedPost.category}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-red-400 transition-colors mb-3">
                      {relatedPost.title}
                    </h3>
                    <p className="text-zinc-400 text-sm line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {relatedPost.readTime}
                      </span>
                      <ArrowRight className="h-4 w-4 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Need Help With Your Custom Printing Project?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-red-100">
            Our expert team is here to help. Get in touch for a free consultation and quote.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold text-red-600 hover:bg-gray-100"
            >
              <Link href="/contact">Get Free Quote</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-white bg-transparent px-8 py-4 text-lg font-bold text-white hover:bg-white hover:text-red-600"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react"
import type { BlogPost } from "@/lib/data/blog-posts"

export interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "featured";
}

export function BlogCard({ post, variant = "default" }: BlogCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (variant === "featured") {
    return (
      <Card className="border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 overflow-hidden">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <Badge variant="outline" className="border-red-500/50 text-red-400 bg-red-500/10 px-3 py-1">
              {post.category}
            </Badge>
            <div className="flex items-center gap-4 text-sm text-zinc-400">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-zinc-100 mb-4">
            <Link href={`/blog/${post.slug}`} className="hover:text-red-500 transition-colors">
              {post.title}
            </Link>
          </h2>

          <p className="text-zinc-300 text-lg mb-6 leading-relaxed">{post.excerpt}</p>

          <Button
            asChild
            className="bg-red-600 text-white hover:bg-red-700 font-semibold"
          >
            <Link href={`/blog/${post.slug}`}>
              Read Full Article
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full border-zinc-800 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-red-500/50 hover:shadow-lg hover:shadow-red-500/10">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="border-red-500/30 text-red-400 bg-red-500/10">
              {post.category}
            </Badge>
          </div>
          <h3 className="text-xl font-semibold text-zinc-100 group-hover:text-red-400 transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pb-4">
          <p className="text-zinc-400 text-sm line-clamp-3">
            {post.excerpt}
          </p>
        </CardContent>

        <CardFooter className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <time>{formattedDate}</time>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readTime}</span>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}

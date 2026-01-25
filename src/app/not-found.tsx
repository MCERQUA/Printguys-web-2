import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Phone, Mail } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-black text-white">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-2xl text-center">
          {/* 404 Number */}
          <div className="mb-8">
            <span className="text-[150px] font-bold leading-none text-gray-800 md:text-[200px]">
              4
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                0
              </span>
              4
            </span>
          </div>

          {/* Message */}
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Page Not Found
          </h1>
          <p className="mb-8 text-lg text-gray-400">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          {/* Action Buttons */}
          <div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-red-600 px-8 py-4 font-bold hover:bg-red-700"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-gray-600 bg-transparent px-8 py-4 font-bold text-white hover:bg-gray-800"
            >
              <Link href="/services">
                <ArrowLeft className="mr-2 h-5 w-5" />
                View Services
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-bold text-white">Popular Pages</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/services/dtf"
                className="text-red-500 hover:text-red-400 hover:underline"
              >
                DTF Transfers
              </Link>
              <Link
                href="/pricing"
                className="text-red-500 hover:text-red-400 hover:underline"
              >
                Pricing
              </Link>
              <Link
                href="/portfolio"
                className="text-red-500 hover:text-red-400 hover:underline"
              >
                Portfolio
              </Link>
              <Link
                href="/faq"
                className="text-red-500 hover:text-red-400 hover:underline"
              >
                FAQ
              </Link>
              <Link
                href="/contact"
                className="text-red-500 hover:text-red-400 hover:underline"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 text-gray-400">
            <p className="mb-2">Need help? Contact us:</p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <a
                href="tel:6476856286"
                className="flex items-center justify-center gap-2 text-white hover:text-red-500"
              >
                <Phone className="h-4 w-4" />
                647-685-6286
              </a>
              <a
                href="mailto:printguys.ca@gmail.com"
                className="flex items-center justify-center gap-2 text-white hover:text-red-500"
              >
                <Mail className="h-4 w-4" />
                printguys.ca@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

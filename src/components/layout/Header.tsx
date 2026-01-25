"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ChevronDown, Flame, Zap, Scissors, Palette, Shield, Tag, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const services = [
  {
    name: "DTF Heat Transfers",
    href: "/services/dtf",
    icon: Flame,
    iconBg: "bg-red-600",
    description: "Premium transfers for any fabric",
    badge: "$0.038/sq",
  },
  {
    name: "Screen Printing",
    href: "/services/screen-printing",
    icon: Zap,
    iconBg: "bg-blue-600",
    description: "Bulk orders, vibrant colors",
  },
  {
    name: "Custom Embroidery",
    href: "/services/embroidery",
    icon: Scissors,
    iconBg: "bg-purple-600",
    description: "Professional logo stitching",
  },
  {
    name: "Sublimation",
    href: "/services/sublimation",
    icon: Palette,
    iconBg: "bg-pink-600",
    description: "Photo-quality on mugs & more",
  },
  {
    name: "Safety Wear",
    href: "/services/safety-wear",
    icon: Shield,
    iconBg: "bg-yellow-600",
    description: "CSA/ANSI compliant apparel",
  },
  {
    name: "UV DTF Stickers",
    href: "/services/uv-dtf-stickers",
    icon: Tag,
    iconBg: "bg-green-600",
    description: "Waterproof, fade-resistant",
  },
  {
    name: "Large Format",
    href: "/services/large-format",
    icon: Ruler,
    iconBg: "bg-indigo-600",
    description: "Banners, signs & displays",
  },
  {
    name: "Vinyl Banners",
    href: "/services/vinyl-banners",
    icon: Tag,
    iconBg: "bg-orange-600",
    description: "Durable vinyl banners",
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Pricing", href: "/pricing" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-black border-b border-red-600 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo/printguys-logo.png"
              alt="PrintGuys Logo"
              width={120}
              height={40}
              className="h-8 w-auto md:h-10"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link transition-colors ${
                  isActive(link.href)
                    ? "text-red-500 font-semibold"
                    : "text-white hover:text-red-500"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className={`nav-link flex items-center transition-colors ${
                  pathname.startsWith("/services")
                    ? "text-red-500 font-semibold"
                    : "text-white hover:text-red-500"
                }`}
              >
                Services
                <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-80 bg-gray-900 border-gray-700"
              >
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <DropdownMenuItem
                      key={service.href}
                      asChild
                      className="focus:bg-gray-800 cursor-pointer"
                    >
                      <Link
                        href={service.href}
                        className="flex items-center p-3 hover:bg-gray-800 transition-colors"
                      >
                        <div
                          className={`${service.iconBg} w-10 h-10 rounded-full flex items-center justify-center mr-3`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-white">
                            {service.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {service.description}
                          </div>
                        </div>
                        {service.badge && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {service.badge}
                          </span>
                        )}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem asChild className="focus:bg-gray-800 cursor-pointer">
                  <Link
                    href="/services"
                    className="flex items-center justify-center p-3 font-semibold text-red-500 hover:text-red-400"
                  >
                    View All Services →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Get Quote Button */}
            <Button
              asChild
              className="bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold"
            >
              <Link href="/contact">Get Quote</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="text-white">
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-80 bg-gray-900 border-gray-700"
            >
              <SheetHeader>
                <SheetTitle className="text-white">Navigation</SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold transition-colors ${
                      isActive(link.href)
                        ? "text-red-500"
                        : "text-white hover:text-red-500"
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Services List */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="text-lg font-semibold text-white mb-4">
                    Services
                  </div>
                  <div className="space-y-3">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center p-3 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <div
                            className={`${service.iconBg} w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                          >
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {service.description}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                    <Link
                      href="/services"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center p-3 font-semibold text-red-500 hover:text-red-400 rounded-lg hover:bg-gray-800 transition-colors"
                    >
                      View All Services →
                    </Link>
                  </div>
                </div>

                {/* Mobile Get Quote Button */}
                <Button
                  asChild
                  className="bg-red-600 text-white hover:bg-red-700 rounded-lg font-bold w-full mt-4"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href="/contact">Get Quote</Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

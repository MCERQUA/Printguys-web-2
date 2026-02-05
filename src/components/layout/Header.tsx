"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu, X, ChevronDown, Flame, Zap, Scissors, Palette, Shield, Tag, Ruler, PenTool, ShoppingCart, Shirt, Wrench, ShoppingBag, User, LogIn, UserPlus, LayoutGrid, Sparkles } from "lucide-react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

// Lazy load CartDrawer for better performance
const CartDrawer = dynamic(() => import("@/components/cart").then(mod => ({ default: mod.CartDrawer })), {
  loading: () => (
    <Button variant="ghost" size="icon" className="relative">
      <ShoppingCart className="h-5 w-5" />
    </Button>
  ),
  ssr: false,
});

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

const toolsItems = [
  { name: "Design Studio", href: "/design-studio", icon: PenTool, description: "Create custom designs", highlight: true },
  { name: "Get a Quote", href: "/quote", icon: Tag, description: "Quick price estimates", highlight: false },
];

const shopItems = [
  { name: "Shop Blanks", href: "/blanks", icon: Shirt, description: "Premium blank apparel", highlight: true },
  { name: "Catalog", href: "/blanks/catalog", icon: LayoutGrid, description: "Browse all products", highlight: false },
  { name: "Pricing", href: "/pricing", icon: Tag, description: "View our pricing", highlight: false },
];

const otherLinks = [
  { name: "Blog", href: "/blog", icon: null },
  { name: "Portfolio", href: "/portfolio", icon: null },
  { name: "FAQ", href: "/faq", icon: null },
];

const contactLinks = [
  { name: "Contact Us", href: "/contact", icon: null },
  { name: "About Us", href: "/about", icon: null },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-black/95 backdrop-blur-md border-b border-red-600/50 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="relative">
                <Image
                  src="/images/logo/printguys-logo.webp"
                  alt="PrintGuys Logo"
                  width={120}
                  height={40}
                  className="h-8 w-auto md:h-10 transition-transform group-hover:scale-105"
                  priority
                  fetchPriority="high"
                />
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {/* Shop Dropdown */}
              <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? 'shop' : null)}>
                <DropdownMenuTrigger
                  className={`nav-link flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeDropdown === 'shop' || pathname.startsWith('/blanks') || pathname === '/pricing'
                      ? "text-red-500 bg-red-500/10 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Shop
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-72 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl"
                >
                  <DropdownMenuLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                    Shop
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
                  {shopItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.href}
                        asChild
                        className="focus:bg-gray-800 cursor-pointer"
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center p-3 hover:bg-gray-800 transition-colors ${item.highlight ? 'bg-red-500/10 hover:bg-red-500/20' : ''}`}
                        >
                          <div className={`${item.highlight ? 'bg-red-600' : 'bg-gray-700'} w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${item.highlight ? 'text-red-400' : 'text-white'}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Tools Dropdown */}
              <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? 'tools' : null)}>
                <DropdownMenuTrigger
                  className={`nav-link flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeDropdown === 'tools' || pathname.startsWith('/design-studio') || pathname.startsWith('/quote')
                      ? "text-red-500 bg-red-500/10 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Wrench className="w-4 h-4 mr-2" />
                  Tools
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-72 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl"
                >
                  <DropdownMenuLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                    Tools
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
                  {toolsItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownMenuItem
                        key={item.href}
                        asChild
                        className="focus:bg-gray-800 cursor-pointer"
                      >
                        <Link
                          href={item.href}
                          className={`flex items-center p-3 hover:bg-gray-800 transition-colors ${item.highlight ? 'bg-red-500/10 hover:bg-red-500/20' : ''}`}
                        >
                          <div className={`${item.highlight ? 'bg-red-600' : 'bg-gray-700'} w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className={`font-semibold ${item.highlight ? 'text-red-400' : 'text-white'}`}>
                              {item.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {item.description}
                            </div>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Services Dropdown */}
              <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? 'services' : null)}>
                <DropdownMenuTrigger
                  className={`nav-link flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeDropdown === 'services' || pathname.startsWith('/services')
                      ? "text-red-500 bg-red-500/10 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Services
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-80 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl"
                >
                  <DropdownMenuLabel className="text-white/60 text-xs font-semibold tracking-wider uppercase">
                    Services
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
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
                            className={`${service.iconBg} w-9 h-9 rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}
                          >
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold text-white text-sm">
                              {service.name}
                            </div>
                            <div className="text-xs text-gray-400">
                              {service.description}
                            </div>
                          </div>
                          {service.badge && (
                            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                              {service.badge}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator className="bg-gray-700/50" />
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

              {/* Other Links */}
              {otherLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive(link.href)
                      ? "text-red-500 bg-red-500/10 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Contact Dropdown */}
              <DropdownMenu onOpenChange={(open) => setActiveDropdown(open ? 'contact' : null)}>
                <DropdownMenuTrigger
                  className={`nav-link flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    activeDropdown === 'contact' || pathname.startsWith('/contact') || pathname.startsWith('/about')
                      ? "text-red-500 bg-red-500/10 font-semibold"
                      : "text-white/90 hover:text-white hover:bg-white/5"
                  }`}
                >
                  More
                  <ChevronDown className="w-3.5 h-3.5 ml-1" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50 shadow-2xl"
                >
                  <DropdownMenuGroup>
                    {contactLinks.map((link) => (
                      <DropdownMenuItem key={link.href} asChild className="focus:bg-gray-800 cursor-pointer">
                        <Link
                          href={link.href}
                          className={`flex items-center p-3 ${isActive(link.href) ? 'text-red-400' : 'text-white'}`}
                        >
                          {link.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Auth Buttons */}
              <div className="ml-2 flex items-center gap-2 pl-4 border-l border-gray-700">
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/90 hover:text-white hover:bg-white/5 gap-2"
                    >
                      <LogIn className="w-4 h-4" />
                      <span className="hidden xl:inline">Sign In</span>
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-red-600 hover:bg-red-700 text-white gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span className="hidden xl:inline">Sign Up</span>
                    </Button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2 text-white/90 hover:text-white hover:bg-white/5"
                      >
                        <User className="w-4 h-4" />
                        <span className="hidden xl:inline font-medium">Account</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-gray-900/95 backdrop-blur-md border-gray-700/50">
                      <DropdownMenuLabel className="text-white/60 text-xs">My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <DropdownMenuItem asChild className="focus:bg-gray-800 cursor-pointer">
                        <Link href="/dashboard" className="flex items-center p-3 text-white">
                          <LayoutGrid className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-gray-800 cursor-pointer">
                        <Link href="/dashboard/orders" className="flex items-center p-3 text-white">
                          <ShoppingBag className="w-4 h-4 mr-3" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-gray-700/50" />
                      <div className="p-2">
                        <UserButton
                          appearance={{
                            elements: {
                              avatarBox: "w-full",
                            },
                          }}
                        />
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SignedIn>

                {/* Cart */}
                <CartDrawer />
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <SignedIn>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                    },
                  }}
                />
              </SignedIn>
              <CartDrawer />
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-gray-900/98 backdrop-blur-xl z-50 transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Menu</h2>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Shop Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-600/20 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Shop</h3>
              </div>
              <div className="space-y-2 ml-13">
                {shopItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : 'bg-gray-800/50 hover:bg-gray-800 text-white/90'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive(item.href) ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className={`text-sm ${isActive(item.href) ? 'text-white/70' : 'text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Tools Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Tools</h3>
              </div>
              <div className="space-y-2 ml-13">
                {toolsItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : 'bg-gray-800/50 hover:bg-gray-800 text-white/90'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isActive(item.href) ? 'bg-white/20' : 'bg-gray-700'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className={`text-sm ${isActive(item.href) ? 'text-white/70' : 'text-gray-400'}`}>
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Services Section */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-lg font-black text-white uppercase tracking-wider">Services</h3>
              </div>
              <div className="grid grid-cols-2 gap-2 ml-13">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <Link
                      key={service.href}
                      href={service.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex flex-col items-center p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-all duration-200 text-center"
                    >
                      <div className={`${service.iconBg} w-12 h-12 rounded-xl flex items-center justify-center mb-2 flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-white text-sm leading-tight">{service.name}</div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/services"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-center font-semibold text-red-500 hover:text-red-400 transition-all duration-200"
              >
                View All Services →
              </Link>
            </div>

            {/* Other Links */}
            <div className="space-y-2">
              {otherLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800/50 hover:bg-gray-800 text-white/90'
                  }`}
                >
                  <span className="font-semibold">{link.name}</span>
                </Link>
              ))}
            </div>

            {/* Contact Links */}
            <div className="space-y-2">
              {contactLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center p-4 rounded-xl transition-all duration-200 ${
                    isActive(link.href)
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800/50 hover:bg-gray-800 text-white/90'
                  }`}
                >
                  <span className="font-semibold">{link.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Footer - Auth */}
          <div className="p-6 border-t border-gray-700/50 space-y-3">
            <SignedIn>
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full h-12 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-white font-semibold transition-all duration-200"
              >
                <LayoutGrid className="w-5 h-5 mr-2" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full h-12 rounded-xl bg-gray-800/50 hover:bg-gray-800 text-white font-semibold transition-all duration-200"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                My Orders
              </Link>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-600 text-white hover:bg-gray-800 font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  Create Account
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>

        {/* Backdrop */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

const services = [
  { name: "DTF Heat Transfers", href: "/services/dtf" },
  { name: "Screen Printing", href: "/services/screen-printing" },
  { name: "Custom Embroidery", href: "/services/embroidery" },
  { name: "Sublimation", href: "/services/sublimation" },
  { name: "Large Format", href: "/services/large-format" },
  { name: "UV DTF Stickers", href: "/services/uv-dtf-stickers" },
  { name: "Safety Wear", href: "/services/safety-wear" },
  { name: "Vinyl Banners", href: "/services/vinyl-banners" },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-red-600">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/images/logo/printguys-logo.png"
                alt="PrintGuys Logo"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-gray-400 mb-4">
              Canada&apos;s premier DTF printing and custom apparel production partner
              serving businesses across Canada with professional quality and
              transparent pricing.
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-2">
                <MapPin className="w-4 h-4 inline mr-1 text-red-500" />
                <span className="text-white">91 Peelar Rd, Concord, ON L4K 1A3</span>
              </p>
              <p className="mb-2">
                <Clock className="w-4 h-4 inline mr-1 text-red-500" />
                <span className="text-gray-400">Mon-Sat: 9am-6pm | Sun: Closed</span>
              </p>
              <p className="text-gray-400">
                Serving: Vaughan, Toronto, GTA, Ontario &amp; all of Canada
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-gray-400 hover:text-red-500 transition-colors text-sm"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Contact PrintGuys</h4>
            <div className="space-y-4">
              <a
                href="https://maps.google.com/?q=91+Peelar+Rd,+Concord,+ON+L4K+1A3"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start text-gray-400 hover:text-red-500 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2 text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-white">
                  91 Peelar Rd<br />
                  Concord, ON L4K 1A3
                </span>
              </a>
              <a
                href="tel:6476856286"
                className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <Phone className="w-5 h-5 mr-2 text-red-500" />
                <span className="font-semibold text-white">(647) 685-6286</span>
              </a>
              <a
                href="mailto:printguys.ca@gmail.com"
                className="flex items-center text-gray-400 hover:text-red-500 transition-colors"
              >
                <Mail className="w-5 h-5 mr-2 text-red-500" />
                <span className="font-semibold text-white">
                  printguys.ca@gmail.com
                </span>
              </a>
              <div className="flex items-center text-gray-400">
                <Clock className="w-5 h-5 mr-2 text-red-500" />
                <span>Mon-Sat: 9am-6pm</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} PrintGuys - DTF Printing Canada.
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

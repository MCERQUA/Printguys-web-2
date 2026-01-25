import { Phone, Mail } from "lucide-react";
import Link from "next/link";

export function ContactBanner() {
  return (
    <div className="bg-red-600 py-2 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left">
          <div className="text-white font-semibold flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="hidden sm:inline">Contact Nick:</span>
            <Link
              href="tel:6476856286"
              className="hover:underline font-bold flex items-center gap-1"
            >
              <Phone className="w-4 h-4" />
              (647) 685-6286
            </Link>
            <span className="hidden sm:inline">|</span>
            <Link
              href="mailto:printguys.ca@gmail.com"
              className="hover:underline font-bold flex items-center gap-1"
            >
              <Mail className="w-4 h-4" />
              printguys.ca@gmail.com
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

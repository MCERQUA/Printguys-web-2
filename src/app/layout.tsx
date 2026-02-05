import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { ContactBanner, Header, Footer, FloatingDesignButton } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { LocalBusinessSchema } from "@/components/seo/schema-markup";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PrintGuys - Custom Printed Merch & Company Apparel in Vaughan",
    template: "%s | PrintGuys",
  },
  description:
    "Custom printed merch and company apparel in Vaughan - no minimums. Premium DTF printing, screen printing, embroidery, and more. Fast turnaround serving Toronto, GTA, and all of Canada.",
  keywords: [
    "DTF printing",
    "heat transfers",
    "screen printing",
    "embroidery",
    "sublimation",
    "custom apparel",
    "Vaughan printing",
    "Toronto printing",
    "Concord Ontario printing",
    "Canada printing",
    "DTF transfers",
    "custom t-shirts",
    "large format printing",
    "company apparel",
    "custom merch",
    "no minimum orders",
  ],
  openGraph: {
    title: "PrintGuys - Custom Printed Merch & Company Apparel in Vaughan",
    description: "Custom printed merch and company apparel in Vaughan - no minimums.",
    url: "https://printguys.ca",
    siteName: "PrintGuys",
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#ef4444",
          colorBackground: "#000000",
          colorInputBackground: "#1f2937",
          colorInputText: "#ffffff",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
        >
          <LocalBusinessSchema />
          <GoogleAnalytics />
          <ContactBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FloatingDesignButton />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

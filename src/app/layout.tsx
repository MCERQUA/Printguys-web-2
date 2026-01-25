import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "./globals.css";
import { ContactBanner, Header, Footer } from "@/components/layout";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PrintGuys - Canada's Largest DTF Printer",
    template: "%s | PrintGuys",
  },
  description:
    "Premium custom printing services including DTF transfers, screen printing, embroidery, sublimation, and more. Fast turnaround, no minimums. Serving Toronto, GTA, and all of Canada.",
  keywords: [
    "DTF printing",
    "heat transfers",
    "screen printing",
    "embroidery",
    "sublimation",
    "custom apparel",
    "Toronto printing",
    "Canada printing",
    "DTF transfers",
    "custom t-shirts",
    "large format printing",
  ],
  openGraph: {
    title: "PrintGuys - Custom Printing Services",
    description: "Premium custom printing services in Canada",
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
        <head>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-4YH4M54622"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4YH4M54622');
            `}
          </Script>
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
        >
          <ContactBanner />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}

import { Flame, Clock, Shirt, Sparkles, Droplets, ThumbsUp, Phone, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DTFPage() {
  const features = [
    { icon: Shirt, title: "Any Fabric", description: "Works on cotton, polyester, blends, and more" },
    { icon: Clock, title: "Fast Turnaround", description: "2-5 business days standard, rush available" },
    { icon: Sparkles, title: "Vibrant Colors", description: "Full color prints with amazing detail" },
    { icon: Droplets, title: "Wash Durable", description: "50+ washes with proper care" },
    { icon: ThumbsUp, title: "No Minimums", description: "Order 1 or 10,000 pieces" },
    { icon: Flame, title: "Easy Application", description: "Heat press at 300°F for 10-15 seconds" },
  ];

  const pricingTiers = [
    { size: "Small (up to 25 sq in)", price: "$0.95", perSq: "$0.038/sq in" },
    { size: "Medium (26-50 sq in)", price: "$1.90", perSq: "$0.038/sq in" },
    { size: "Large (51-100 sq in)", price: "$3.80", perSq: "$0.038/sq in" },
    { size: "XL (101-200 sq in)", price: "$7.60", perSq: "$0.038/sq in" },
  ];

  const steps = [
    { num: 1, title: "Upload Design", description: "Send us your artwork in PNG, PDF, or AI format" },
    { num: 2, title: "We Print", description: "Your design is printed on premium DTF film" },
    { num: 3, title: "Ship to You", description: "Transfers shipped ready to apply" },
    { num: 4, title: "Heat Press", description: "Apply to garment with heat press" },
  ];

  return (
    <main className="bg-black text-white">
      {/* Hero */}
      <section className="py-20 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-red-600/20 text-red-400 px-4 py-2 rounded-full mb-6">
            <Flame className="w-5 h-5" />
            <span>Most Popular Service</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">DTF Heat Transfers</h1>
          <p className="text-xl text-gray-400 mb-4 max-w-2xl mx-auto">
            Premium direct-to-film transfers for vibrant, long-lasting prints on any fabric
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-lg mb-8">
            <span className="text-red-500 font-bold">$0.038/sq inch</span>
            <span className="text-gray-400">|</span>
            <span>No Minimums</span>
            <span className="text-gray-400">|</span>
            <span>2-5 Day Turnaround</span>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              <FileText className="w-5 h-5 mr-2" /> Get Instant Quote
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 hover:bg-gray-800">
              <Phone className="w-5 h-5 mr-2" /> 647-685-6286
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose DTF Transfers?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-black p-6 rounded-xl border border-gray-800">
                <f.icon className="w-10 h-10 text-red-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-gray-400 text-center mb-12">No hidden fees. Volume discounts available.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className="bg-zinc-900 p-6 rounded-xl border border-gray-800 text-center">
                <h3 className="font-bold mb-2">{tier.size}</h3>
                <div className="text-3xl font-bold text-red-500 mb-1">{tier.price}</div>
                <div className="text-sm text-gray-400">{tier.perSq}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Get an instant quote or call us to discuss your project
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">Get Quote</Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

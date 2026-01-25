import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ValueCard } from "@/components/sections/ValueCard";
import { FeatureCard } from "@/components/sections/FeatureCard";
import { CTASection } from "@/components/sections/CTASection";
import { Plus, Clock, Monitor, Users } from "lucide-react";

export default function AboutPage() {
  const stats = [
    { value: "10,000+", label: "Happy Customers" },
    { value: "50,000+", label: "Orders Completed" },
    { value: "24hrs", label: "Average Turnaround" },
    { value: "99.5%", label: "Customer Satisfaction" },
  ];

  const values = [
    {
      icon: "Eye",
      title: "Transparency",
      description:
        "No hidden fees, no surprise charges. Our pricing is clear, upfront, and honest. You'll always know exactly what you're paying for and why.",
    },
    {
      icon: "Zap",
      title: "Speed",
      description:
        "Time is money, and we respect both. Our streamlined processes and advanced equipment ensure you get professional results in record time.",
    },
    {
      icon: "Shield",
      title: "Quality",
      description:
        "We use industrial-grade equipment and premium materials to ensure every print meets our high standards and exceeds your expectations.",
    },
  ];

  const features = [
    {
      icon: "DollarSign",
      title: "No Minimum Orders",
      description:
        "Need just one custom print? No problem. While others force you to order dozens, we let you order exactly what you need. Perfect for testing designs, small businesses, or personal projects.",
      highlighted: true,
    },
    {
      icon: "Clock",
      title: "Lightning-Fast Production",
      description:
        "Most orders are completed within 24-48 hours. Our efficient processes and dedicated team ensure you get your custom prints when you need them, not when it's convenient for us.",
      highlighted: false,
    },
    {
      icon: "Monitor",
      title: "State-of-the-Art Equipment",
      description:
        "We invest in the latest DTF printing technology and industrial-grade equipment. This means better quality, more consistent results, and the ability to handle any project size.",
      highlighted: false,
    },
    {
      icon: "Users",
      title: "Expert Support",
      description:
        "Our team of printing experts is here to help every step of the way. From design advice to technical questions, we're committed to ensuring your success.",
      highlighted: false,
    },
  ];

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">
              About{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                PrintGuys
              </span>
            </h1>
            <p className="mx-auto mb-4 max-w-3xl text-xl text-gray-300 lg:text-2xl">
              We&apos;re Canada&apos;s largest DTF printer, revolutionizing custom printing with transparent
              pricing, lightning-fast turnaround, and a commitment to quality that sets us apart.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-4xl font-bold text-white">Our Story</h2>
              <p className="mb-6 text-lg text-gray-300">
                PrintGuys was founded with a simple mission: make professional custom printing accessible,
                affordable, and hassle-free for everyone. We saw an industry plagued by high minimums, hidden
                fees, and slow turnaround times, and we knew there had to be a better way.
              </p>
              <p className="mb-6 text-lg text-gray-300">
                Starting with a small team and big dreams, we invested in state-of-the-art DTF printing
                technology and built our operations around three core principles: transparency, speed, and
                quality. Today, we&apos;re proud to be Canada&apos;s largest DTF printer, serving thousands of
                customers across the country.
              </p>
              <p className="text-lg text-gray-300">
                From individual entrepreneurs to large corporations, we&apos;ve helped bring countless designs
                to life. Our growth is a testament to our commitment to exceptional service and our
                customers&apos; success.
              </p>
            </div>

            {/* Stats Card */}
            <div className="rounded-2xl bg-red-600 p-8 text-center">
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <div className="mb-2 text-4xl font-bold text-white">{stat.value}</div>
                    <div className="text-red-100">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">Our Mission & Values</h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-400">
              Everything we do is guided by our commitment to revolutionizing the custom printing industry
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>
      </section>

      {/* What Sets Us Apart */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">What Sets Us Apart</h2>
            <p className="text-xl text-gray-400">
              Why thousands of customers choose PrintGuys for their custom printing needs
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-red-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-white">
            Ready to Experience the PrintGuys Difference?
          </h2>
          <p className="mx-auto mb-8 max-w-3xl text-xl text-red-100">
            Join thousands of satisfied customers who trust PrintGuys for their custom printing needs. Get
            started with an instant quote today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-white px-8 py-4 text-lg font-bold text-red-600 hover:bg-gray-100"
            >
              <Link href="/contact">
                <Plus className="mr-2 h-5 w-5" />
                Get Instant Quote
              </Link>
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

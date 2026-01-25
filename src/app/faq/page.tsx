import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqCategories, faqs } from "@/lib/data/faqs";
import {
  CircleHelp,
  Flame,
  Zap,
  Scissors,
  Truck,
  Mail,
  Phone,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  CircleHelp,
  Flame,
  Zap,
  Scissors,
  Truck,
};

function getCategoryIcon(categoryId: string) {
  const category = faqCategories.find((c) => c.id === categoryId);
  if (!category) return CircleHelp;
  const IconComponent = iconMap[category.icon];
  return IconComponent || CircleHelp;
}

export default function FAQPage() {
  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-4xl font-bold lg:text-6xl">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Questions
              </span>
            </h1>
            <p className="mb-4 text-xl text-gray-300 lg:text-2xl">
              Get answers to common questions about our custom printing services
            </p>
            <p className="text-lg text-gray-400">
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link href="/contact" className="text-red-500 hover:underline">
                Contact us directly
              </Link>{" "}
              for personalized help.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="bg-zinc-900 py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            {faqCategories.map((category) => {
              const categoryFaqs = faqs.filter((f) => f.category === category.id);
              if (categoryFaqs.length === 0) return null;

              const CategoryIcon = getCategoryIcon(category.id);

              return (
                <div key={category.id} className="mb-12">
                  <div className="mb-8 flex items-center justify-center gap-3">
                    <CategoryIcon className="h-8 w-8 text-red-500" />
                    <h2 className="text-center text-3xl font-bold text-white">
                      {category.name}
                    </h2>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    {categoryFaqs.map((faq) => (
                      <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="mb-4 rounded-lg border border-zinc-700 bg-zinc-800 px-6 last:mb-0"
                      >
                        <AccordionTrigger className="text-lg font-semibold text-white hover:no-underline">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-gray-300">
                          <div dangerouslySetInnerHTML={{ __html: faq.answer.replace(/\n/g, "<br />") }} />
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              );
            })}

            {/* Contact CTA */}
            <div className="text-center">
              <div className="mx-auto max-w-2xl rounded-xl bg-zinc-800 p-8">
                <h2 className="mb-4 text-3xl font-bold text-white">
                  Still Have Questions?
                </h2>
                <p className="mb-8 text-gray-300">
                  Can&apos;t find the answer you&apos;re looking for? Our team is here to help!
                </p>
                <div className="flex flex-col justify-center gap-4 sm:flex-row">
                  <Button
                    asChild
                    className="bg-red-600 px-8 py-4 font-bold hover:bg-red-700"
                  >
                    <Link href="tel:6476856286">
                      <Phone className="mr-2 h-5 w-5" />
                      Call: 647-685-6286
                    </Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700"
                  >
                    <Link href="mailto:printguys.ca@gmail.com?subject=FAQ Question">
                      <Mail className="mr-2 h-5 w-5" />
                      Email Us
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

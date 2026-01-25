"use client"

import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Phone, Mail, MessageSquare, Send, ChevronDown } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

// Form validation schema
const contactFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
  newsletter: z.boolean().default(false),
})

const faqs = [
  {
    id: "faq-1",
    question: "How fast is your turnaround time?",
    answer:
      "Most orders are completed within 24-48 hours from approval. DTF transfers can often be done same-day, while embroidery typically takes 48-72 hours. Rush orders available upon request.",
  },
  {
    id: "faq-2",
    question: "Do you really have no minimum orders?",
    answer:
      "Absolutely! You can order just one piece if that's what you need. We believe everyone should have access to professional custom printing, regardless of order size.",
  },
  {
    id: "faq-3",
    question: "What file formats do you accept?",
    answer:
      "We accept PNG, JPG, PDF, AI, EPS, and PSD files. For best results, provide high-resolution files (300 DPI) in vector format when possible. Don't have the right format? Our team can help convert your files.",
  },
  {
    id: "faq-4",
    question: "How do I get a quote?",
    answer:
      "Use our instant quote calculator on the website, upload your design for a detailed quote, or contact us directly. Our transparent pricing means no surprises - you'll know exactly what you'll pay upfront.",
  },
]

export default function ContactPage() {
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      service: "",
      message: "",
      newsletter: false,
    },
  })

  function onSubmit(data: z.infer<typeof contactFormSchema>) {
    // In a real application, this would send the data to your backend
    console.log("Form submitted:", data)
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    })
    form.reset()
  }

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 text-5xl font-bold lg:text-6xl">
              Contact{" "}
              <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                PrintGuys
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-xl text-gray-300 lg:text-2xl">
              Ready to bring your designs to life? Get in touch with Canada&apos;s largest
              DTF printer. Fast quotes, expert advice, and exceptional service await.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white">Send Us a Message</h2>
              <p className="mb-8 text-gray-400">
                Fill out the form below and we&apos;ll get back to you within 24 hours.
                Whether you need a quote, have questions, or want to discuss a custom
                project, we&apos;re here to help.
              </p>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-white">
                            First Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-white">
                            Last Name *
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-white">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-white">
                          Phone Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-white">
                          Service Interest
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500">
                              <SelectValue placeholder="Select a service..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="border-gray-600 bg-black text-white">
                            <SelectItem value="dtf-transfers">
                              DTF Heat Transfers
                            </SelectItem>
                            <SelectItem value="screen-printing">
                              Screen Printing
                            </SelectItem>
                            <SelectItem value="embroidery">
                              Custom Embroidery
                            </SelectItem>
                            <SelectItem value="sublimation">Sublimation</SelectItem>
                            <SelectItem value="uv-stickers">UV DTF Stickers</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-white">
                          Message *
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your project, quantity needed, timeline, or any questions you have..."
                            rows={5}
                            className="border-gray-600 bg-black text-white focus:border-red-500 focus:ring-2 focus:ring-red-500 resize-y"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="newsletter"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1 h-5 w-5 border-gray-600 bg-black text-red-600 focus:ring-red-500"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-gray-400">
                            I&apos;d like to receive updates about new services and
                            special offers from PrintGuys.
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-red-600 py-4 font-bold text-white hover:bg-red-700"
                  >
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </Button>
                </form>
              </Form>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white">Get in Touch</h2>
              <p className="mb-8 text-gray-400">
                Multiple ways to reach us. Choose what works best for you.
              </p>

              {/* Contact Methods */}
              <div className="mb-8 space-y-6">
                <div className="rounded-xl border-2 border-red-600 bg-black p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-600">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Phone Support</h3>
                      <p className="font-semibold text-red-500">647-685-6286</p>
                      <p className="text-gray-400">Mon-Fri 9am-6pm EST</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-700 bg-black p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Email Support</h3>
                      <p className="text-gray-300">printguys.ca@gmail.com</p>
                      <p className="text-gray-400">Response within 24 hours</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-gray-700 bg-black p-6">
                  <div className="mb-4 flex items-center">
                    <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-700">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Live Chat</h3>
                      <p className="text-gray-300">Available on website</p>
                      <p className="text-gray-400">Mon-Fri 9am-6pm EST</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Quick Actions</h3>
                <Button
                  asChild
                  size="lg"
                  className="w-full bg-red-600 py-3 font-bold text-white hover:bg-red-700"
                >
                  <Link href="/quote">Get Instant Quote</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full border-2 border-red-600 bg-transparent py-3 font-bold text-red-500 hover:bg-red-600 hover:text-white"
                >
                  <Link href="/upload">Upload Your Design</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400">Quick answers to common questions</p>
          </div>

          <div className="mx-auto max-w-4xl">
            <Accordion type="single" collapsible className="space-y-6">
              {faqs.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="rounded-xl border border-gray-700 bg-gray-900 px-6"
                >
                  <AccordionTrigger className="text-left text-xl font-bold text-white hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ShoppingBag, CreditCard, MapPin, User, Mail, Phone, Loader2, Trash2, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCartStore, type CartItem } from "@/stores/cart-store"

// Constants
const TAX_RATE = 0.13 // 13% HST for Ontario
const SHIPPING_COST = 1500 // $15.00 in cents
const FREE_SHIPPING_THRESHOLD = 10000 // $100.00 in cents

// Canadian provinces
const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
]

// Form validation schema
const checkoutFormSchema = z.object({
  // Contact Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),

  // Shipping Address
  addressLine1: z.string().min(5, "Address must be at least 5 characters"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City must be at least 2 characters"),
  province: z.string().min(2, "Please select a province"),
  postalCode: z.string().regex(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/, "Please enter a valid postal code (A1A 1A1)"),
  country: z.string().optional().default("CA"),
})

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const cartItems = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)

  const [isProcessing, setIsProcessing] = useState(false)

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema) as any,
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      province: "",
      postalCode: "",
      country: "CA",
    },
  })

  // Calculate order totals
  const subtotal = useCartStore((state) => state.subtotal())
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const tax = Math.round(subtotal * TAX_RATE)
  const total = subtotal + shipping + tax

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`

  async function onSubmit(data: CheckoutFormValues) {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty", {
        description: "Please add items to your cart before checkout.",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Create checkout session with Stripe
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phone: data.phone,
          },
          shippingAddress: {
            line1: data.addressLine1,
            line2: data.addressLine2,
            city: data.city,
            province: data.province,
            postalCode: data.postalCode,
            country: data.country,
          },
          items: cartItems,
          subtotal,
          shipping,
          tax,
          total,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      if (result.url) {
        window.location.href = result.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error("Checkout failed", {
        description: error instanceof Error ? error.message : "Please try again or contact us directly.",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Group items by design/product for cleaner display
  const groupedItems = cartItems.reduce((acc, item) => {
    const key = `${item.id}-${item.color}`
    if (!acc[key]) {
      acc[key] = item
    }
    return acc
  }, {} as Record<string, CartItem>)

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="mx-auto max-w-md text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-900">
              <ShoppingBag className="h-10 w-10 text-gray-600" />
            </div>
            <h1 className="mb-4 text-3xl font-bold">Your Cart is Empty</h1>
            <p className="mb-8 text-gray-400">
              Add some custom apparel to your cart before checking out.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-red-600 hover:bg-red-700"
            >
              <Link href="/design-studio">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Design Studio
              </Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <section className="border-b border-gray-800 bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
            >
              <Link href="/design-studio">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Checkout</h1>
              <p className="text-gray-400">Complete your order</p>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Form */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <User className="h-5 w-5 text-red-500" />
                    Contact Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    We'll use this information to contact you about your order
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">First Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="John"
                                  className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
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
                              <FormLabel className="text-gray-300">Last Name *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Doe"
                                  className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
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
                            <FormLabel className="text-gray-300">Email Address *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
                                <Input
                                  type="email"
                                  placeholder="john@example.com"
                                  className="border-gray-700 bg-black pl-10 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
                                  {...field}
                                />
                              </div>
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
                            <FormLabel className="text-gray-300">Phone Number *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-600" />
                                <Input
                                  type="tel"
                                  placeholder="(647) 685-6286"
                                  className="border-gray-700 bg-black pl-10 text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="border-gray-800 bg-black">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <MapPin className="h-5 w-5 text-red-500" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Where should we send your order?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="addressLine1"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Street Address *</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="123 Main Street"
                                className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="addressLine2"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-300">Apartment, Suite, etc. (optional)</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Apt 4B"
                                className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">City *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Toronto"
                                  className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="province"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Province *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="border-gray-700 bg-black text-white focus:border-red-500 focus:ring-red-500">
                                    <SelectValue placeholder="Select..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="border-gray-700 bg-black text-white">
                                  {CANADIAN_PROVINCES.map((province) => (
                                    <SelectItem key={province.value} value={province.value}>
                                      {province.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="postalCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-300">Postal Code *</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="L4K 1A3"
                                  className="border-gray-700 bg-black text-white placeholder:text-gray-600 focus:border-red-500 focus:ring-red-500 uppercase"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card className="border-gray-800 bg-black sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <ShoppingBag className="h-5 w-5 text-red-500" />
                    Order Summary
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cart Items */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    {Object.values(groupedItems).map((item) => (
                      <div
                        key={item.id}
                        className="flex gap-3 border-b border-gray-800 pb-3 last:border-0 last:pb-0"
                      >
                        {/* Thumbnail */}
                        {item.designThumbnail && (
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-900">
                            <img
                              src={item.designThumbnail}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-white">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.service} • {item.color}
                          </p>
                          <div className="mt-1 flex items-center justify-between">
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                            <p className="text-sm font-semibold text-white">
                              {formatPrice(item.totalPrice)}
                            </p>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          className="flex-shrink-0 text-gray-600 hover:text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 border-t border-gray-800 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">{formatPrice(subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className={shipping === 0 ? "text-green-500" : "text-white"}>
                        {shipping === 0 ? "FREE" : formatPrice(shipping)}
                      </span>
                    </div>

                    {shipping > 0 && (
                      <p className="text-xs text-gray-500">
                        Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping
                      </p>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">HST (13%)</span>
                      <span className="text-white">{formatPrice(tax)}</span>
                    </div>

                    <div className="flex justify-between border-t border-gray-800 pt-3 text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-red-500">{formatPrice(total)}</span>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    form="checkout-form"
                    size="lg"
                    disabled={isProcessing}
                    className="w-full bg-red-600 py-4 font-bold text-white hover:bg-red-700"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-5 w-5" />
                        Pay with Stripe
                      </>
                    )}
                  </Button>

                  <p className="text-center text-xs text-gray-500">
                    Secure checkout powered by Stripe
                  </p>

                  {/* Trust Badges */}
                  <div className="flex items-center justify-center gap-4 pt-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      <span>Secure</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <span>Protected</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

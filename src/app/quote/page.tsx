'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Form schemas for each step
const step1Schema = z.object({
  service: z.enum(['dtf', 'screen-printing', 'embroidery', 'large-format'], {
    message: 'Please select a service',
  }),
});

const step2Schema = z.object({
  quantity: z.string().min(1, 'Quantity is required').regex(/^\d+$/, 'Must be a number'),
  size: z.string().min(1, 'Please select a size'),
});

const step3Schema = z.object({
  designNotes: z.string().optional(),
});

const step4Schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
});

// Combine all schemas
const quoteFormSchema = step1Schema.and(step2Schema).and(step3Schema).and(step4Schema);

type QuoteFormData = z.infer<typeof quoteFormSchema>;

const sizeOptions = [
  { value: 'xs', label: 'XS' },
  { value: 's', label: 'S' },
  { value: 'm', label: 'M' },
  { value: 'l', label: 'L' },
  { value: 'xl', label: 'XL' },
  { value: '2xl', label: '2XL' },
  { value: '3xl', label: '3XL' },
  { value: 'custom', label: 'Custom Size' },
];

const displayServices = [
  { id: 'dtf', title: 'DTF Heat Transfers', description: 'Premium transfers for any fabric', icon: '🔥' },
  { id: 'screen-printing', title: 'Screen Printing', description: 'Bulk orders with vibrant colors', icon: '⚡' },
  { id: 'embroidery', title: 'Embroidery', description: 'Professional logo stitching', icon: '✂️' },
  { id: 'large-format', title: 'Large Format', description: 'Banners, signage, and more', icon: '📐' },
];

export default function QuotePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setValue,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteFormSchema),
    mode: 'onChange',
  });

  const watchedService = watch('service');
  const watchedQuantity = watch('quantity');

  // Mock price calculation
  const calculatePrice = () => {
    if (!watchedService || !watchedQuantity) return null;

    const quantity = parseInt(watchedQuantity) || 0;
    let basePrice = 0;

    switch (watchedService) {
      case 'dtf':
        basePrice = quantity * 5.5;
        break;
      case 'screen-printing':
        basePrice = quantity * 4.0;
        break;
      case 'embroidery':
        basePrice = quantity * 8.0;
        break;
      case 'large-format':
        basePrice = quantity * 25.0;
        break;
    }

    // Bulk discount
    if (quantity >= 50) basePrice *= 0.85;
    else if (quantity >= 25) basePrice *= 0.9;
    else if (quantity >= 12) basePrice *= 0.95;

    return Math.max(basePrice, 15); // Minimum $15
  };

  const estimatedPrice = calculatePrice();

  const nextStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger('service');
        break;
      case 2:
        isValid = await trigger(['quantity', 'size']);
        break;
      case 3:
        isValid = await trigger('designNotes');
        break;
      case 4:
        isValid = await trigger(['name', 'email', 'phone']);
        break;
    }

    if (isValid && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = (data: QuoteFormData) => {
    console.log('Form submitted:', data);
    console.log('File uploaded:', selectedFile);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <main className="bg-black text-white">
        <section className="flex min-h-screen items-center justify-center py-20">
          <div className="container mx-auto px-4">
            <Card className="mx-auto max-w-2xl border-gray-800 bg-gray-900">
              <CardContent className="p-12 text-center">
                <div className="mb-6 text-6xl">✅</div>
                <h1 className="mb-4 text-3xl font-bold text-white">
                  Quote Request Submitted!
                </h1>
                <p className="mb-8 text-lg text-gray-400">
                  Thank you for your request. We&apos;ll review your project details and get back to you
                  within 24 hours with a detailed quote.
                </p>
                <div className="rounded-lg bg-gray-800 p-6">
                  <p className="mb-2 text-sm text-gray-400">Estimated Price</p>
                  <p className="text-3xl font-bold text-white">
                    {estimatedPrice ? `$${estimatedPrice.toFixed(2)}` : '---'}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">Final price may vary based on design complexity</p>
                </div>
                <Button
                  asChild
                  className="mt-8"
                  variant="outline"
                >
                  <Link href="/">Return Home</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-black text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-900 to-black py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="mb-4 text-5xl font-bold text-white">Get an Instant Quote</h1>
            <p className="text-xl text-gray-400">
              Tell us about your project and receive an estimated price instantly
            </p>
          </div>
        </div>
      </section>

      {/* Progress Indicator */}
      <section className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all
                      ${
                        currentStep >= step
                          ? 'bg-white text-black'
                          : 'border-2 border-gray-700 bg-gray-900 text-gray-500'
                      }
                    `}
                  >
                    {step}
                  </div>
                  {step < 4 && (
                    <div
                      className={`
                        mx-2 h-1 w-16 transition-all
                        ${currentStep > step ? 'bg-white' : 'bg-gray-800'}
                      `}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between text-sm">
              <span className={currentStep >= 1 ? 'text-white' : 'text-gray-600'}>Service</span>
              <span className={currentStep >= 2 ? 'text-white' : 'text-gray-600'}>Quantity</span>
              <span className={currentStep >= 3 ? 'text-white' : 'text-gray-600'}>Design</span>
              <span className={currentStep >= 4 ? 'text-white' : 'text-gray-600'}>Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Form */}
              <div className="lg:col-span-2">
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Step 1: Select Service */}
                  {currentStep === 1 && (
                    <Card className="border-gray-800 bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-white">Select Your Service</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          {displayServices.map((service) => (
                            <label
                              key={service.id}
                              className={`
                                cursor-pointer rounded-lg border-2 p-4 transition-all
                                ${
                                  watchedService === service.id
                                    ? 'border-white bg-gray-800'
                                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                                }
                              `}
                            >
                              <input
                                type="radio"
                                value={service.id}
                                {...register('service')}
                                className="sr-only"
                              />
                              <div className="flex items-start gap-3">
                                <span className="text-3xl">{service.icon}</span>
                                <div>
                                  <h3 className="font-semibold text-white">{service.title}</h3>
                                  <p className="text-sm text-gray-400">{service.description}</p>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        {errors.service && (
                          <p className="text-sm text-red-500">{errors.service.message}</p>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 2: Quantity & Size */}
                  {currentStep === 2 && (
                    <Card className="border-gray-800 bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-white">Quantity & Size</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="quantity" className="text-white">
                            Quantity *
                          </Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            placeholder="Enter quantity"
                            {...register('quantity')}
                            className="mt-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                          {errors.quantity && (
                            <p className="mt-1 text-sm text-red-500">{errors.quantity.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="size" className="text-white">
                            Size *
                          </Label>
                          <select
                            id="size"
                            {...register('size')}
                            className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                          >
                            <option value="">Select a size</option>
                            {sizeOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          {errors.size && (
                            <p className="mt-1 text-sm text-red-500">{errors.size.message}</p>
                          )}
                        </div>

                        <div className="rounded-lg bg-gray-800 p-4">
                          <p className="text-sm text-gray-400">
                            💡 <span className="font-semibold text-white">Bulk discount:</span> Order 12+ pieces
                            for 5% off, 25+ for 10% off, or 50+ for 15% off!
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 3: Upload Design */}
                  {currentStep === 3 && (
                    <Card className="border-gray-800 bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-white">Upload Your Design</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="design-file" className="text-white">
                            Design File (Optional)
                          </Label>
                          <div className="mt-2">
                            <input
                              id="design-file"
                              type="file"
                              accept="image/*,.pdf,.ai,.psd"
                              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                              className="block w-full rounded-lg border-2 border-dashed border-gray-700 bg-gray-800 p-8 text-center text-sm text-gray-400 file:mr-4 file:rounded-md file:border-0 file:bg-gray-700 file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-gray-600"
                            />
                            {selectedFile && (
                              <p className="mt-2 text-sm text-green-500">
                                ✓ Selected: {selectedFile.name}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="designNotes" className="text-white">
                            Design Notes
                          </Label>
                          <textarea
                            id="designNotes"
                            {...register('designNotes')}
                            placeholder="Tell us about your design, colors, placement, etc."
                            rows={4}
                            className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-500"
                          />
                        </div>

                        <div className="rounded-lg bg-gray-800 p-4">
                          <p className="text-sm text-gray-400">
                            📎 <span className="font-semibold text-white">Accepted formats:</span> PNG, JPG,
                            PDF, AI, PSD. Max file size: 25MB
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Step 4: Contact Info */}
                  {currentStep === 4 && (
                    <Card className="border-gray-800 bg-gray-900">
                      <CardHeader>
                        <CardTitle className="text-white">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <Label htmlFor="name" className="text-white">
                            Full Name *
                          </Label>
                          <Input
                            id="name"
                            placeholder="John Doe"
                            {...register('name')}
                            className="mt-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="email" className="text-white">
                            Email Address *
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="john@example.com"
                            {...register('email')}
                            className="mt-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="phone" className="text-white">
                            Phone Number *
                          </Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...register('phone')}
                            className="mt-2 border-gray-700 bg-gray-800 text-white placeholder:text-gray-500"
                          />
                          {errors.phone && (
                            <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Navigation Buttons */}
                  <div className="mt-8 flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      className="border-gray-700 bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50"
                    >
                      Previous
                    </Button>

                    {currentStep < 4 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-white text-black hover:bg-gray-200"
                      >
                        Next Step
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="bg-white text-black hover:bg-gray-200"
                      >
                        Submit Quote Request
                      </Button>
                    )}
                  </div>
                </form>
              </div>

              {/* Price Calculator Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 border-gray-800 bg-gray-900">
                  <CardHeader>
                    <CardTitle className="text-white">Estimated Price</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {estimatedPrice ? (
                      <>
                        <div className="mb-4 text-center">
                          <p className="text-4xl font-bold text-white">${estimatedPrice.toFixed(2)}</p>
                          <p className="mt-1 text-sm text-gray-400">Estimated total</p>
                        </div>

                        <div className="space-y-2 rounded-lg bg-gray-800 p-4 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-400">Service:</span>
                            <span className="text-white font-medium">
                              {displayServices.find((s) => s.id === watchedService)?.title}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-400">Quantity:</span>
                            <span className="text-white font-medium">{watchedQuantity} units</span>
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-gray-500">
                          * Final price may vary based on design complexity, size adjustments, and
                          additional services
                        </p>
                      </>
                    ) : (
                      <p className="text-center text-gray-500">
                        Complete the form to see your estimated price
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

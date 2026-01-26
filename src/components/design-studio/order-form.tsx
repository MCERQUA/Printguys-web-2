'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, User, Mail, Phone, MessageSquare, Minus, Plus, Check, Loader2, MapPin, Building2, Printer } from 'lucide-react';
import type { ProductState, ProductColor, ProductType } from './types';
import { SIZES, PRODUCT_COLORS, PRODUCT_CONFIGS, PRODUCT_PRICES, PRINT_PRICES, PRINT_METHODS, BULK_DISCOUNTS, TAX_RATE, SHIPPING_COST, SHIPPING_THRESHOLD } from './constants';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  productState: ProductState;
  productColor: ProductColor;
  productType: ProductType;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  isOpen,
  onClose,
  productState,
  productColor,
  productType,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    notes: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postal: '',
    country: 'CA',
  });

  const [sizes, setSizes] = useState<Record<string, number>>({
    XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0,
  });

  const [printMethod, setPrintMethod] = useState('dtf');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQuantity = Object.values(sizes).reduce((a, b) => a + b, 0);
  const colorConfig = PRODUCT_COLORS.find(c => c.value === productColor);
  const productConfig = PRODUCT_CONFIGS[productType];

  // Calculate pricing
  const basePrice = PRODUCT_PRICES[productType];
  const printPrice = PRINT_PRICES[printMethod as keyof typeof PRINT_PRICES] || PRINT_PRICES.dtf;
  const printLocations = (productState.front.length > 0 ? 1 : 0) + (productState.back.length > 0 ? 1 : 0);
  const unitPrice = basePrice + (printPrice * printLocations);

  // Bulk discount
  const discount = BULK_DISCOUNTS.filter(d => totalQuantity >= d.minQty).pop() || BULK_DISCOUNTS[0];
  const discountPercent = discount.discount;

  const subtotal = Math.round(unitPrice * totalQuantity * (1 - discountPercent / 100));
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = totalQuantity >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + tax + shipping;

  const updateSize = (size: string, delta: number) => {
    setSizes(prev => ({
      ...prev,
      [size]: Math.max(0, prev[size] + delta),
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }

    if (totalQuantity === 0) {
      setError('Please select at least one size');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          design: {
            frontDecals: productState.front,
            backDecals: productState.back,
            productColor,
            productType,
          },
          sizes,
          printMethod,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone || undefined,
            company: formData.company || undefined,
          },
          shippingAddress: formData.addressLine1 ? {
            line1: formData.addressLine1,
            line2: formData.addressLine2 || undefined,
            city: formData.city,
            province: formData.province,
            postal: formData.postal,
            country: formData.country,
          } : undefined,
          notes: formData.notes || undefined,
          pricing: {
            unitPrice,
            subtotal,
            tax,
            shipping,
            total,
            discountPercent,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quote request');
      }

      setIsSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', email: '', phone: '', company: '', notes: '',
      addressLine1: '', addressLine2: '', city: '', province: '', postal: '', country: 'CA',
    });
    setSizes({ XS: 0, S: 0, M: 0, L: 0, XL: 0, '2XL': 0, '3XL': 0, '4XL': 0, '5XL': 0 });
    setPrintMethod('dtf');
    setIsSubmitted(false);
    setError(null);
  };

  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-2xl max-h-[90vh] bg-gray-900 border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            style={{ boxShadow: '0 0 60px rgba(239,68,68,0.2)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center" style={{ boxShadow: '0 0 15px rgba(239,68,68,0.4)' }}>
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">Get a Quote</h2>
                  <p className="text-xs text-gray-500">Request pricing for your custom design</p>
                </div>
              </div>
              <motion.button
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-white"
                onClick={onClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isSubmitted ? (
                <motion.div
                  className="flex flex-col items-center justify-center py-10 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
                    <Check className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-2xl text-white mb-2">Quote Requested!</h3>
                  <p className="text-gray-400 text-sm mb-6">
                    We&apos;ll review your design and get back to you within 24 hours with a detailed quote.
                  </p>
                  <div className="flex gap-3">
                    <motion.button
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-sm"
                      onClick={resetForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      New Quote
                    </motion.button>
                    <motion.button
                      className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold text-sm"
                      onClick={onClose}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Design Summary */}
                  <div className="bg-black/50 rounded-xl p-4 border border-white/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Your Design</p>
                        <p className="text-sm text-white">
                          {productConfig.label} • {productState.front.length + productState.back.length} design(s)
                        </p>
                      </div>
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white/20"
                        style={{ backgroundColor: colorConfig?.hex }}
                        title={colorConfig?.label}
                      />
                    </div>
                  </div>

                  {/* Print Method */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      Print Method
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRINT_METHODS.map((method) => (
                        <motion.button
                          key={method.value}
                          type="button"
                          onClick={() => setPrintMethod(method.value)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            printMethod === method.value
                              ? 'border-red-500 bg-red-500/10'
                              : 'border-white/10 hover:border-white/30 bg-white/5'
                          }`}
                          whileTap={{ scale: 0.98 }}
                        >
                          <p className={`font-semibold text-sm ${printMethod === method.value ? 'text-red-500' : 'text-white'}`}>
                            {method.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">{method.description}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase">Contact Info</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="name"
                          placeholder="Your Name *"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          name="company"
                          placeholder="Company (optional)"
                          value={formData.company}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address *"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                          required
                        />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          name="phone"
                          placeholder="Phone (optional)"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-gray-500 uppercase">Sizes & Quantities</h3>
                      <span className="text-xs text-red-500 font-semibold">
                        Total: {totalQuantity} {discountPercent > 0 && <span className="text-green-500">({discountPercent}% off!)</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                      {SIZES.map((size) => (
                        <div
                          key={size}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg bg-black/50 border border-white/5"
                        >
                          <span className="text-xs text-gray-400 font-semibold">{size}</span>
                          <div className="flex items-center gap-1">
                            <motion.button
                              type="button"
                              className="w-6 h-6 rounded bg-white/5 hover:bg-white/10 flex items-center justify-center text-white disabled:opacity-30"
                              onClick={() => updateSize(size, -1)}
                              disabled={sizes[size] === 0}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Minus className="w-3 h-3" />
                            </motion.button>
                            <span className="w-6 text-center text-white text-sm">
                              {sizes[size]}
                            </span>
                            <motion.button
                              type="button"
                              className="w-6 h-6 rounded bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-white"
                              onClick={() => updateSize(size, 1)}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Plus className="w-3 h-3" />
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 text-center">
                      Bulk discounts: 12+ (5% off) • 24+ (10% off) • 48+ (15% off) • 100+ (20% off) • 250+ (25% off)
                    </p>
                  </div>

                  {/* Pricing Summary */}
                  {totalQuantity > 0 && (
                    <div className="bg-black/50 rounded-xl p-4 border border-white/5 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{totalQuantity} x {productConfig.label} @ {formatPrice(unitPrice)} each</span>
                        <span className="text-white">{formatPrice(unitPrice * totalQuantity)}</span>
                      </div>
                      {discountPercent > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-green-500">Bulk Discount ({discountPercent}%)</span>
                          <span className="text-green-500">-{formatPrice(Math.round(unitPrice * totalQuantity * discountPercent / 100))}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">{formatPrice(subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">HST (13%)</span>
                        <span className="text-white">{formatPrice(tax)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping</span>
                        <span className={shipping === 0 ? 'text-green-500' : 'text-white'}>
                          {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                        </span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-base font-bold">
                        <span className="text-white">Estimated Total</span>
                        <span className="text-red-500">{formatPrice(total)}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 text-center pt-1">
                        * Final pricing may vary based on design complexity
                      </p>
                    </div>
                  )}

                  {/* Shipping Address (Optional) */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Shipping Address (Optional)
                    </h3>
                    <div className="relative">
                      <input
                        type="text"
                        name="addressLine1"
                        placeholder="Street Address"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                      />
                    </div>
                    {formData.addressLine1 && (
                      <>
                        <input
                          type="text"
                          name="addressLine2"
                          placeholder="Apt, Suite, etc. (optional)"
                          value={formData.addressLine2}
                          onChange={handleInputChange}
                          className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                          />
                          <input
                            type="text"
                            name="province"
                            placeholder="Province"
                            value={formData.province}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            name="postal"
                            placeholder="Postal Code"
                            value={formData.postal}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50"
                          />
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500/50"
                          >
                            <option value="CA">Canada</option>
                            <option value="US">United States</option>
                          </select>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-gray-500 uppercase">Special Notes</h3>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                      <textarea
                        name="notes"
                        placeholder="Any special requests or instructions..."
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full bg-black border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:border-red-500/50 resize-none"
                      />
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div
                      className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      {error}
                    </motion.div>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting || totalQuantity === 0}
                    whileHover={!isSubmitting ? { scale: 1.02, boxShadow: '0 0 30px rgba(239,68,68,0.5)' } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                    style={{ boxShadow: '0 0 20px rgba(239,68,68,0.3)' }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        Request Quote {totalQuantity > 0 && `- ${formatPrice(total)}`}
                      </>
                    )}
                  </motion.button>

                  <p className="text-xs text-gray-500 text-center">
                    We&apos;ll review your design and send you a detailed quote within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;
  return createPortal(modalContent, document.body);
};

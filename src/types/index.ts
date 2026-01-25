// ==========================================
// USER TYPES
// ==========================================

export type SubscriptionTier = 'FREE' | 'PRO' | 'BUSINESS' | 'ENTERPRISE';

export interface User {
  id: string;
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  avatar?: string;
  subscriptionTier: SubscriptionTier;
  subscriptionId?: string;
  aiCredits: number;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
  id: string;
  userId: string;
  type: AddressType;
  isDefault: boolean;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PRODUCT TYPES
// ==========================================

export type ProductStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
export type PrintMethod = 'DTF' | 'SCREEN' | 'EMBROIDERY' | 'SUBLIMATION' | 'UV_DTF' | 'VINYL' | 'THREE_D' | 'NFC';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  categoryId: string;
  category?: Category;
  tags: string[];
  basePrice: number;
  trackInventory: boolean;
  inventoryCount?: number;
  images: ProductImage[];
  threeDModelUrl?: string;
  printMethods: PrintMethod[];
  status: ProductStatus;
  featured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt?: string;
  position: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price: number;
  compareAt?: number;
  options: Record<string, string>;
  inventoryCount?: number;
  allowBackorder: boolean;
  imageUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: string;
}

// ==========================================
// CART TYPES
// ==========================================

export interface Cart {
  id: string;
  userId?: string;
  sessionId: string;
  items: CartItem[];
  subtotal: number;
  total: number;
  promoCode?: string;
  discount: number;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product?: Product;
  variantId: string;
  variant?: ProductVariant;
  quantity: number;
  customization?: Record<string, unknown>;
  designId?: string;
  design?: Design;
  unitPrice: number;
  printPrice: number;
  totalPrice: number;
}

// ==========================================
// ORDER TYPES
// ==========================================

export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIAL' | 'REFUNDED' | 'FAILED';
export type FulfillmentStatus = 'UNFULFILLED' | 'PARTIAL' | 'FULFILLED' | 'CANCELLED';
export type ProductionStatus = 'PENDING' | 'IN_DESIGN' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'READY';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'QUALITY_CHECK' | 'READY_TO_SHIP' | 'SHIPPED' | 'DELIVERED' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  user?: User;
  email: string;
  phone?: string;
  shippingAddressId: string;
  shippingAddress: Address;
  billingAddressId: string;
  billingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  fulfillmentStatus: FulfillmentStatus;
  productionStatus: ProductionStatus;
  productionNotes?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  status: OrderStatus;
  cancelledAt?: Date;
  cancelReason?: string;
  notes: OrderNote[];
  internalNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product?: Product;
  variantId: string;
  variant?: ProductVariant;
  quantity: number;
  name: string;
  sku: string;
  options?: Record<string, unknown>;
  customization?: Record<string, unknown>;
  designId?: string;
  design?: Design;
  unitPrice: number;
  printPrice: number;
  totalPrice: number;
  designFileUrl?: string;
  proofFileUrl?: string;
}

export interface OrderNote {
  id: string;
  orderId: string;
  content: string;
  isInternal: boolean;
  authorId?: string;
  createdAt: Date;
}

// ==========================================
// DESIGN TYPES
// ==========================================

export type DesignFileType = 'ORIGINAL' | 'PRINT_READY' | 'PREVIEW' | 'THUMBNAIL';

export interface Design {
  id: string;
  userId: string;
  user?: User;
  name: string;
  description?: string;
  canvasData?: Record<string, unknown>;
  thumbnail?: string;
  files: DesignFile[];
  aiGenerated: boolean;
  aiPrompt?: string;
  width?: number;
  height?: number;
  colorCount?: number;
  isTemplate: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface DesignFile {
  id: string;
  designId: string;
  type: DesignFileType;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

// ==========================================
// AI TYPES
// ==========================================

export type AIGenerationType = 'DESIGN' | 'LOGO' | 'BACKGROUND_REMOVAL' | 'UPSCALE' | 'AVATAR';
export type AIGenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface AIGeneration {
  id: string;
  userId: string;
  type: AIGenerationType;
  prompt: string;
  parameters?: Record<string, unknown>;
  status: AIGenerationStatus;
  resultUrls: string[];
  error?: string;
  creditsUsed: number;
  createdAt: Date;
  completedAt?: Date;
}

// ==========================================
// NFC & 3D TYPES
// ==========================================

export type NFCContentType = 'URL' | 'VCARD' | 'TEXT' | 'WIFI' | 'DYNAMIC' | 'AR_TRIGGER';

export interface NFCTag {
  id: string;
  userId: string;
  name: string;
  tagId: string;
  contentType: NFCContentType;
  content: Record<string, unknown>;
  totalScans: number;
  lastScanned?: Date;
  active: boolean;
  orderId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NFCTagScan {
  id: string;
  tagId: string;
  userAgent?: string;
  ip?: string;
  city?: string;
  country?: string;
  device?: string;
  scannedAt: Date;
}

export type ThreeDPrintStatus = 'QUOTED' | 'APPROVED' | 'PRINTING' | 'POST_PROCESSING' | 'QUALITY_CHECK' | 'READY' | 'SHIPPED';

export interface ThreeDPrintJob {
  id: string;
  userId: string;
  orderId?: string;
  fileUrl: string;
  fileType: string;
  volume: number;
  dimensions: { x: number; y: number; z: number };
  material: string;
  finish: string;
  color?: string;
  quantity: number;
  quotedPrice: number;
  status: ThreeDPrintStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// SUBSCRIPTION TYPES
// ==========================================

export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'TRIALING';

export interface Subscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// PROMO TYPES
// ==========================================

export type PromoType = 'PERCENTAGE' | 'FIXED' | 'FREE_SHIPPING';

export interface PromoCode {
  id: string;
  code: string;
  type: PromoType;
  value: number;
  minOrderValue?: number;
  maxUses?: number;
  usesPerCustomer?: number;
  startsAt?: Date;
  endsAt?: Date;
  productIds: string[];
  categoryIds: string[];
  usageCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

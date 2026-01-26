import type { DesignAsset, ProductColor, ProductType, ProductConfig } from './types';

// Printguys brand colors
export const BRAND_RED = '#ef4444'; // Tailwind red-500
export const BRAND_RED_DARK = '#dc2626'; // Tailwind red-600

// Product colors available
export const PRODUCT_COLORS: { value: ProductColor; label: string; hex: string; textColor: string }[] = [
  { value: 'black', label: 'Black', hex: '#1a1a1a', textColor: 'white' },
  { value: 'white', label: 'White', hex: '#ffffff', textColor: 'black' },
  { value: 'gray', label: 'Gray', hex: '#6b7280', textColor: 'white' },
  { value: 'navy', label: 'Navy', hex: '#1e3a5f', textColor: 'white' },
  { value: 'red', label: 'Red', hex: '#dc2626', textColor: 'white' },
  { value: 'royal', label: 'Royal Blue', hex: '#2563eb', textColor: 'white' },
];

// Product type configurations
export const PRODUCT_CONFIGS: Record<ProductType, ProductConfig> = {
  tshirt: {
    type: 'tshirt',
    label: 'T-Shirt',
    printArea: { top: 22, left: 28, width: 44, height: 55 },
    svgPath: 'M150,30 C150,30 175,70 250,70 C325,70 350,30 350,30 L470,70 L430,170 L380,160 L380,450 C380,460 370,470 360,470 L140,470 C130,470 120,460 120,450 L120,160 L70,170 L30,70 L150,30 Z',
    necklineFront: 'M150,30 C175,70 325,70 350,30',
    necklineBack: 'M150,30 C175,45 325,45 350,30',
  },
  hoodie: {
    type: 'hoodie',
    label: 'Hoodie',
    printArea: { top: 25, left: 28, width: 44, height: 50 },
    svgPath: 'M150,30 C150,30 175,70 250,70 C325,70 350,30 350,30 L470,100 L450,200 L400,180 L400,450 C400,460 390,470 380,470 L120,470 C110,470 100,460 100,450 L100,180 L50,200 L30,100 L150,30 Z M150,30 L170,80 L180,200 L250,230 L320,200 L330,80 L350,30',
    necklineFront: 'M150,30 C175,80 325,80 350,30',
    necklineBack: 'M150,30 C175,50 325,50 350,30',
  },
  longsleeve: {
    type: 'longsleeve',
    label: 'Long Sleeve',
    printArea: { top: 22, left: 28, width: 44, height: 55 },
    svgPath: 'M150,30 C150,30 175,70 250,70 C325,70 350,30 350,30 L470,70 L450,400 L400,390 L380,160 L380,450 C380,460 370,470 360,470 L140,470 C130,470 120,460 120,450 L120,160 L100,390 L50,400 L30,70 L150,30 Z',
    necklineFront: 'M150,30 C175,70 325,70 350,30',
    necklineBack: 'M150,30 C175,45 325,45 350,30',
  },
  polo: {
    type: 'polo',
    label: 'Polo Shirt',
    printArea: { top: 28, left: 28, width: 44, height: 50 },
    svgPath: 'M150,30 C150,30 175,70 250,70 C325,70 350,30 350,30 L470,70 L430,170 L380,160 L380,450 C380,460 370,470 360,470 L140,470 C130,470 120,460 120,450 L120,160 L70,170 L30,70 L150,30 Z',
    necklineFront: 'M200,30 L200,90 M200,30 C210,50 290,50 300,30 M300,30 L300,90',
    necklineBack: 'M150,30 C175,45 325,45 350,30',
  },
  tank: {
    type: 'tank',
    label: 'Tank Top',
    printArea: { top: 18, left: 28, width: 44, height: 60 },
    svgPath: 'M170,20 C170,20 190,60 250,60 C310,60 330,20 330,20 L400,50 L380,120 L350,100 L350,450 C350,460 340,470 330,470 L170,470 C160,470 150,460 150,450 L150,100 L120,120 L100,50 L170,20 Z',
    necklineFront: 'M170,20 C190,60 310,60 330,20',
    necklineBack: 'M170,20 C190,40 310,40 330,20',
  },
};

// T-shirt sizes
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'] as const;

// Print methods available
export const PRINT_METHODS = [
  { value: 'dtf', label: 'DTF (Direct-to-Film)', description: 'Best for detailed, full-color designs' },
  { value: 'screen', label: 'Screen Printing', description: 'Best for bulk orders, vibrant colors' },
  { value: 'embroidery', label: 'Embroidery', description: 'Premium, textured finish' },
  { value: 'sublimation', label: 'Sublimation', description: 'Best for all-over prints on polyester' },
  { value: 'vinyl', label: 'Vinyl Heat Transfer', description: 'Great for names & numbers' },
] as const;

// Product pricing (in cents) - base prices
export const PRODUCT_PRICES = {
  tshirt: 1499,      // $14.99 base
  hoodie: 3499,      // $34.99 base
  longsleeve: 1999,  // $19.99 base
  polo: 2499,        // $24.99 base
  tank: 1299,        // $12.99 base
} as const;

// Print method pricing add-ons (in cents, per location)
export const PRINT_PRICES = {
  dtf: 800,           // $8.00 per print location
  screen: 600,        // $6.00 per print location (lower for bulk)
  embroidery: 1200,   // $12.00 per location
  sublimation: 1000,  // $10.00 per location
  vinyl: 500,         // $5.00 per location
} as const;

// Bulk pricing tiers (percentage discount)
export const BULK_DISCOUNTS = [
  { minQty: 1, discount: 0 },
  { minQty: 12, discount: 5 },
  { minQty: 24, discount: 10 },
  { minQty: 48, discount: 15 },
  { minQty: 100, discount: 20 },
  { minQty: 250, discount: 25 },
] as const;

export const SHIPPING_THRESHOLD = 10; // Free shipping over 10 items
export const SHIPPING_COST = 999; // $9.99
export const TAX_RATE = 0.13; // 13% HST (Ontario)

// Default design library - will be populated from public/images/designs
export const DESIGN_LIBRARY: DesignAsset[] = [];

// Default logo library - will be populated from public/images/logos
export const LOGO_LIBRARY: DesignAsset[] = [];

export const PRINT_AREA_ASPECT_RATIO = 0.8; // Width / Height

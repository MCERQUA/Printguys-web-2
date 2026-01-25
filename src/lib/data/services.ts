export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: string;
  priceNote: string;
  description: string;
  icon: string;
  color: string;
}

export const services: Service[] = [
  {
    id: "dtf",
    slug: "dtf",
    title: "DTF Heat Transfers",
    tagline: "Premium transfers for any fabric type",
    price: "$0.038/sq\"",
    priceNote: "No minimums",
    description: "Premium transfers for any fabric type with vibrant colors",
    icon: "Flame",
    color: "red",
  },
  {
    id: "screen-printing",
    slug: "screen-printing",
    title: "Screen Printing",
    tagline: "Bulk orders with vibrant colors",
    price: "Bulk Pricing",
    priceNote: "12+ pieces",
    description: "Bulk orders with bold, vibrant colors and cost-effective pricing",
    icon: "Zap",
    color: "blue",
  },
  {
    id: "embroidery",
    slug: "embroidery",
    title: "Custom Embroidery",
    tagline: "Professional logo stitching",
    price: "Professional",
    priceNote: "50+ colors",
    description: "Professional logo embroidery for corporate uniforms and apparel",
    icon: "Scissors",
    color: "purple",
  },
  {
    id: "safety-wear",
    slug: "safety-wear",
    title: "Safety Wear",
    tagline: "CSA/ANSI compliant apparel",
    price: "CSA/ANSI",
    priceNote: "Compliant",
    description: "CSA/ANSI compliant safety apparel with custom branding",
    icon: "ShieldAlert",
    color: "yellow",
  },
  {
    id: "sublimation",
    slug: "sublimation",
    title: "Sublimation",
    tagline: "Photo quality full color",
    price: "Photo Quality",
    priceNote: "Full color",
    description: "Photo-quality full-color printing for polyester fabrics",
    icon: "Palette",
    color: "cyan",
  },
  {
    id: "uv-dtf-stickers",
    slug: "uv-dtf-stickers",
    title: "UV DTF Stickers",
    tagline: "Waterproof durable stickers",
    price: "Waterproof",
    priceNote: "Durable",
    description: "Waterproof, scratch-resistant stickers for any surface",
    icon: "Sparkles",
    color: "emerald",
  },
];

export default services;

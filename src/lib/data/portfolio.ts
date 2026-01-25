export interface PortfolioItem {
  id: string;
  title: string;
  category: 'DTF' | 'Screen Printing' | 'Embroidery' | 'Large Format';
  image: string;
  description: string;
}

export const portfolioItems: PortfolioItem[] = [
  {
    id: 'portfolio-1',
    title: 'Custom Band Merch',
    category: 'DTF',
    image: 'https://placehold.co/600x600/1f2937/ef4444?text=DTF+Band+Merch',
    description: 'Vibrant DTF transfers for tour merchandise with intricate multi-color designs.',
  },
  {
    id: 'portfolio-2',
    title: 'Corporate Uniforms',
    category: 'Screen Printing',
    image: 'https://placehold.co/600x600/1f2937/3b82f6?text=Screen+Print',
    description: 'Professional screen-printed uniforms for a tech company with consistent branding.',
  },
  {
    id: 'portfolio-3',
    title: 'Sports Team Jerseys',
    category: 'Embroidery',
    image: 'https://placehold.co/600x600/1f2937/a855f7?text=Embroidery',
    description: 'Custom embroidered logos and numbers for a local hockey team.',
  },
  {
    id: 'portfolio-4',
    title: 'Event Banners',
    category: 'Large Format',
    image: 'https://placehold.co/600x600/1f2937/6366f1?text=Large+Format',
    description: 'Eye-catching large format banners for a trade show exhibition.',
  },
  {
    id: 'portfolio-5',
    title: 'Streetwear Collection',
    category: 'DTF',
    image: 'https://placehold.co/600x600/1f2937/ef4444?text=DTF+Streetwear',
    description: 'Bold DTF designs for a limited edition streetwear drop.',
  },
  {
    id: 'portfolio-6',
    title: 'Restaurant Staff Apparel',
    category: 'Screen Printing',
    image: 'https://placehold.co/600x600/1f2937/3b82f6?text=Restaurant+Uniforms',
    description: 'Durable screen-printed aprons and shirts for a busy restaurant chain.',
  },
  {
    id: 'portfolio-7',
    title: 'Luxury Polo Shirts',
    category: 'Embroidery',
    image: 'https://placehold.co/600x600/1f2937/a855f7?text=Polo+Embroidery',
    description: 'Elegant embroidered logos on premium cotton polo shirts for executive staff.',
  },
  {
    id: 'portfolio-8',
    title: 'Vehicle Wraps',
    category: 'Large Format',
    image: 'https://placehold.co/600x600/1f2937/6366f1?text=Vehicle+Wraps',
    description: 'Full-color large format graphics for a company fleet vehicle wrap.',
  },
  {
    id: 'portfolio-9',
    title: 'Anime Convention Merch',
    category: 'DTF',
    image: 'https://placehold.co/600x600/1f2937/ef4444?text=Anime+Merch',
    description: 'Detailed DTF transfers featuring complex anime artwork for convention sales.',
  },
  {
    id: 'portfolio-10',
    title: 'School Spirit Wear',
    category: 'Screen Printing',
    image: 'https://placehold.co/600x600/1f2937/3b82f6?text=School+Spirit',
    description: 'Bulk screen-printed t-shirts and hoodies for high school spirit week.',
  },
  {
    id: 'portfolio-11',
    title: 'Medical Scrubs',
    category: 'Embroidery',
    image: 'https://placehold.co/600x600/1f2937/a855f7?text=Medical+Scrubs',
    description: 'Professional name and practice embroidery on medical scrubs.',
  },
  {
    id: 'portfolio-12',
    title: 'Storefront Signage',
    category: 'Large Format',
    image: 'https://placehold.co/600x600/1f2937/6366f1?text=Storefront+Signs',
    description: 'Large format printed signage for retail storefront windows.',
  },
];

export type PortfolioCategory = PortfolioItem['category'] | 'All';

export const portfolioCategories: PortfolioCategory[] = [
  'All',
  'DTF',
  'Screen Printing',
  'Embroidery',
  'Large Format',
];

export default portfolioItems;

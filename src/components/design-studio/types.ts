export interface DesignAsset {
  id: string;
  url: string;
  name: string;
  category?: 'uploaded' | 'preset' | 'logo' | 'design';
}

export interface PlacedDecal {
  id: string;
  assetId: string;
  url: string;
  x: number; // Percentage relative to print area width (0-100)
  y: number; // Percentage relative to print area height (0-100)
  scale: number; // Scale factor (1 = 100%)
  rotation: number; // Degrees
  width: number; // Original width in pixels
  height: number; // Original height
  aspectRatio: number;
}

export type ProductSide = 'front' | 'back';

export type ProductColor = 'black' | 'white' | 'gray' | 'navy' | 'red' | 'royal';

export type ProductType = 'tshirt' | 'hoodie' | 'longsleeve' | 'polo' | 'tank';

export interface ProductState {
  front: PlacedDecal[];
  back: PlacedDecal[];
  color: ProductColor;
  type: ProductType;
}

export interface CustomerOrder {
  designs: {
    front: PlacedDecal[];
    back: PlacedDecal[];
    productColor: ProductColor;
    productType: ProductType;
    mockupImageFront?: string;
    mockupImageBack?: string;
  };
  customer: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
  };
  quantity: number;
  sizes: Record<string, number>;
  printMethod: string;
}

// For API responses
export interface SavedDesign {
  id: string;
  name: string;
  frontDecals: PlacedDecal[];
  backDecals: PlacedDecal[];
  productColor: ProductColor;
  productType: ProductType;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Product configuration for different product types
export interface ProductConfig {
  type: ProductType;
  label: string;
  printArea: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  svgPath: string;
  necklineFront: string;
  necklineBack: string;
}

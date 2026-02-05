/**
 * SS Activewear Product Import Script
 *
 * Imports products from SS Activewear Excel file into the database
 * Can also import from API data (JSON format)
 *
 * Usage: npx tsx scripts/import-ss-activewear.ts
 */

import * as XLSX from 'xlsx';
import { PrismaClient, PrintMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// File paths - update these to match your downloaded files
const EXCEL_FILE_PATH = '/home/nick/Nick/Printguys-AI/Suplyer-CSV/SSActivewear.xlsx'; // Update with actual path
const API_JSON_PATH = '/home/nick/Nick/Printguys-AI/Suplyer-CSV/SSActivewear-api.json'; // If using API export

// Supplier info
const SUPPLIER_CODE = 'SSA';
const SUPPLIER_NAME = 'S&S Activewear';
const SUPPLIER_WEBSITE = 'https://en-ca.ssactivewear.com';
const IMAGE_BASE_URL = 'https://www.ssactivewear.com/';

// Import mode: 'excel' or 'api'
const IMPORT_MODE = 'excel'; // Change to 'api' if importing from API JSON export

// Interface for API product data (SS Activewear API format)
interface SSApiProduct {
  sku: string;
  gtin: string;
  skuID_Master: number;
  yourSku: string;
  styleID: number;
  brandName: string;
  styleName: string;
  colorName: string;
  colorCode: string;
  colorPriceCodeName: string;
  colorGroup: string;
  colorGroupName: string;
  colorFamilyID: string;
  colorFamily: string;
  colorSwatchImage: string;
  colorSwatchTextColor: string;
  colorFrontImage: string;
  colorSideImage: string;
  colorBackImage: string;
  colorDirectSideImage: string;
  colorOnModelFrontImage: string;
  colorOnModelSideImage: string;
  colorOnModelBackImage: string;
  color1: string;
  color2: string;
  sizeName: string;
  sizeCode: string;
  sizeOrder: string;
  sizePriceCodeName: string;
  caseQty: number;
  unitWeight: number;
  mapPrice: number;
  piecePrice: number;
  dozenPrice: number;
  casePrice: number;
  salePrice: number;
  customerPrice: number;
  saleExpiration: string | null;
  noeRetailing: boolean;
  caseWeight: number;
  caseWidth: number;
  caseLength: number;
  caseHeight: number;
  PolyPackQty: string;
  qty: number;
  countryOfOrigin: string;
  warehouses: SSWarehouse[];
}

interface SSWarehouse {
  warehouseAbbr: string;
  skuID: number;
  qty: number;
  closeout: boolean;
  dropship: boolean;
  excludeFreeFreight: boolean;
  fullCaseOnly: boolean;
  returnable: boolean;
}

// Interface for Excel row data (if using Data Library Excel)
interface ExcelRow {
  'Product Id': string;
  'Product Number': number | string;
  'Style Name': string;
  'Brand Name': string;
  'Size': string;
  'Color Name': string;
  'Color Code': string;
  'GTIN': string;
  'Piece Price': number;
  'Dozen Price': number;
  'Case Price': number;
  'Customer Price': number;
  'Case Quantity': number;
  'Weight': number;
  'Inventory': number;
  'Front Image': string;
  'Side Image': string;
  'Back Image': string;
  'Description': string;
  'Category': string;
}

// Category mapping - SS Activewear categories to our print methods
function getPrintMethodsForCategory(category: string): PrintMethod[] {
  const categoryLower = category.toLowerCase();

  // Base print methods for most apparel
  const apparelMethods: PrintMethod[] = ['DTF', 'SCREEN', 'EMBROIDERY'];

  // Category-specific mappings
  if (categoryLower.includes('t-shirt') || categoryLower.includes('activewear') || categoryLower.includes('tops')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY', 'SUBLIMATION', 'VINYL'];
  }
  if (categoryLower.includes('fleece') || categoryLower.includes('sweat') || categoryLower.includes('hood') || categoryLower.includes('outerwear')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY'];
  }
  if (categoryLower.includes('polo') || categoryLower.includes('knit')) {
    return ['DTF', 'EMBROIDERY', 'SCREEN'];
  }
  if (categoryLower.includes('headwear') || categoryLower.includes('hat') || categoryLower.includes('cap') || categoryLower.includes('beanie')) {
    return ['EMBROIDERY', 'DTF'];
  }
  if (categoryLower.includes('bag') || categoryLower.includes('tote')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY', 'SUBLIMATION'];
  }
  if (categoryLower.includes('bottom') || categoryLower.includes('pant') || categoryLower.includes('short')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY'];
  }
  if (categoryLower.includes('woven') || categoryLower.includes('dress') || categoryLower.includes('button')) {
    return ['EMBROIDERY', 'DTF', 'SCREEN'];
  }
  if (categoryLower.includes('accessories') || categoryLower.includes('towel') || categoryLower.includes('apron')) {
    return ['EMBROIDERY', 'DTF', 'SUBLIMATION', 'SCREEN'];
  }

  // Default
  return apparelMethods;
}

// Category name normalization
function normalizeCategoryName(rawCategory: string): string {
  const categoryLower = rawCategory.toLowerCase();

  // Map SS Activewear categories to our standard categories
  if (categoryLower.includes('t-shirt') || categoryLower.includes('tee')) return 'T-Shirts';
  if (categoryLower.includes('fleece') || categoryLower.includes('sweat')) return 'Sweatshirts & Fleece';
  if (categoryLower.includes('polo') || categoryLower.includes('knit')) return 'Polos & Knits';
  if (categoryLower.includes('headwear') || categoryLower.includes('hat') || categoryLower.includes('cap') || categoryLower.includes('beanie')) return 'Headwear';
  if (categoryLower.includes('outerwear') || categoryLower.includes('jacket') || categoryLower.includes('vest')) return 'Outerwear';
  if (categoryLower.includes('bottom') || categoryLower.includes('pant') || categoryLower.includes('short')) return 'Bottoms';
  if (categoryLower.includes('bag') || categoryLower.includes('tote') || categoryLower.includes('backpack')) return 'Bags';
  if (categoryLower.includes('accessories') || categoryLower.includes('towel') || categoryLower.includes('apron') || categoryLower.includes('bib')) return 'Accessories';

  return rawCategory;
}

// Generate slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[®™ᴹᴰ]/g, '') // Remove trademark symbols
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    .substring(0, 100); // Limit length
}

// Generate color code from color name
function colorCode(colorName: string): string {
  return colorName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 10) || 'UNK';
}

// Build full image URL
function buildImageUrl(imagePath: string, size: 'small' | 'medium' | 'large' = 'medium'): string {
  if (!imagePath || imagePath === 'deprecated') return null;

  // Replace image size suffix
  let sizedPath = imagePath;
  if (size === 'large') {
    sizedPath = imagePath.replace('_fm.jpg', '_fl.jpg').replace('_fm', '_fl');
  } else if (size === 'small') {
    sizedPath = imagePath.replace('_fm.jpg', '_fs.jpg').replace('_fm', '_fs');
  }

  return IMAGE_BASE_URL + sizedPath;
}

// Safely parse price
function safeParsePrice(value: number | string | undefined | null): number {
  if (value === null || value === undefined) return 0;
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  const str = String(value).trim();
  if (!str || str.toLowerCase().includes('call') || str.toLowerCase().includes('pricing')) {
    return 0;
  }
  const num = parseFloat(str.replace(/[^0-9.-]/g, ''));
  return isNaN(num) ? 0 : num;
}

// Clean HTML from description
function cleanDescription(html: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/\r\n|\r|\n/g, ' ')
    .trim();
}

// Process products from API format
async function processApiProducts(products: SSApiProduct[]) {
  console.log(`Processing ${products.length} products from API format...`);

  // Group by style (brandName + styleName)
  const styleGroups = new Map<string, SSApiProduct[]>();
  for (const product of products) {
    const styleKey = `${product.brandName}-${product.styleName}-${product.styleID}`;
    if (!styleGroups.has(styleKey)) {
      styleGroups.set(styleKey, []);
    }
    styleGroups.get(styleKey)!.push(product);
  }

  console.log(`Found ${styleGroups.size} unique styles`);
  return styleGroups;
}

// Process products from Excel format
async function processExcelProducts(rows: ExcelRow[]) {
  console.log(`Processing ${rows.length} rows from Excel...`);

  // Group by Product Number (style)
  const productGroups = new Map<string, ExcelRow[]>();
  for (const row of rows) {
    const productNumber = String(row['Product Number']);
    if (!productGroups.has(productNumber)) {
      productGroups.set(productNumber, []);
    }
    productGroups.get(productNumber)!.push(row);
  }

  console.log(`Found ${productGroups.size} unique products`);
  return productGroups;
}

// Main import function
async function importSSActivewearProducts() {
  console.log('='.repeat(60));
  console.log('SS ACTIVEWEAR PRODUCT IMPORT');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Import mode: ${IMPORT_MODE}`);
  console.log('');

  try {
    // Step 1: Create or find supplier
    console.log('Step 1: Creating/finding supplier...');
    const supplier = await prisma.supplier.upsert({
      where: { code: SUPPLIER_CODE },
      update: {
        name: SUPPLIER_NAME,
        website: SUPPLIER_WEBSITE,
        isActive: true,
      },
      create: {
        code: SUPPLIER_CODE,
        name: SUPPLIER_NAME,
        website: SUPPLIER_WEBSITE,
        isActive: true,
      },
    });
    console.log(`  - Supplier ID: ${supplier.id}`);
    console.log(`  - Supplier: ${supplier.name} (${supplier.code})`);

    let styleGroups: Map<string, any[]>;
    let categories = new Set<string>();

    // Step 2: Read data based on import mode
    if (IMPORT_MODE === 'api') {
      console.log('\nStep 2: Reading API JSON export...');
      const apiData = readFileSync(API_JSON_PATH, 'utf-8');
      const products: SSApiProduct[] = JSON.parse(apiData);
      console.log(`  - Total products: ${products.length}`);
      styleGroups = await processApiProducts(products);

      // Extract categories from brand/style names (SS Activewear doesn't have category in product data)
      // We'll use brand as category initially
      for (const product of products) {
        categories.add(product.brandName);
      }
    } else {
      console.log('\nStep 2: Reading Excel file...');
      const workbook = XLSX.readFile(EXCEL_FILE_PATH);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
      console.log(`  - Total rows: ${rows.length}`);
      styleGroups = await processExcelProducts(rows);

      // Extract categories
      for (const row of rows) {
        if (row['Category']) {
          categories.add(row['Category']);
        }
      }
    }

    // Step 3: Create categories
    console.log('\nStep 3: Creating categories...');
    const categoryMap: Map<string, string> = new Map();

    for (const catName of Array.from(categories).filter(Boolean)) {
      const normalizedName = normalizeCategoryName(catName);
      const catSlug = `ss-${slugify(normalizedName)}`;

      const category = await prisma.blankCategory.upsert({
        where: { slug: catSlug },
        update: {
          name: normalizedName,
        },
        create: {
          supplierId: supplier.id,
          name: normalizedName,
          slug: catSlug,
          position: Array.from(categories).indexOf(catName),
        },
      });
      categoryMap.set(catName, category.id);
      console.log(`  - ${normalizedName} (${catSlug})`);
    }

    // Step 4: Import products
    console.log('\nStep 4: Importing products and variants...');
    let productCount = 0;
    let variantCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const [styleKey, variants] of Array.from(styleGroups.entries())) {
      try {
        productCount++;
        const firstVariant = variants[0];

        // Extract product info
        const brandName = firstVariant.brandName || firstVariant['Brand Name'];
        const styleName = firstVariant.styleName || firstVariant['Style Name'] || firstVariant['Product Number'];
        const styleId = firstVariant.styleID || firstVariant['Product Number'];

        // Generate SKU and slug
        const productSku = `SSA-${styleId}`;
        const brandSlug = slugify(brandName);
        const nameSlug = slugify(styleName);
        const productSlug = `ss-${brandSlug}-${nameSlug}`.substring(0, 150);

        // Extract unique sizes
        const availableSizes = Array.from(new Set(
          variants.map(v => v.sizeName || v['Size'])
        )).filter(Boolean);

        // Extract unique colors with hex codes
        const colorData: Map<string, { name: string; hex: string | null }> = new Map();
        for (const v of variants) {
          const colorName = v.colorName || v['Color Name'];
          if (colorName && !colorData.has(colorName)) {
            colorData.set(colorName, {
              name: colorName,
              hex: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
            });
          }
        }
        const availableColors = Array.from(colorData.values()).map(c => ({
          name: c.name,
          hex: c.hex,
        }));

        // Calculate price range
        const prices = variants.map(v => {
          const price = v.customerPrice || v['Customer Price'] || v.piecePrice || v['Piece Price'];
          return safeParsePrice(price);
        }).filter(p => p > 0);

        const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
        const priceMax = prices.length > 0 ? Math.max(...prices) : 0;
        const msrp = safeParsePrice(firstVariant.mapPrice || firstVariant['MSRP']) || priceMax * 1.5 || 0;

        // Collect images
        const images: string[] = [];
        const primaryImage = buildImageUrl(firstVariant.colorFrontImage || firstVariant['Front Image']);

        if (firstVariant.colorFrontImage || firstVariant['Front Image']) {
          images.push(buildImageUrl(firstVariant.colorFrontImage || firstVariant['Front Image'], 'large')!);
        }
        if (firstVariant.colorSideImage || firstVariant['Side Image']) {
          images.push(buildImageUrl(firstVariant.colorSideImage || firstVariant['Side Image'], 'large')!);
        }
        if (firstVariant.colorBackImage || firstVariant['Back Image']) {
          images.push(buildImageUrl(firstVariant.colorBackImage || firstVariant['Back Image'], 'large')!);
        }

        // Get category
        const categoryKey = firstVariant['Category'] || brandName;
        const categoryId = categoryMap.get(categoryKey);

        if (!categoryId) {
          // Create category if not exists
          const normalizedName = normalizeCategoryName(categoryKey);
          const catSlug = `ss-${slugify(normalizedName)}`;
          const category = await prisma.blankCategory.create({
            data: {
              supplierId: supplier.id,
              name: normalizedName,
              slug: catSlug,
            },
          });
          categoryMap.set(categoryKey, category.id);
        }

        // Get print methods (based on category)
        const categoryName = categoryKey || 'T-Shirts';
        const printMethods = getPrintMethodsForCategory(categoryName);

        // Create or update product
        const product = await prisma.blankProduct.upsert({
          where: { sku: productSku },
          update: {
            name: styleName,
            description: firstVariant['Description'] || `${brandName} ${styleName}`,
            shortDescription: `${brandName} ${styleName} - ${availableColors.length} colors, ${availableSizes.length} sizes`,
            brand: brandName,
            availableSizes,
            availableColors,
            msrp: new Decimal(msrp),
            priceMin: new Decimal(priceMin),
            priceMax: new Decimal(priceMax),
            primaryImageUrl: primaryImage,
            images,
            printMethods,
            supplierData: {
              styleID: firstVariant.styleID || styleId,
              gtin: firstVariant.gtin || firstVariant['GTIN'],
              countryOfOrigin: firstVariant.countryOfOrigin,
            },
            isActive: true,
          },
          create: {
            supplierId: supplier.id,
            categoryId: categoryMap.get(categoryKey)!,
            styleNumber: String(styleId),
            sku: productSku,
            slug: productSlug,
            name: styleName,
            description: firstVariant['Description'] || `${brandName} ${styleName}`,
            shortDescription: `${brandName} ${styleName} - ${availableColors.length} colors, ${availableSizes.length} sizes`,
            brand: brandName,
            availableSizes,
            availableColors,
            msrp: new Decimal(msrp),
            priceMin: new Decimal(priceMin),
            priceMax: new Decimal(priceMax),
            primaryImageUrl: primaryImage,
            images,
            printMethods,
            supplierData: {
              styleID: firstVariant.styleID || styleId,
              gtin: firstVariant.gtin || firstVariant['GTIN'],
              countryOfOrigin: firstVariant.countryOfOrigin,
            },
            isActive: true,
          },
        });

        // Create variants
        for (const v of variants) {
          try {
            const size = v.sizeName || v['Size'];
            const colorName = v.colorName || v['Color Name'];
            const colorCodeStr = v.colorCode || v['Color Code'] || colorCode(colorName);
            const variantSku = `SSA-${styleId}-${size}-${colorCodeStr}`;

            // Parse prices
            const variantMsrp = safeParsePrice(v.mapPrice || v['MSRP']);
            const variantPrice1 = safeParsePrice(v.piecePrice || v['Piece Price'] || v.customerPrice || v['Customer Price']);
            const variantPriceDozen = safeParsePrice(v.dozenPrice || v['Dozen Price']);
            const variantPriceCase = safeParsePrice(v.casePrice || v['Case Price']);
            const variantWeight = safeParsePrice(v.unitWeight || v['Weight']);
            const variantCaseQty = v.caseQty || v['Case Quantity'] || 1;
            const variantQty = v.qty || v['Inventory'] || 0;

            await prisma.blankProductVariant.upsert({
              where: { sku: variantSku },
              update: {
                supplierSku: v.sku || v['Product Id'] || '',
                size,
                colorName,
                colorCode: colorCodeStr,
                hexCode: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
                msrp: new Decimal(variantMsrp),
                price1: new Decimal(variantPrice1),
                priceCase: new Decimal(variantPriceCase),
                caseQuantity: variantCaseQty,
                weight: new Decimal(variantWeight),
                imageUrl: buildImageUrl(v.colorFrontImage || v['Front Image'], 'large'),
                inStock: variantQty > 0,
                stockLevel: variantQty,
              },
              create: {
                productId: product.id,
                sku: variantSku,
                supplierSku: v.sku || v['Product Id'] || '',
                size,
                colorName,
                colorCode: colorCodeStr,
                hexCode: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
                msrp: new Decimal(variantMsrp),
                price1: new Decimal(variantPrice1),
                priceCase: new Decimal(variantPriceCase),
                caseQuantity: variantCaseQty,
                weight: new Decimal(variantWeight),
                imageUrl: buildImageUrl(v.colorFrontImage || v['Front Image'], 'large'),
                inStock: variantQty > 0,
                stockLevel: variantQty,
              },
            });
            variantCount++;
          } catch (variantError: any) {
            errorCount++;
            errors.push(`Variant error (${styleId}/${size}/${colorName}): ${variantError.message}`);
          }
        }

        // Progress logging every 100 products
        if (productCount % 100 === 0) {
          console.log(`  - Processed ${productCount}/${styleGroups.size} products (${variantCount} variants)`);
        }
      } catch (productError: any) {
        errorCount++;
        errors.push(`Product error (${styleKey}): ${productError.message}`);
        console.error(`  ! Error on product ${styleKey}: ${productError.message}`);
      }
    }

    // Final stats
    console.log('\n' + '='.repeat(60));
    console.log('IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`  - Products imported: ${productCount}`);
    console.log(`  - Variants created: ${variantCount}`);
    console.log(`  - Categories: ${categories.size}`);
    console.log(`  - Errors: ${errorCount}`);
    console.log(`  - Completed at: ${new Date().toISOString()}`);

    if (errors.length > 0 && errors.length <= 20) {
      console.log('\nErrors:');
      errors.forEach(e => console.log(`  - ${e}`));
    } else if (errors.length > 20) {
      console.log(`\nFirst 20 errors (of ${errors.length}):`);
      errors.slice(0, 20).forEach(e => console.log(`  - ${e}`));
    }

  } catch (error) {
    console.error('\nFATAL ERROR:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the import
importSSActivewearProducts()
  .then(() => {
    console.log('\nImport script finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nImport script failed:', error);
    process.exit(1);
  });

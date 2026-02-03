/**
 * Sanmar Canada Product Import Script
 *
 * Imports products from Sanmar Canada Excel file into the database
 *
 * Usage: npx tsx scripts/import-sanmar.ts
 */

import * as XLSX from 'xlsx';
import { PrismaClient, PrintMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// Excel file path
const EXCEL_FILE_PATH = '/home/nick/Nick/Printguys-AI/Suplyer-CSV/SanMarCanada_CSV_Jun_27_2025_Update2.xlsx';

// Supplier info
const SUPPLIER_CODE = 'SANMAR';
const SUPPLIER_NAME = 'Sanmar Canada';
const SUPPLIER_WEBSITE = 'https://www.sanmarcanada.com';

// Interface for Excel row data
interface ExcelRow {
  'Product Id': string;
  'Product Number': number | string;
  'All Sizes': string;
  'Size': string;
  'EDI Colour': string;
  'English Colour': string;
  'French Colour': string;
  'MSRP': number;
  '1+ piece price\r\nper item': number;
  'Case price\r\nper item': number;
  '10+ case price\r\nper item': number;
  'Quantity Per Case': number;
  'Weight Per Piece (lbs)': number;
  'Image': string;
  'English Name': string;
  'French Name': string;
  'English Description': string;
  'French Description': string;
  'English Brand Name': string;
  'French Brand Name': string;
  'English Category': string;
  'French Category': string;
  'Pantone Colour': string;
  'Hex Code': string;
  'New': string;
}

// Print method mapping by category
function getPrintMethodsForCategory(category: string): PrintMethod[] {
  const categoryLower = category.toLowerCase();

  // Base print methods for most apparel
  const apparelMethods: PrintMethod[] = ['DTF', 'SCREEN', 'EMBROIDERY'];

  // Category-specific mappings
  if (categoryLower.includes('t-shirt') || categoryLower.includes('activewear')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY', 'SUBLIMATION', 'VINYL'];
  }
  if (categoryLower.includes('fleece') || categoryLower.includes('outerwear')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY'];
  }
  if (categoryLower.includes('polo')) {
    return ['DTF', 'EMBROIDERY', 'SCREEN'];
  }
  if (categoryLower.includes('headwear') || categoryLower.includes('hat') || categoryLower.includes('cap')) {
    return ['EMBROIDERY', 'DTF'];
  }
  if (categoryLower.includes('bag')) {
    return ['DTF', 'SCREEN', 'EMBROIDERY', 'SUBLIMATION'];
  }
  if (categoryLower.includes('workwear')) {
    return ['EMBROIDERY', 'SCREEN', 'DTF', 'VINYL'];
  }
  if (categoryLower.includes('woven') || categoryLower.includes('shirt')) {
    return ['EMBROIDERY', 'DTF', 'SCREEN'];
  }
  if (categoryLower.includes('accessories')) {
    return ['EMBROIDERY', 'DTF', 'SUBLIMATION'];
  }

  // Default
  return apparelMethods;
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

// Parse hex code (ensure # prefix) - handle numbers and strings
function parseHexCode(hex: string | number | undefined | null): string | null {
  if (hex === null || hex === undefined || hex === '' || hex === '.') return null;
  // Convert to string if number
  const hexStr = String(hex).trim();
  if (!hexStr) return null;
  const cleaned = hexStr.replace('#', '').trim();
  if (cleaned.length === 6 || cleaned.length === 3) {
    return `#${cleaned.toUpperCase()}`;
  }
  return null;
}

// Safely parse price - handles "Call for Pricing" and other non-numeric values
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

// Main import function
async function importSanmarProducts() {
  console.log('='.repeat(60));
  console.log('SANMAR CANADA PRODUCT IMPORT');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Step 1: Read Excel file
    console.log('Step 1: Reading Excel file...');
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: ExcelRow[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });
    console.log(`  - Total rows: ${rows.length}`);

    // Step 2: Create or find supplier
    console.log('\nStep 2: Creating/finding supplier...');
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

    // Step 3: Extract and create categories
    console.log('\nStep 3: Creating categories...');
    const uniqueCategories = Array.from(new Set(rows.map(r => r['English Category']))).filter(Boolean);
    const categoryMap: Map<string, string> = new Map();

    for (const catName of uniqueCategories) {
      const frenchName = rows.find(r => r['English Category'] === catName)?.['French Category'] || null;
      const catSlug = `sanmar-${slugify(catName)}`;

      const category = await prisma.blankCategory.upsert({
        where: { slug: catSlug },
        update: {
          name: catName,
          nameFr: frenchName,
        },
        create: {
          supplierId: supplier.id,
          name: catName,
          nameFr: frenchName,
          slug: catSlug,
          position: uniqueCategories.indexOf(catName),
        },
      });
      categoryMap.set(catName, category.id);
      console.log(`  - ${catName} (${catSlug})`);
    }

    // Step 4: Group rows by Product Number
    console.log('\nStep 4: Grouping products...');
    const productGroups: Map<string, ExcelRow[]> = new Map();
    for (const row of rows) {
      const productNumber = String(row['Product Number']);
      if (!productGroups.has(productNumber)) {
        productGroups.set(productNumber, []);
      }
      productGroups.get(productNumber)!.push(row);
    }
    console.log(`  - Unique products: ${productGroups.size}`);

    // Step 5: Import products and variants
    console.log('\nStep 5: Importing products and variants...');
    let productCount = 0;
    let variantCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const [productNumber, productRows] of Array.from(productGroups.entries())) {
      try {
        productCount++;
        const firstRow = productRows[0];

        // Generate SKU and slug
        const productSku = `SANMAR-${productNumber}`;
        const brandSlug = slugify(firstRow['English Brand Name']);
        const nameSlug = slugify(firstRow['English Name']);
        const productSlug = `${brandSlug}-${nameSlug}`.substring(0, 150);

        // Extract unique sizes from "All Sizes" field
        const allSizesStr = firstRow['All Sizes'] || '';
        const availableSizes = allSizesStr
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

        // Extract unique colors with hex codes
        const colorData: Map<string, { name: string; nameFr: string; hex: string | null; pantone: string | null }> = new Map();
        for (const row of productRows) {
          const colorName = row['English Colour'];
          if (colorName && !colorData.has(colorName)) {
            colorData.set(colorName, {
              name: colorName,
              nameFr: row['French Colour'] || colorName,
              hex: parseHexCode(row['Hex Code']),
              pantone: row['Pantone Colour'] && row['Pantone Colour'] !== '.' ? row['Pantone Colour'] : null,
            });
          }
        }
        const availableColors = Array.from(colorData.values());

        // Calculate price range (using safe parsing)
        const prices = productRows.map(r => safeParsePrice(r['1+ piece price\r\nper item'])).filter(p => p > 0);
        const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
        const priceMax = prices.length > 0 ? Math.max(...prices) : 0;
        const msrp = safeParsePrice(firstRow['MSRP']) || priceMax * 2 || 0;

        // Collect unique images
        const images = Array.from(new Set(productRows.map(r => r['Image']).filter(Boolean)));
        const primaryImage = images[0] || null;

        // Get category
        const categoryId = categoryMap.get(firstRow['English Category']);
        if (!categoryId) {
          throw new Error(`Category not found: ${firstRow['English Category']}`);
        }

        // Get print methods
        const printMethods = getPrintMethodsForCategory(firstRow['English Category']);

        // Check if product is new
        const isNew = firstRow['New'] === 'Y' || firstRow['New'] === 'Yes';

        // Create or update product
        const product = await prisma.blankProduct.upsert({
          where: { sku: productSku },
          update: {
            name: firstRow['English Name'],
            nameFr: firstRow['French Name'],
            description: firstRow['English Description'],
            descriptionFr: firstRow['French Description'],
            shortDescription: cleanDescription(firstRow['English Description']).substring(0, 250),
            brand: firstRow['English Brand Name'],
            brandFr: firstRow['French Brand Name'],
            availableSizes,
            availableColors,
            msrp: new Decimal(msrp),
            priceMin: new Decimal(priceMin),
            priceMax: new Decimal(priceMax),
            primaryImageUrl: primaryImage,
            images,
            printMethods,
            isNew,
            isActive: true,
          },
          create: {
            supplierId: supplier.id,
            categoryId,
            styleNumber: productNumber,
            sku: productSku,
            slug: productSlug,
            name: firstRow['English Name'],
            nameFr: firstRow['French Name'],
            description: firstRow['English Description'],
            descriptionFr: firstRow['French Description'],
            shortDescription: cleanDescription(firstRow['English Description']).substring(0, 250),
            brand: firstRow['English Brand Name'],
            brandFr: firstRow['French Brand Name'],
            availableSizes,
            availableColors,
            msrp: new Decimal(msrp),
            priceMin: new Decimal(priceMin),
            priceMax: new Decimal(priceMax),
            primaryImageUrl: primaryImage,
            images,
            printMethods,
            isNew,
            isActive: true,
          },
        });

        // Create variants for each row (each size/color combo)
        for (const row of productRows) {
          try {
            const size = String(row['Size']); // Ensure size is always a string
            const colorName = row['English Colour'];
            const colorCodeStr = colorCode(colorName);
            const variantSku = `SANMAR-${productNumber}-${size}-${colorCodeStr}`;

            // Safe parse all prices
            const variantMsrp = safeParsePrice(row['MSRP']);
            const variantPrice1 = safeParsePrice(row['1+ piece price\r\nper item']);
            const variantPriceCase = safeParsePrice(row['Case price\r\nper item']);
            const variantPrice10Case = safeParsePrice(row['10+ case price\r\nper item']);
            const variantWeight = safeParsePrice(row['Weight Per Piece (lbs)']);

            await prisma.blankProductVariant.upsert({
              where: { sku: variantSku },
              update: {
                supplierSku: String(row['Product Id']),
                size,
                colorName,
                colorNameFr: row['French Colour'] || colorName,
                colorCode: row['EDI Colour'] || null,
                hexCode: parseHexCode(row['Hex Code']),
                pantoneCode: row['Pantone Colour'] && row['Pantone Colour'] !== '.' ? String(row['Pantone Colour']) : null,
                msrp: new Decimal(variantMsrp),
                price1: new Decimal(variantPrice1),
                priceCase: new Decimal(variantPriceCase),
                price10Case: new Decimal(variantPrice10Case),
                caseQuantity: row['Quantity Per Case'] || 1,
                weight: new Decimal(variantWeight),
                imageUrl: row['Image'] || null,
                inStock: variantPrice1 > 0, // Only in stock if has a price
              },
              create: {
                productId: product.id,
                sku: variantSku,
                supplierSku: String(row['Product Id']),
                size,
                colorName,
                colorNameFr: row['French Colour'] || colorName,
                colorCode: row['EDI Colour'] || null,
                hexCode: parseHexCode(row['Hex Code']),
                pantoneCode: row['Pantone Colour'] && row['Pantone Colour'] !== '.' ? String(row['Pantone Colour']) : null,
                msrp: new Decimal(variantMsrp),
                price1: new Decimal(variantPrice1),
                priceCase: new Decimal(variantPriceCase),
                price10Case: new Decimal(variantPrice10Case),
                caseQuantity: row['Quantity Per Case'] || 1,
                weight: new Decimal(variantWeight),
                imageUrl: row['Image'] || null,
                inStock: variantPrice1 > 0, // Only in stock if has a price
              },
            });
            variantCount++;
          } catch (variantError: any) {
            errorCount++;
            errors.push(`Variant error (${productNumber}/${row['Size']}/${row['English Colour']}): ${variantError.message}`);
          }
        }

        // Progress logging every 100 products
        if (productCount % 100 === 0) {
          console.log(`  - Processed ${productCount}/${productGroups.size} products (${variantCount} variants)`);
        }
      } catch (productError: any) {
        errorCount++;
        errors.push(`Product error (${productNumber}): ${productError.message}`);
        console.error(`  ! Error on product ${productNumber}: ${productError.message}`);
      }
    }

    // Final stats
    console.log('\n' + '='.repeat(60));
    console.log('IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`  - Products imported: ${productCount}`);
    console.log(`  - Variants created: ${variantCount}`);
    console.log(`  - Categories: ${uniqueCategories.length}`);
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
importSanmarProducts()
  .then(() => {
    console.log('\nImport script finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nImport script failed:', error);
    process.exit(1);
  });

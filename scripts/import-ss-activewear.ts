/**
 * SS Activewear Product Import Script
 *
 * Imports products from SS Activewear Excel file into the database
 *
 * Usage: npx tsx scripts/import-ss-activewear.ts
 */

import * as XLSX from 'xlsx';
import { PrismaClient, PrintMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Initialize Prisma client
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

// File paths
const EXCEL_DIR = '/home/nick/Nick/Printguys-AI/Suplyer-CSV/SNS_Canada_DataLibrary';
const PRODUCTS_FILE = `${EXCEL_DIR}/Products.xlsx`;
const STYLES_FILE = `${EXCEL_DIR}/Styles.xlsx`;
const CATEGORIES_FILE = `${EXCEL_DIR}/Categories.xlsx`;
const IMAGE_BASE_URL = 'https://cdn.ssactivewear.com/';

// Supplier info
const SUPPLIER_CODE = 'SSA';
const SUPPLIER_NAME = 'S&S Activewear';
const SUPPLIER_WEBSITE = 'https://en-ca.ssactivewear.com';

// Interface for SS Activewear Excel product data
interface SSProductRow {
  sku: string;
  gtin: string;
  skuID_Master: number;
  styleID: number;
  brandName: string;
  styleName: string;
  colorName: string;
  colorCode: string;
  colorPriceCodeName: string;
  colorGroup: number;
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
  CaseQty: number;
  unitWeight: number;
  MAPPrice: number;
  piecePrice: number;
  dozenPrice: number;
  casePrice: number;
  salePrice: number;
  customerPrice: number;
  saleExpireDate: string;
  closeout: number;
  excludeFreeFreight: boolean;
  Qty: number;
  active_QC: boolean;
  active_ON: boolean;
  active_BC: boolean;
  active_NB: boolean;
  active_AB: boolean;
  active_DS: boolean;
  qty_QC: number;
  qty_ON: number;
  qty_BC: number;
  qty_NB: number;
  qty_AB: number;
  qty_DS: number;
  fullCaseOnly_DS: boolean;
  Returnable: number;
  NoeRetailing: boolean;
  BoxRequired: boolean;
  CaseWeight: number;
  BoxHeight: number;
  BoxLength: number;
  BoxWidth: number;
  DropShipOnly: boolean;
}

// Interface for Styles data
interface SSStyleRow {
  styleID: number;
  brandName: string;
  styleName: string;
  name: string;
  description: string;
  nameFr: string;
  descriptionFr: string;
  CategoryID: number;
  Category: string;
}

// Interface for Categories data
interface SSCategoryRow {
  CategoryID: number;
  name: string;
}

// Print method mapping by category
function getPrintMethodsForCategory(category: string): PrintMethod[] {
  const categoryLower = category.toLowerCase();

  const apparelMethods: PrintMethod[] = ['DTF', 'SCREEN', 'EMBROIDERY'];

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
  if (categoryLower.includes('accessories') || categoryLower.includes('towel') || categoryLower.includes('apron') || categoryLower.includes('bib')) {
    return ['EMBROIDERY', 'DTF', 'SUBLIMATION', 'SCREEN'];
  }

  return apparelMethods;
}

// Generate slug from text
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[®™ᴹᴰ]/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Build full image URL
function buildImageUrl(imagePath: string, size: 'small' | 'medium' | 'large' = 'large'): string | null {
  if (!imagePath || imagePath === 'deprecated' || imagePath === '') return null;

  let sizedPath = imagePath;
  if (size === 'large') {
    sizedPath = imagePath.replace('_fm.jpg', '_fl.jpg').replace('_fm', '_fl');
  } else if (size === 'small') {
    sizedPath = imagePath.replace('_fm.jpg', '_fs.jpg').replace('_fm', '_fs');
  }

  return IMAGE_BASE_URL + sizedPath;
}

// Main import function
async function importSSActivewearProducts() {
  console.log('='.repeat(60));
  console.log('SS ACTIVEWEAR PRODUCT IMPORT');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log('');

  try {
    // Step 1: Create supplier
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

    // Step 2: Load categories
    console.log('\nStep 2: Loading categories...');
    const categoriesWorkbook = XLSX.readFile(CATEGORIES_FILE);
    const categoriesSheet = categoriesWorkbook.Sheets[categoriesWorkbook.SheetNames[0]];
    const categoriesRows: SSCategoryRow[] = XLSX.utils.sheet_to_json(categoriesSheet, { defval: '' });

    const categoryMap = new Map<number, { id: string; name: string }>();
    const categoryMapByName = new Map<string, string>();

    for (const row of categoriesRows) {
      const catSlug = `ss-${slugify(row.name)}`;
      const category = await prisma.blankCategory.upsert({
        where: { slug: catSlug },
        update: { name: row.name },
        create: {
          supplierId: supplier.id,
          name: row.name,
          slug: catSlug,
          position: row.CategoryID,
        },
      });
      categoryMap.set(row.CategoryID, { id: category.id, name: row.name });
      categoryMapByName.set(row.name.toLowerCase(), category.id);
      console.log(`  - ${row.name} (ID: ${row.CategoryID})`);
    }

    // Step 3: Load styles for descriptions
    console.log('\nStep 3: Loading styles for descriptions...');
    const stylesWorkbook = XLSX.readFile(STYLES_FILE);
    const stylesSheet = stylesWorkbook.Sheets[stylesWorkbook.SheetNames[0]];
    const stylesRows: SSStyleRow[] = XLSX.utils.sheet_to_json(stylesSheet, { defval: '' });
    console.log(`  - Loaded ${stylesRows.length} styles`);

    const styleInfoMap = new Map<number, SSStyleRow>();
    for (const style of stylesRows) {
      styleInfoMap.set(style.styleID, style);
    }

    // Step 4: Load products
    console.log('\nStep 4: Loading products...');
    const productsWorkbook = XLSX.readFile(PRODUCTS_FILE);
    const productsSheet = productsWorkbook.Sheets[productsWorkbook.SheetNames[0]];
    const productsRows: SSProductRow[] = XLSX.utils.sheet_to_json(productsSheet, { defval: '' });
    console.log(`  - Total products/SKUs: ${productsRows.length}`);

    // Group by styleID
    const styleGroups = new Map<number, SSProductRow[]>();
    for (const row of productsRows) {
      if (!styleGroups.has(row.styleID)) {
        styleGroups.set(row.styleID, []);
      }
      styleGroups.get(row.styleID)!.push(row);
    }
    console.log(`  - Unique styles: ${styleGroups.size}`);

    // Step 5: Import products
    console.log('\nStep 5: Importing products and variants...');
    let productCount = 0;
    let variantCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const [styleID, variants] of Array.from(styleGroups.entries())) {
      try {
        productCount++;
        const firstVariant = variants[0];
        const styleInfo = styleInfoMap.get(styleID);

        const brandName = firstVariant.brandName;
        const styleName = firstVariant.styleName;
        const categoryName = styleInfo?.Category || 'T-Shirts';
        const categoryId = categoryMapByName.get(categoryName.toLowerCase());

        // If category doesn't exist, create it
        let finalCategoryId = categoryId;
        if (!finalCategoryId && styleInfo?.CategoryID) {
          const catInfo = categoryMap.get(styleInfo.CategoryID);
          if (catInfo) {
            finalCategoryId = catInfo.id;
          }
        }

        // Fallback category if still not found
        if (!finalCategoryId) {
          const fallbackSlug = `ss-${slugify(categoryName)}`;
          const fallbackCategory = await prisma.blankCategory.upsert({
            where: { slug: fallbackSlug },
            update: {},
            create: {
              supplierId: supplier.id,
              name: categoryName,
              slug: fallbackSlug,
            },
          });
          finalCategoryId = fallbackCategory.id;
        }

        // Generate SKU and slug
        const productSku = `SSA-${styleID}`;
        const brandSlug = slugify(brandName);
        const nameSlug = slugify(styleName);
        const productSlug = `ss-${brandSlug}-${nameSlug}`.substring(0, 150);

        // Extract unique sizes
        const availableSizes = Array.from(new Set(
          variants.map(v => v.sizeName)
        )).filter(Boolean).sort((a, b) => {
          const aOrder = variants.find(v => v.sizeName === a)?.sizeOrder || '';
          const bOrder = variants.find(v => v.sizeName === b)?.sizeOrder || '';
          return aOrder.localeCompare(bOrder);
        });

        // Extract unique colors
        const colorData = new Map<string, { name: string; hex: string | null; family: string | null }>();
        for (const v of variants) {
          if (!colorData.has(v.colorName)) {
            colorData.set(v.colorName, {
              name: v.colorName,
              hex: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
              family: v.colorFamily || null,
            });
          }
        }
        const availableColors = Array.from(colorData.values());

        // Calculate price range (use customerPrice, fallback to piecePrice)
        const prices = variants
          .map(v => v.customerPrice > 0 ? v.customerPrice : v.piecePrice)
          .filter(p => p > 0);

        const priceMin = prices.length > 0 ? Math.min(...prices) : 0;
        const priceMax = prices.length > 0 ? Math.max(...prices) : 0;
        const msrp = firstVariant.MAPPrice > 0.01 ? firstVariant.MAPPrice : priceMax * 1.5;

        // Collect images
        const images: string[] = [];
        const primaryImage = buildImageUrl(firstVariant.colorFrontImage);

        if (firstVariant.colorFrontImage) images.push(buildImageUrl(firstVariant.colorFrontImage)!);
        if (firstVariant.colorSideImage) images.push(buildImageUrl(firstVariant.colorSideImage)!);
        if (firstVariant.colorBackImage) images.push(buildImageUrl(firstVariant.colorBackImage)!);
        if (firstVariant.colorOnModelFrontImage) images.push(buildImageUrl(firstVariant.colorOnModelFrontImage)!);

        // Get description from styles
        const description = styleInfo?.description || `${brandName} ${styleName}`;
        const descriptionFr = styleInfo?.descriptionFr || '';

        // Get print methods
        const printMethods = getPrintMethodsForCategory(categoryName);

        // Create or update product
        const product = await prisma.blankProduct.upsert({
          where: { sku: productSku },
          update: {
            name: styleName,
            description,
            descriptionFr,
            shortDescription: `${brandName} ${styleName}`,
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
              styleID,
              gtin: firstVariant.gtin,
              closeout: firstVariant.closeout === 1,
            },
            isActive: true,
          },
          create: {
            supplierId: supplier.id,
            categoryId: finalCategoryId,
            styleNumber: styleName,
            sku: productSku,
            slug: productSlug,
            name: styleName,
            description,
            descriptionFr,
            shortDescription: `${brandName} ${styleName}`,
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
              styleID,
              gtin: firstVariant.gtin,
              closeout: firstVariant.closeout === 1,
            },
            isActive: true,
          },
        });

        // Create variants
        for (const v of variants) {
          try {
            const variantSku = `SSA-${v.sku}`;

            // Safe price parsing with fallbacks - handle empty strings, 0, and invalid values
            const customerPrice = typeof v.customerPrice === 'number' && v.customerPrice > 0 ? v.customerPrice : 0;
            const piecePrice = typeof v.piecePrice === 'number' && v.piecePrice > 0 ? v.piecePrice : 0;
            const casePrice = typeof v.casePrice === 'number' && v.casePrice > 0 ? v.casePrice : 0;
            const price = customerPrice > 0 ? customerPrice : (piecePrice > 0 ? piecePrice : casePrice);

            // Skip variants with no pricing (unavailable items)
            if (price === 0) {
              errors.push(`Variant error (${v.sku}): No valid pricing found - skipping unavailable item`);
              errorCount++;
              continue;
            }

            // SS Activewear doesn't have price10Case, calculate as 5% discount on case price
            const price10Case = casePrice > 0 ? casePrice * 0.95 : price * 0.95;

            // Safe MAP parsing (0.01 means "call for price")
            const msrp = v.MAPPrice > 1 ? v.MAPPrice : price * 1.5;

            await prisma.blankProductVariant.upsert({
              where: { sku: variantSku },
              update: {
                supplierSku: v.sku,
                size: v.sizeName,
                colorName: v.colorName,
                colorCode: v.colorCode,
                hexCode: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
                msrp: new Decimal(msrp),
                price1: new Decimal(price),
                priceCase: new Decimal(casePrice > 0 ? casePrice : price),
                price10Case: new Decimal(price10Case),
                caseQuantity: v.CaseQty || 1,
                weight: new Decimal(v.unitWeight || 0),
                imageUrl: buildImageUrl(v.colorFrontImage),
                inStock: v.Qty > 0,
                stockLevel: v.Qty,
              },
              create: {
                productId: product.id,
                sku: variantSku,
                supplierSku: v.sku,
                size: v.sizeName,
                colorName: v.colorName,
                colorCode: v.colorCode,
                hexCode: v.color1 && v.color1.startsWith('#') ? v.color1 : null,
                msrp: new Decimal(msrp),
                price1: new Decimal(price),
                priceCase: new Decimal(casePrice > 0 ? casePrice : price),
                price10Case: new Decimal(price10Case),
                caseQuantity: v.CaseQty || 1,
                weight: new Decimal(v.unitWeight || 0),
                imageUrl: buildImageUrl(v.colorFrontImage),
                inStock: v.Qty > 0,
                stockLevel: v.Qty,
              },
            });
            variantCount++;
          } catch (variantError: any) {
            errorCount++;
            errors.push(`Variant error (${v.sku}): ${variantError.message}`);
          }
        }

        // Progress logging
        if (productCount % 100 === 0) {
          console.log(`  - Processed ${productCount}/${styleGroups.size} products (${variantCount} variants)`);
        }
      } catch (productError: any) {
        errorCount++;
        errors.push(`Product error (${styleID}): ${productError.message}`);
        console.error(`  ! Error on style ${styleID}: ${productError.message}`);
      }
    }

    // Final stats
    console.log('\n' + '='.repeat(60));
    console.log('IMPORT COMPLETE');
    console.log('='.repeat(60));
    console.log(`  - Products imported: ${productCount}`);
    console.log(`  - Variants created: ${variantCount}`);
    console.log(`  - Categories: ${categoriesRows.length}`);
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

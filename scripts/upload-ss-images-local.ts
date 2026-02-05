/**
 * SS Activewear Images to Cloudinary (from local ZIP)
 *
 * Use this if you downloaded the SS Activewear images ZIP.
 *
 * Steps:
 * 1. Download SNS_Canada_Images.zip from SS Activewear
 * 2. Extract to: /home/nick/Nick/Printguys-AI/Suplyer-CSV/SNS_Canada_Images/
 * 3. Run: npx tsx scripts/upload-ss-images-local.ts
 *
 * Usage: npx tsx scripts/upload-ss-images-local.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({ log: ['error', 'warn'] });

// Local extracted images directory
const IMAGES_DIR = '/home/nick/Nick/Printguys-AI/Suplyer-CSV/SNS_Canada_Images';
const CLOUDINARY_FOLDER = 'printguys/blanks/ss-activewear';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Get all image files recursively
function getAllImages(dir: string): string[] {
  const files: string[] = [];

  function walk(currentDir: string) {
    try {
      const entries = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (entry.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (e) {
      // Skip directories we can't read
    }
  }

  walk(dir);
  return files;
}

// Extract image key from local path
// Local: /path/to/SNS_Canada_Images/Color/12345_f_fm.jpg
// Returns: Color/12345_f_fm
function extractImageKey(filePath: string): string {
  const relative = path.relative(IMAGES_DIR, filePath);
  return relative.replace(/\\/g, '/');
}

// Convert local file path to expected SS Activewear URL format
function localPathToSsUrl(filePath: string): string {
  const relative = path.relative(IMAGES_DIR, filePath);
  return `https://cdn.ssactivewear.com/${relative.replace(/\\/g, '/')}`;
}

// Generate Cloudinary public ID from local path
function pathToPublicId(filePath: string): string {
  const relative = path.relative(IMAGES_DIR, filePath);
  const withoutExt = relative.replace(/\.[^.]+$/, '');
  return `${CLOUDINARY_FOLDER}/${withoutExt}`.replace(/\\/g, '/');
}

// Upload local file to Cloudinary
async function uploadToCloudinary(
  filepath: string,
  publicId: string
): Promise<string | null> {
  try {
    const result = await cloudinary.uploader.upload(filepath, {
      public_id: publicId,
      folder: CLOUDINARY_FOLDER,
      transformation: [
        { quality: 'auto:good', fetch_format: 'auto' },
      ],
    });

    return result.secure_url;
  } catch (error: any) {
    console.error(`  Upload error: ${error.message}`);
    return null;
  }
}

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('='.repeat(60));
  console.log('SS ACTIVEWEAR IMAGES TO CLOUDINARY (LOCAL)');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);

  // Check env vars
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('\nMissing Cloudinary credentials!');
    console.error('Set these in .env.local:');
    console.error('  CLOUDINARY_CLOUD_NAME=' + process.env.CLOUDINARY_CLOUD_NAME);
    console.error('  CLOUDINARY_API_KEY=' + process.env.CLOUDINARY_API_KEY);
    console.error('  CLOUDINARY_API_SECRET=***');
    process.exit(1);
  }

  // Check if images directory exists
  if (!fs.existsSync(IMAGES_DIR)) {
    console.error(`\nImages directory not found: ${IMAGES_DIR}`);
    console.error('\nPlease:');
    console.error('1. Download SNS_Canada_Images.zip from SS Activewear');
    console.error('2. Extract it to: ' + IMAGES_DIR);
    process.exit(1);
  }

  console.log(`\nCloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Images directory: ${IMAGES_DIR}`);
  console.log(`Cloudinary folder: ${CLOUDINARY_FOLDER}\n`);

  // Get all images
  console.log('Scanning for images...');
  const images = getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} images\n`);

  if (images.length === 0) {
    console.log('No images found.');
    process.exit(0);
  }

  // Build URL mapping
  const urlMapping = new Map<string, string>();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log('Uploading to Cloudinary...\n');

  for (let i = 0; i < images.length; i++) {
    const filepath = images[i];
    const imageKey = extractImageKey(filepath);
    const ssUrl = localPathToSsUrl(filepath);
    const publicId = pathToPublicId(filepath);

    console.log(`[${i + 1}/${images.length}] ${imageKey}`);

    // Check if already exists
    try {
      const existingResource = await cloudinary.api.resource(publicId);
      if (existingResource) {
        urlMapping.set(ssUrl, existingResource.secure_url);
        skippedCount++;
        console.log(`  ✓ Already exists`);
        continue;
      }
    } catch {
      // Resource doesn't exist, proceed with upload
    }

    // Upload
    const cloudUrl = await uploadToCloudinary(filepath, publicId);

    if (cloudUrl) {
      urlMapping.set(ssUrl, cloudUrl);
      successCount++;
      console.log(`  ✓ Uploaded`);
    } else {
      errorCount++;
      console.log(`  ✗ Failed`);
    }

    // Rate limiting
    if ((i + 1) % 10 === 0) {
      console.log(`  Progress: ${i + 1}/${images.length} uploaded`);
      await sleep(1000);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images:      ${images.length}`);
  console.log(`Uploaded:          ${successCount}`);
  console.log(`Skipped (exists):  ${skippedCount}`);
  console.log(`Errors:            ${errorCount}`);

  // Update database
  if (urlMapping.size > 0) {
    console.log('\nUpdating database with Cloudinary URLs...');

    let updatedProducts = 0;
    let updatedVariants = 0;

    // Update products
    const products = await prisma.blankProduct.findMany({
      where: {
        supplier: { code: 'SSA' },
        isActive: true,
      },
    });

    for (const product of products) {
      let needsUpdate = false;
      const updates: any = {};

      if (product.primaryImageUrl && urlMapping.has(product.primaryImageUrl)) {
        updates.primaryImageUrl = urlMapping.get(product.primaryImageUrl);
        needsUpdate = true;
      }

      if (product.images && product.images.length > 0) {
        const newImages = product.images.map(img => urlMapping.get(img) || img);
        if (newImages.some((img, i) => img !== product.images[i])) {
          updates.images = newImages;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        await prisma.blankProduct.update({
          where: { id: product.id },
          data: updates,
        });
        updatedProducts++;
      }
    }

    // Update variants
    for (const product of products) {
      const variants = await prisma.blankProductVariant.findMany({
        where: { productId: product.id },
      });

      for (const variant of variants) {
        if (variant.imageUrl && urlMapping.has(variant.imageUrl)) {
          await prisma.blankProductVariant.update({
            where: { id: variant.id },
            data: { imageUrl: urlMapping.get(variant.imageUrl)! },
          });
          updatedVariants++;
        }
      }
    }

    console.log(`  Products updated:  ${updatedProducts}`);
    console.log(`  Variants updated:  ${updatedVariants}`);
  }

  console.log('\nDone!');
  console.log(`Completed at: ${new Date().toISOString()}`);
}

main()
  .then(() => {
    prisma.$disconnect();
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nFatal error:', error);
    prisma.$disconnect();
    process.exit(1);
  });

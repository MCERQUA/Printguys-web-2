/**
 * Upload Sanmar Images to Cloudinary
 *
 * Uploads all local product images to Cloudinary CDN.
 * Updates database with Cloudinary URLs.
 *
 * Required env vars in .env.local:
 *   CLOUDINARY_CLOUD_NAME=your_cloud_name
 *   CLOUDINARY_API_KEY=965487829847593
 *   CLOUDINARY_API_SECRET=o8oq-p9HU8NggQbp-qqsPZ3v_IU
 *
 * Usage: npx tsx scripts/upload-to-cloudinary.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient({ log: ['error', 'warn'] });

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blanks', 'sanmar');
const CLOUDINARY_FOLDER = 'printguys/blanks/sanmar';

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
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
        files.push(fullPath);
      }
    }
  }

  walk(dir);
  return files;
}

// Convert local path to Cloudinary public ID
function pathToPublicId(filePath: string): string {
  const relative = path.relative(IMAGES_DIR, filePath);
  const withoutExt = relative.replace(/\.[^.]+$/, '');
  return `${CLOUDINARY_FOLDER}/${withoutExt}`.replace(/\\/g, '/');
}

// Convert local path to the expected local URL (for matching in DB)
function pathToLocalUrl(filePath: string): string {
  const relative = path.relative(path.join(process.cwd(), 'public'), filePath);
  return `/${relative}`.replace(/\\/g, '/');
}

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('='.repeat(60));
  console.log('UPLOAD IMAGES TO CLOUDINARY');
  console.log('='.repeat(60));

  // Check env vars
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('\nMissing Cloudinary credentials in environment!');
    console.error('Set these in .env.local:');
    console.error('  CLOUDINARY_CLOUD_NAME=your_cloud_name');
    console.error('  CLOUDINARY_API_KEY=your_api_key');
    console.error('  CLOUDINARY_API_SECRET=your_api_secret');
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

  // Build mapping: local URL -> Cloudinary URL
  const urlMapping = new Map<string, string>();

  console.log('Uploading to Cloudinary...');
  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const imagePath of images) {
    const publicId = pathToPublicId(imagePath);
    const localUrl = pathToLocalUrl(imagePath);

    try {
      // Check if already exists
      try {
        await cloudinary.api.resource(publicId);
        // Already exists
        const cloudinaryUrl = cloudinary.url(publicId, { secure: true });
        urlMapping.set(localUrl, cloudinaryUrl);
        skipped++;

        if ((uploaded + skipped) % 100 === 0) {
          console.log(`Progress: ${uploaded + skipped}/${images.length} (${uploaded} new, ${skipped} existing)`);
        }
        continue;
      } catch {
        // Doesn't exist, upload it
      }

      // Upload
      const result = await cloudinary.uploader.upload(imagePath, {
        public_id: publicId,
        folder: '', // Already included in public_id
        overwrite: false,
        resource_type: 'image',
      });

      urlMapping.set(localUrl, result.secure_url);
      uploaded++;

      if ((uploaded + skipped) % 50 === 0) {
        console.log(`Progress: ${uploaded + skipped}/${images.length} (${uploaded} new, ${skipped} existing, ${failed} failed)`);
      }

      // Small delay to avoid rate limits
      if (uploaded % 20 === 0) await sleep(100);

    } catch (error: any) {
      failed++;
      console.error(`Failed: ${publicId} - ${error.message}`);
    }
  }

  console.log(`\n  - Uploaded: ${uploaded} new images`);
  console.log(`  - Skipped: ${skipped} existing`);
  console.log(`  - Failed: ${failed}\n`);

  // Update database
  console.log('Updating database with Cloudinary URLs...');

  // Get products with local image URLs
  const products = await prisma.blankProduct.findMany({
    where: {
      supplier: { code: 'SANMAR' },
      primaryImageUrl: { startsWith: '/images/blanks/sanmar' }
    },
    select: {
      id: true,
      primaryImageUrl: true,
      images: true
    }
  });

  let productUpdates = 0;
  for (const product of products) {
    const updates: { primaryImageUrl?: string; images?: string[] } = {};

    if (product.primaryImageUrl && urlMapping.has(product.primaryImageUrl)) {
      updates.primaryImageUrl = urlMapping.get(product.primaryImageUrl);
    }

    if (product.images && Array.isArray(product.images)) {
      const newImages = (product.images as string[]).map(img =>
        urlMapping.get(img) || img
      );
      if (JSON.stringify(newImages) !== JSON.stringify(product.images)) {
        updates.images = newImages;
      }
    }

    if (Object.keys(updates).length > 0) {
      await prisma.blankProduct.update({
        where: { id: product.id },
        data: updates
      });
      productUpdates++;
    }
  }
  console.log(`  - Updated ${productUpdates} products`);

  // Update variants
  const variants = await prisma.blankProductVariant.findMany({
    where: {
      imageUrl: { startsWith: '/images/blanks/sanmar' },
      product: { supplier: { code: 'SANMAR' } }
    },
    select: {
      id: true,
      imageUrl: true
    }
  });

  let variantUpdates = 0;
  for (const variant of variants) {
    if (variant.imageUrl && urlMapping.has(variant.imageUrl)) {
      await prisma.blankProductVariant.update({
        where: { id: variant.id },
        data: { imageUrl: urlMapping.get(variant.imageUrl) }
      });
      variantUpdates++;
    }
  }
  console.log(`  - Updated ${variantUpdates} variants`);

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD COMPLETE');
  console.log('='.repeat(60));
  console.log(`  - Total images: ${images.length}`);
  console.log(`  - Uploaded: ${uploaded}`);
  console.log(`  - Already existed: ${skipped}`);
  console.log(`  - Failed: ${failed}`);
  console.log(`  - Products updated: ${productUpdates}`);
  console.log(`  - Variants updated: ${variantUpdates}`);
  console.log(`\nImages now served from: https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/...`);

  await prisma.$disconnect();
}

main()
  .then(() => {
    console.log('\nScript finished successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nScript failed:', error);
    process.exit(1);
  });

/**
 * SS Activewear Images to Cloudinary
 *
 * Downloads product images from SS Activewear CDN and uploads to Cloudinary.
 * Updates database with Cloudinary URLs.
 *
 * Prerequisites:
 * - Products must be imported first (run import-ss-activewear.ts)
 * - Cloudinary credentials in .env.local
 *
 * Usage: npx tsx scripts/upload-ss-activewear-images.ts
 */

import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as http from 'http';

const prisma = new PrismaClient({ log: ['error', 'warn'] });

const CLOUDINARY_FOLDER = 'printguys/blanks/ss-activewear';
const TEMP_DOWNLOAD_DIR = path.join(process.cwd(), 'temp', 'ss-activewear-images');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure temp directory exists
if (!fs.existsSync(TEMP_DOWNLOAD_DIR)) {
  fs.mkdirSync(TEMP_DOWNLOAD_DIR, { recursive: true });
}

// Extract image key from SS Activewear URL
// URL format: https://cdn.ssactivewear.com/Images/Color/133688_f_fm.jpg
function extractImageKey(url: string): string | null {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    // Path: /Images/Color/133688_f_fm.jpg
    const imagePath = urlObj.pathname;

    // Remove leading slash and create consistent key
    return imagePath.substring(1).replace(/\//g, '-');
  } catch {
    return null;
  }
}

// Generate Cloudinary public ID from SS Activewear image URL
function urlToPublicId(url: string, styleId: string, colorCode: string): string {
  const imageKey = extractImageKey(url);

  if (!imageKey) {
    // Fallback: use style and color
    return `${CLOUDINARY_FOLDER}/${styleId}-${colorCode}`;
  }

  // Clean up the image key for Cloudinary
  // Images/Color/133688_f_fm.jpg -> Images-Color-133688_f_fm
  const cleanKey = imageKey
    .replace(/\.[^.]+$/, '') // Remove extension
    .replace(/\//g, '-');    // Replace slashes with dashes

  return `${CLOUDINARY_FOLDER}/${cleanKey}`;
}

// Download image from URL to temp file
function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(filepath);

    const client = url.startsWith('https') ? https : http;

    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.ssactivewear.com/',
      }
    }, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      console.error(`  Download error: ${err.message}`);
      resolve(false);
    });
  });
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

// Get all unique image URLs from database
async function getAllSsActivewearImages(): Map<string, {
  url: string;
  styleId: string;
  colorCode: string;
}> {
  const products = await prisma.blankProduct.findMany({
    where: {
      supplier: { code: 'SSA' },
      isActive: true,
    },
    select: {
      styleNumber: true,
      primaryImageUrl: true,
      images: true,
      variants: {
        select: {
          colorCode: true,
          imageUrl: true,
        },
      },
    },
  });

  const imageMap = new Map<string, { url: string; styleId: string; colorCode: string }>();

  for (const product of products) {
    const styleId = product.styleNumber;

    // Add primary image
    if (product.primaryImageUrl) {
      const key = extractImageKey(product.primaryImageUrl) || product.primaryImageUrl;
      imageMap.set(key, {
        url: product.primaryImageUrl,
        styleId,
        colorCode: 'primary',
      });
    }

    // Add additional images
    for (const imageUrl of product.images || []) {
      const key = extractImageKey(imageUrl) || imageUrl;
      if (!imageMap.has(key)) {
        imageMap.set(key, {
          url: imageUrl,
          styleId,
          colorCode: 'additional',
        });
      }
    }

    // Add variant images
    for (const variant of product.variants) {
      if (variant.imageUrl) {
        const key = extractImageKey(variant.imageUrl) || variant.imageUrl;
        if (!imageMap.has(key)) {
          imageMap.set(key, {
            url: variant.imageUrl,
            styleId,
            colorCode: variant.colorCode || 'unknown',
          });
        }
      }
    }
  }

  return imageMap;
}

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('='.repeat(60));
  console.log('SS ACTIVEWEAR IMAGES TO CLOUDINARY');
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

  console.log(`\nCloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
  console.log(`Temp directory: ${TEMP_DOWNLOAD_DIR}`);
  console.log(`Cloudinary folder: ${CLOUDINARY_FOLDER}\n`);

  // Get all images from database
  console.log('Fetching images from database...');
  const images = await getAllSsActivewearImages();
  console.log(`Found ${images.size} unique images\n`);

  if (images.size === 0) {
    console.log('No images found. Make sure products are imported first.');
    process.exit(0);
  }

  // Build URL mapping
  const urlMapping = new Map<string, string>();
  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  console.log('Processing images...\n');

  let index = 0;
  for (const [key, { url, styleId, colorCode }] of Array.from(images.entries())) {
    index++;

    try {
      // Check if already uploaded to Cloudinary
      const publicId = urlToPublicId(url, styleId, colorCode);

      try {
        const existingResource = await cloudinary.api.resource(publicId);
        if (existingResource) {
          urlMapping.set(url, existingResource.secure_url);
          skippedCount++;
          console.log(`[${index}/${images.size}] SKIPPED (already exists): ${key}`);
          continue;
        }
      } catch {
        // Resource doesn't exist, proceed with upload
      }

      // Download to temp file
      const tempFile = path.join(TEMP_DOWNLOAD_DIR, `${key.replace(/[^a-zA-Z0-9._-]/g, '_')}.jpg`);

      console.log(`[${index}/${images.size}] Downloading: ${key}`);
      const downloaded = await downloadImage(url, tempFile);

      if (!downloaded) {
        console.log(`  ✗ Failed to download`);
        errorCount++;
        continue;
      }

      // Upload to Cloudinary
      console.log(`  Uploading to Cloudinary: ${publicId}`);
      const cloudUrl = await uploadToCloudinary(tempFile, publicId);

      // Clean up temp file
      if (fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }

      if (cloudUrl) {
        urlMapping.set(url, cloudUrl);
        successCount++;
        console.log(`  ✓ Uploaded: ${cloudUrl}`);
      } else {
        errorCount++;
        console.log(`  ✗ Upload failed`);
      }

    } catch (error: any) {
      errorCount++;
      console.error(`  ✗ Error: ${error.message}`);
    }

    // Rate limiting - be nice to the CDN
    await sleep(200);
  }

  // Clean up temp directory
  try {
    fs.rmSync(TEMP_DOWNLOAD_DIR, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total images:      ${images.size}`);
  console.log(`Uploaded:          ${successCount}`);
  console.log(`Skipped (exists):  ${skippedCount}`);
  console.log(`Errors:            ${errorCount}`);
  console.log(`Completed at:      ${new Date().toISOString()}`);

  // Now update database with new URLs
  if (urlMapping.size > 0) {
    console.log('\nUpdating database with Cloudinary URLs...');

    let updatedProducts = 0;
    const products = await prisma.blankProduct.findMany({
      where: {
        supplier: { code: 'SSA' },
        isActive: true,
      },
    });

    for (const product of products) {
      let needsUpdate = false;
      const updates: any = {};

      // Update primary image
      if (product.primaryImageUrl && urlMapping.has(product.primaryImageUrl)) {
        updates.primaryImageUrl = urlMapping.get(product.primaryImageUrl);
        needsUpdate = true;
      }

      // Update images array
      if (product.images && product.images.length > 0) {
        updates.images = product.images.map(img => urlMapping.get(img) || img);
        needsUpdate = true;
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
    let updatedVariants = 0;
    for (const product of products) {
      const variants = await prisma.blankProductVariant.findMany({
        where: { productId: product.id },
      });

      for (const variant of variants) {
        if (variant.imageUrl && urlMapping.has(variant.imageUrl)) {
          await prisma.blankProductVariant.update({
            where: { id: variant.id },
            data: {
              imageUrl: urlMapping.get(variant.imageUrl)!,
            },
          });
          updatedVariants++;
        }
      }
    }

    console.log(`  Products updated:  ${updatedProducts}`);
    console.log(`  Variants updated:  ${updatedVariants}`);
  }

  console.log('\nDone!');
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

/**
 * Download Sanmar Product Images
 *
 * Downloads all product images from Sanmar Canada and stores them locally.
 * Organizes images into folders by first two letters of filename.
 * Updates database records to point to local paths.
 *
 * Usage: npx tsx scripts/download-sanmar-images.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const prisma = new PrismaClient({ log: ['error', 'warn'] });

const IMAGES_BASE_DIR = path.join(process.cwd(), 'public', 'images', 'blanks', 'sanmar');
const LOCAL_PATH_PREFIX = '/images/blanks/sanmar';

// Ensure base directory exists
if (!fs.existsSync(IMAGES_BASE_DIR)) {
  fs.mkdirSync(IMAGES_BASE_DIR, { recursive: true });
}

// Extract filename from URL and determine subfolder
function getImagePath(url: string): { folder: string; filename: string } {
  const urlPath = new URL(url).pathname;
  // URL pattern: /catalog/product/a/t/atcf2100_form-front_athletic-grey_2024_cil.jpg
  const parts = urlPath.split('/');
  const filename = parts.pop() || 'unknown.jpg';

  // Use the two single-letter folders from URL (e.g., "a/t" becomes "at")
  // These are typically the first two letters of the product style
  let folder = 'misc';
  if (parts.length >= 2) {
    const letter1 = parts[parts.length - 2] || '';
    const letter2 = parts[parts.length - 1] || '';
    if (letter1.length === 1 && letter2.length === 1) {
      folder = `${letter1}${letter2}`.toLowerCase();
    }
  }

  return {
    folder,
    filename: filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  };
}

// Download a single image
function downloadImage(url: string, filepath: string): Promise<boolean> {
  return new Promise((resolve) => {
    // Skip if already exists
    if (fs.existsSync(filepath)) {
      resolve(true);
      return;
    }

    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const file = fs.createWriteStream(filepath);

    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
        fs.unlinkSync(filepath);
        resolve(false);
      }
    }).on('error', () => {
      file.close();
      if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      resolve(false);
    });
  });
}

// Sleep helper
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('='.repeat(60));
  console.log('SANMAR IMAGE DOWNLOAD');
  console.log('='.repeat(60));
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Images directory: ${IMAGES_BASE_DIR}\n`);

  try {
    // Step 1: Get all unique image URLs from products
    console.log('Step 1: Collecting unique image URLs...');

    const products = await prisma.blankProduct.findMany({
      where: {
        supplier: { code: 'SANMAR' },
        primaryImageUrl: { not: null }
      },
      select: {
        id: true,
        primaryImageUrl: true,
        images: true
      }
    });

    const variants = await prisma.blankProductVariant.findMany({
      where: {
        imageUrl: { not: null },
        product: { supplier: { code: 'SANMAR' } }
      },
      select: {
        id: true,
        imageUrl: true
      }
    });

    // Collect all unique URLs
    const urlSet = new Set<string>();

    for (const product of products) {
      if (product.primaryImageUrl) urlSet.add(product.primaryImageUrl);
      if (product.images && Array.isArray(product.images)) {
        for (const img of product.images as string[]) {
          if (img) urlSet.add(img);
        }
      }
    }

    for (const variant of variants) {
      if (variant.imageUrl) urlSet.add(variant.imageUrl);
    }

    const uniqueUrls = Array.from(urlSet).filter(url =>
      url.startsWith('https://media.sanmarcanada.com')
    );

    console.log(`  - Found ${uniqueUrls.length} unique Sanmar image URLs\n`);

    // Step 2: Download images
    console.log('Step 2: Downloading images (organized by folder)...');

    const urlToLocalPath = new Map<string, string>();
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;
    const folderCounts = new Map<string, number>();

    for (let i = 0; i < uniqueUrls.length; i++) {
      const url = uniqueUrls[i];
      const { folder, filename } = getImagePath(url);

      const folderPath = path.join(IMAGES_BASE_DIR, folder);
      const filepath = path.join(folderPath, filename);
      const localPath = `${LOCAL_PATH_PREFIX}/${folder}/${filename}`;

      // Track folder distribution
      folderCounts.set(folder, (folderCounts.get(folder) || 0) + 1);

      // Check if already downloaded
      if (fs.existsSync(filepath)) {
        urlToLocalPath.set(url, localPath);
        skipped++;
        if ((skipped + downloaded) % 200 === 0) {
          console.log(`  - Progress: ${skipped + downloaded}/${uniqueUrls.length} (${downloaded} new, ${skipped} existing)`);
        }
        continue;
      }

      const success = await downloadImage(url, filepath);

      if (success) {
        urlToLocalPath.set(url, localPath);
        downloaded++;
      } else {
        failed++;
      }

      // Progress update every 100 downloads
      if ((downloaded + skipped) % 100 === 0) {
        console.log(`  - Progress: ${downloaded + skipped}/${uniqueUrls.length} (${downloaded} new, ${skipped} existing, ${failed} failed)`);
      }

      // Small delay to avoid rate limiting
      if (downloaded % 20 === 0) await sleep(50);
    }

    console.log(`\n  - Downloaded: ${downloaded} new images`);
    console.log(`  - Skipped: ${skipped} existing images`);
    console.log(`  - Failed: ${failed} images`);
    console.log(`  - Folders created: ${folderCounts.size}\n`);

    // Show folder distribution
    console.log('  Folder distribution:');
    const sortedFolders = Array.from(folderCounts.entries()).sort((a, b) => b[1] - a[1]);
    for (const [folder, count] of sortedFolders.slice(0, 10)) {
      console.log(`    - ${folder}/: ${count} images`);
    }
    if (sortedFolders.length > 10) {
      console.log(`    - ... and ${sortedFolders.length - 10} more folders`);
    }

    // Step 3: Update database records
    console.log('\nStep 3: Updating database records...');

    // Update products
    let productUpdates = 0;
    for (const product of products) {
      const updates: { primaryImageUrl?: string; images?: string[] } = {};

      if (product.primaryImageUrl && urlToLocalPath.has(product.primaryImageUrl)) {
        updates.primaryImageUrl = urlToLocalPath.get(product.primaryImageUrl);
      }

      if (product.images && Array.isArray(product.images)) {
        const newImages = (product.images as string[]).map(img =>
          urlToLocalPath.get(img) || img
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
    let variantUpdates = 0;
    for (const variant of variants) {
      if (variant.imageUrl && urlToLocalPath.has(variant.imageUrl)) {
        await prisma.blankProductVariant.update({
          where: { id: variant.id },
          data: { imageUrl: urlToLocalPath.get(variant.imageUrl) }
        });
        variantUpdates++;
      }
    }
    console.log(`  - Updated ${variantUpdates} variants`);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('DOWNLOAD COMPLETE');
    console.log('='.repeat(60));
    console.log(`  - Total unique images: ${uniqueUrls.length}`);
    console.log(`  - Downloaded: ${downloaded}`);
    console.log(`  - Already existed: ${skipped}`);
    console.log(`  - Failed: ${failed}`);
    console.log(`  - Folders: ${folderCounts.size}`);
    console.log(`  - Products updated: ${productUpdates}`);
    console.log(`  - Variants updated: ${variantUpdates}`);
    console.log(`  - Completed at: ${new Date().toISOString()}`);

  } catch (error) {
    console.error('\nFATAL ERROR:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
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

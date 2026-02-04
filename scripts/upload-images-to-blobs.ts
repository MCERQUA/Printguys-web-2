/**
 * Upload Sanmar Images to Netlify Blobs
 *
 * Uploads all local product images to Netlify Blobs for persistent storage.
 * After upload, images are served via: /.netlify/blobs/images/{key}
 *
 * Prerequisites:
 * - NETLIFY_AUTH_TOKEN environment variable
 * - NETLIFY_SITE_ID environment variable
 *
 * Usage: npx tsx scripts/upload-images-to-blobs.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'blanks', 'sanmar');
const BLOB_STORE_NAME = 'product-images';

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

// Convert file path to blob key
function pathToKey(filePath: string): string {
  const relative = path.relative(IMAGES_DIR, filePath);
  return `sanmar/${relative}`.replace(/\\/g, '/');
}

async function main() {
  console.log('='.repeat(60));
  console.log('UPLOAD IMAGES TO NETLIFY BLOBS');
  console.log('='.repeat(60));

  // Check for required env vars
  const authToken = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.NETLIFY_SITE_ID;

  if (!authToken || !siteId) {
    console.error('\nMissing required environment variables:');
    console.error('  NETLIFY_AUTH_TOKEN - Your Netlify personal access token');
    console.error('  NETLIFY_SITE_ID - Your Netlify site ID');
    console.error('\nGet your token at: https://app.netlify.com/user/applications#personal-access-tokens');
    console.error('Find site ID in: Site settings > General > Site details > Site ID');
    process.exit(1);
  }

  console.log(`\nImages directory: ${IMAGES_DIR}`);
  console.log(`Blob store: ${BLOB_STORE_NAME}`);

  // Get all images
  console.log('\nScanning for images...');
  const images = getAllImages(IMAGES_DIR);
  console.log(`Found ${images.length} images\n`);

  if (images.length === 0) {
    console.log('No images found. Run download-sanmar-images.ts first.');
    process.exit(0);
  }

  // Upload images
  console.log('Uploading to Netlify Blobs...');
  let uploaded = 0;
  let failed = 0;

  for (const imagePath of images) {
    const key = pathToKey(imagePath);
    const content = fs.readFileSync(imagePath);
    const contentType = imagePath.endsWith('.png') ? 'image/png' : 'image/jpeg';

    try {
      const response = await fetch(
        `https://api.netlify.com/api/v1/blobs/${siteId}/${BLOB_STORE_NAME}/${encodeURIComponent(key)}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': contentType,
          },
          body: content,
        }
      );

      if (response.ok) {
        uploaded++;
      } else {
        failed++;
        console.error(`Failed to upload ${key}: ${response.status}`);
      }
    } catch (error) {
      failed++;
      console.error(`Error uploading ${key}:`, error);
    }

    if ((uploaded + failed) % 100 === 0) {
      console.log(`Progress: ${uploaded + failed}/${images.length} (${uploaded} uploaded, ${failed} failed)`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('UPLOAD COMPLETE');
  console.log('='.repeat(60));
  console.log(`  - Total images: ${images.length}`);
  console.log(`  - Uploaded: ${uploaded}`);
  console.log(`  - Failed: ${failed}`);
  console.log(`\nImages accessible at: /.netlify/blobs/${BLOB_STORE_NAME}/sanmar/{folder}/{filename}`);
}

main().catch(console.error);

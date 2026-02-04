import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const products = await prisma.blankProduct.findMany({
    where: { primaryImageUrl: { not: null } },
    select: { id: true, primaryImageUrl: true },
    take: 5
  });

  console.log('Sample image URLs from database:');
  for (const p of products) {
    console.log('  -', p.primaryImageUrl?.substring(0, 100));
  }

  // Check if any Cloudinary URLs exist
  const cloudinaryProducts = await prisma.blankProduct.count({
    where: { primaryImageUrl: { contains: 'cloudinary' } }
  });

  console.log(`\nProducts with Cloudinary URLs: ${cloudinaryProducts}`);

  await prisma.$disconnect();
}

main().catch(console.error);

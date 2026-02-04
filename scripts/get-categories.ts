import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.blankCategory.findMany({
    where: { supplier: { code: 'SANMAR' } },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          products: {
            where: { isActive: true }
          }
        }
      }
    },
    orderBy: { position: 'asc' }
  });

  console.log(JSON.stringify(categories, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import DesignStudio from '@/components/design-studio';
import type { ProductState } from '@/components/design-studio/types';

interface PageProps {
  params: Promise<{ shareId: string }>;
}

/**
 * Generate metadata for the shared design page.
 * Includes the design name and thumbnail for SEO and social sharing.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { shareId } = await params;

  const design = await prisma.design.findUnique({
    where: { shareId },
    select: { name: true, thumbnail: true },
  });

  if (!design) {
    return {
      title: 'Design Not Found | Printguys Design Studio',
    };
  }

  return {
    title: `${design.name} | Printguys Design Studio`,
    description: 'Check out this custom design on Printguys!',
    openGraph: {
      title: design.name,
      description: 'Check out this custom design on Printguys!',
      images: design.thumbnail ? [{ url: design.thumbnail }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: design.name,
      images: design.thumbnail ? [design.thumbnail] : [],
    },
  };
}

/**
 * Shared Design Page
 *
 * Displays a publicly shared design.
 * Anyone with the link can view and fork the design to make their own modifications.
 */
export default async function SharedDesignPage({ params }: PageProps) {
  const { shareId } = await params;

  // Validate shareId format
  if (!/^[0-9a-z]{8}$/.test(shareId)) {
    notFound();
  }

  // Find the design
  const design = await prisma.design.findUnique({
    where: { shareId },
    select: {
      id: true,
      shareId: true,
      name: true,
      canvasData: true,
    },
  });

  if (!design) {
    notFound();
  }

  // Parse canvasData to ProductState
  const initialState = design.canvasData as ProductState | null;

  // Pass the design state to the DesignStudio component
  return (
    <DesignStudio
      isLoggedIn={false}
      initialState={initialState || undefined}
      sharedDesignId={design.shareId}
      designName={design.name}
    />
  );
}

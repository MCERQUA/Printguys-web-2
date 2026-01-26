import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { DesignStudio } from '@/components/design-studio';

export const metadata: Metadata = {
  title: 'Design Studio | Printguys - Create Custom Apparel',
  description: 'Design your custom t-shirts, hoodies, and more with our easy-to-use design studio. Upload your artwork, position it perfectly, and get a quote instantly.',
  openGraph: {
    title: 'Design Studio | Printguys',
    description: 'Create custom printed apparel with our online design studio.',
    type: 'website',
  },
};

export default async function DesignStudioPage() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;

  return (
    <DesignStudio isLoggedIn={isLoggedIn} />
  );
}

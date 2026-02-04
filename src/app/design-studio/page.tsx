import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import dynamic from 'next/dynamic';

// Dynamically import DesignStudio for better performance
const DesignStudio = dynamic(
  () => import('@/components/design-studio').then(mod => ({ default: mod.DesignStudio })),
  {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading Design Studio...</p>
        </div>
      </div>
    ),
  }
);

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

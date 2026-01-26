import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { DesignStudio } from '@/components/design-studio';
import { Header } from '@/components/layout/Header';

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

  // Save design handler - will be passed to the client component
  // In production, this would save to the database via API

  return (
    <>
      <Header />
      <main className="min-h-screen bg-black">
        <DesignStudio
          isLoggedIn={isLoggedIn}
        />
      </main>
    </>
  );
}

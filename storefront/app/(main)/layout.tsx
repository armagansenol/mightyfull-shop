import type { Metadata } from 'next';

import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Mightyfull',
  description: 'This might be the best cookie ever!'
};

export default async function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-stretch justify-between overflow-hidden">
      {children}
      <Footer />
    </div>
  );
}

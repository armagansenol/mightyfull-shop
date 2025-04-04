import { Metadata } from 'next';
import { Poppins } from 'next/font/google';

import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Mightyfull',
  description: 'This might be the best cookie ever!'
};

const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins'
});

export default async function MainLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex min-h-screen flex-col items-stretch justify-between ${poppins.variable} overflow-hidden`}
    >
      {children}
      <Footer />
    </div>
  );
}

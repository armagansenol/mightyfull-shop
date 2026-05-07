import { Footer } from '@/components/footer';
import { AccountSidebar } from '@/components/account/account-sidebar';
import { Wrapper } from '@/components/wrapper';

export const metadata = {
  title: 'Account · Mightyfull'
};

export default function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Wrapper>
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-4 md:px-12 py-8 md:py-16 min-h-screen">
          <AccountSidebar />
          <section className="flex-1 min-w-0 flex flex-col gap-6 md:gap-8">
            {children}
          </section>
        </div>
      </Wrapper>
      <Footer />
    </>
  );
}

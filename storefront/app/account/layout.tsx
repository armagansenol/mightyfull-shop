import { AccountSidebar } from '@/components/account/account-sidebar';
import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
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
        <div className="px-4 md:px-20 py-8 md:py-14 min-h-screen">
          <Container className="flex flex-col md:flex-row gap-8 md:gap-12">
            <AccountSidebar />
            <section className="flex-1 min-w-0 flex flex-col gap-8 md:gap-10">
              {children}
            </section>
          </Container>
        </div>
      </Wrapper>
      <Footer />
    </>
  );
}

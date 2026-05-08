import { AccountSidebar } from '@/components/account/account-sidebar';
import { Container } from '@/components/container';
import { Footer } from '@/components/footer';
import { Wrapper } from '@/components/wrapper';

export const metadata = {
  title: 'Account · Mightyfull'
};

const ACCOUNT_THEME_INIT = `(function(){try{var t=localStorage.getItem('mf-account-theme');var r=document.getElementById('account-root');if(t==='dark'&&r){r.setAttribute('data-account-theme','dark');}}catch(e){}})();`;

export default function AccountLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Wrapper>
        <div
          id="account-root"
          data-account-theme="light"
          className="bg-sugar-milk text-blue-ruin min-h-screen px-4 md:px-20 py-8 md:py-14"
        >
          {/* Sync read of the persisted preference before paint to avoid flash. */}
          <script dangerouslySetInnerHTML={{ __html: ACCOUNT_THEME_INIT }} />
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

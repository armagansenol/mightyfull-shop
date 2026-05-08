import { PageHeader } from '@/components/account/page-header';
import { DialkitClient } from './dialkit-client';

// Public dev tool — no auth check so designers can iterate without
// having to log in. Skips indexing.
export const metadata = {
  title: 'Dialkit · Mightyfull',
  robots: { index: false, follow: false }
};

export default function DialkitPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tools"
        title="Dashboard dialkit"
        description="Tweak every dial that drives the account dashboard. Settings persist in localStorage; copy CSS / JSON when you find a look you like."
      />
      <DialkitClient />
    </>
  );
}

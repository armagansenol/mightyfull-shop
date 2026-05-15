import { Container } from '@/components/container';
import { ContactForm } from '@/components/contact-form';
import { Link } from '@/components/utility/link';
import { Wrapper } from '@/components/wrapper';

export default function Page() {
  return (
    <Wrapper>
      <Container
        as="section"
        className="grid grid-cols-24 gap-0 md:gap-8 py-16 md:py-24 px-4 md:px-16 space-y-12 md:space-y-0 mb-32 md:mb-48"
      >
        <div className="col-span-24 md:col-span-12 space-y-10">
          <div className="space-y-3">
            <h1 className="text-4xl font-black font-bomstad-display text-blue-ruin text-balance">
              Contact Us
            </h1>
            <p className="text-lg font-bold font-bomstad-display text-blue-ruin leading-snug text-balance">
              Drop us a line. We promise the only thing we bite is cookies.
            </p>
            <p className="text-base font-normal font-poppins max-w-md leading-relaxed text-blue-ruin text-pretty">
              Got a question, a flavor idea, or just want to say hi? We&apos;d
              love to hear it. We read every message. What&apos;s on your mind?
            </p>
          </div>
          <div className="grid grid-cols-12 gap-x-5 gap-y-6 font-poppins text-blue-ruin">
            <div className="col-span-6">
              <p className="font-semibold text-base">Email Address:</p>
              <Link href="mailto:info@mightyfull.com" className="text-sm">
                info@mightyfull.com
              </Link>
            </div>
            <div className="col-span-6">
              <p className="font-semibold text-base">Phone Number:</p>
              <Link href="tel:+27824567890" className="text-sm">
                +27 82 456 7890
              </Link>
            </div>
            <div className="col-span-6">
              <p className="font-semibold text-base">Address:</p>
              <p className="text-sm">123 Main St, Anytown, USA</p>
            </div>
          </div>
        </div>
        <div className="col-span-24 md:col-span-12 md:pt-14">
          <ContactForm />
        </div>
      </Container>
    </Wrapper>
  );
}

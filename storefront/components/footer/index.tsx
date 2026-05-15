'use client';

import { useState } from 'react';
import { Container } from '@/components/container';
import { IconArrow, IconCloud, socialIcons } from '@/components/icons';
import { Parallax } from '@/components/parallax';
import { Img } from '@/components/utility/img';
import { Link } from '@/components/utility/link';
import { useLayoutData } from '@/context/layout-data';
import { cn } from '@/lib/utils';
import c1 from '@/public/img/c1.png';
import c3 from '@/public/img/c3.png';
import c4 from '@/public/img/c4.png';
import c5 from '@/public/img/c5.png';
import type { SocialMedia } from '@/types';
import s from './footer.module.css';

type FormState = 'idle' | 'loading' | 'success' | 'error';

const QUICK_LINKS = [
  { href: '/shop', label: 'Shop' },
  { href: '/our-story', label: 'Our Story' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/account/subscriptions', label: 'Manage Subscription' }
] as const;

const RESOURCES = [
  { href: '/faq', label: 'FAQ' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' }
] as const;

export function Footer() {
  const { socialLinks } = useLayoutData();
  const currentYear = new Date().getFullYear();

  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [feedback, setFeedback] = useState('');

  const cookies = [
    {
      src: c1,
      rotation: 'rotate-[190deg]',
      className: s.cookie1,
      alt: 'Cookie Crumb 1'
    },
    {
      src: c3,
      rotation: '-rotate-6',
      className: s.cookie2,
      alt: 'Cookie Crumb 2'
    },
    {
      src: c3,
      rotation: '-rotate-90',
      className: s.cookie3,
      alt: 'Cookie Crumb 3'
    },
    {
      src: c4,
      rotation: '-rotate-6',
      className: s.cookie4,
      alt: 'Cookie Crumb 4'
    },
    {
      src: c5,
      rotation: 'rotate-6',
      className: s.cookie5,
      alt: 'Cookie Crumb 5'
    }
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = email.trim();

    if (!value) {
      setFormState('error');
      setFeedback('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setFormState('error');
      setFeedback('Please enter a valid email address.');
      return;
    }

    setFormState('loading');
    setFeedback('');

    try {
      const res = await fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: value })
      });
      const data = await res.json();

      if (!res.ok) {
        setFormState('error');
        setFeedback(data.message ?? 'Something went wrong. Please try again.');
        return;
      }

      setFormState('success');
      setFeedback(
        data.alreadySubscribed
          ? "You're already subscribed — thanks for staying mighty!"
          : 'Thanks! Check your inbox for a welcome from Mightyfull.'
      );
      setEmail('');
    } catch {
      setFormState('error');
      setFeedback('Something went wrong. Please try again.');
    }
  }

  return (
    <footer
      className={cn(s.footer, 'flex flex-col items-stretch justify-center')}
    >
      <div className={s.cloud}>
        <IconCloud fill="var(--blue-ruin)" />
      </div>
      <Container className="relative">
        <div className={s.columns}>
          <nav className={s.column} aria-label="Quick Links">
            <h6 className={s.columnTitle}>Quick Links</h6>
            {QUICK_LINKS.map((item) => (
              <Link key={item.href} href={item.href} className={s.columnLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={cn(s.column, s.center)}>
            <h2 className={s.heading}>
              Stay mighty. <br />
              Stay full.
            </h2>
            <span className={s.joinLabel}>Join our email list</span>
            <p className={s.cta}>
              Be the first to know about new products, brand updates, exclusive
              events, and more!
            </p>
            <form
              className={s.form}
              onSubmit={handleSubmit}
              noValidate
              aria-label="Email signup"
            >
              <div className={s.formRow}>
                <input
                  type="email"
                  className={s.input}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (formState !== 'idle') {
                      setFormState('idle');
                      setFeedback('');
                    }
                  }}
                  disabled={formState === 'loading'}
                  aria-label="Email address"
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  required
                />
                <button
                  type="submit"
                  className={s.submit}
                  disabled={formState === 'loading'}
                  aria-label="Subscribe to email list"
                >
                  <span>
                    <IconArrow fill="var(--sugar-milk)" />
                  </span>
                </button>
              </div>
              {feedback && (
                <p
                  className={cn(
                    s.feedback,
                    formState === 'error' && s.feedbackError
                  )}
                  role={formState === 'error' ? 'alert' : 'status'}
                >
                  {feedback}
                </p>
              )}
            </form>
          </div>

          <nav
            className={cn(s.column, s.columnRight)}
            aria-label="Resources"
          >
            <h6 className={s.columnTitle}>Resources</h6>
            {RESOURCES.map((item) => (
              <Link key={item.href} href={item.href} className={s.columnLink}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className={cn(
            s.copyright,
            'flex flex-col items-center md:flex-row md:items-center justify-between gap-10 md:gap-20'
          )}
        >
          <span className={s.c}>
            © {currentYear} Mightyfull, All Rights Reserved
          </span>
          <div className={cn(s.social, 'flex items-center space-x-4')}>
            {socialLinks.map((item, i) => {
              return (
                <Link
                  className="w-8 h-8 cursor-pointer"
                  href={item.url}
                  key={i}
                  aria-label={`Visit our ${item.platform} page`}
                >
                  {socialIcons[item.platform as SocialMedia]('var(--white)')}
                </Link>
              );
            })}
          </div>
          <span className={cn(s.signature, 'ml-0 md:ml-auto')}>
            Credited to{' '}
            <Link
              className={cn(s.link, 'underline')}
              href="https://justdesignfx.com"
            >
              JUST DESIGN FX
            </Link>
          </span>
        </div>
        {cookies.map((cookie, index) => (
          <div key={index} className={cn(s.cookie, cookie.className)}>
            <Parallax>
              <Img
                alt={cookie.alt}
                className={cn('object-contain', cookie.rotation)}
                src={cookie.src}
                loading="lazy"
              />
            </Parallax>
          </div>
        ))}
      </Container>
    </footer>
  );
}

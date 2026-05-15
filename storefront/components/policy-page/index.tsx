import {
  PortableText,
  type PortableTextComponents
} from '@portabletext/react';
import { notFound } from 'next/navigation';
import { Children, Fragment, type ReactNode } from 'react';

import { Container } from '@/components/container';
import { Wrapper } from '@/components/wrapper';
import type { Policy } from '@/types';

const EMAIL_REGEX = /[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;
const URL_REGEX = /\bhttps?:\/\/[^\s<>()]+[^\s<>().,!?:;'"]/g;

function linkifyString(text: string, keyPrefix: string): ReactNode {
  if (!text) return text;

  const tokens: { type: 'text' | 'email' | 'url'; value: string }[] = [];
  const matches: { start: number; end: number; type: 'email' | 'url'; value: string }[] = [];

  for (const match of text.matchAll(EMAIL_REGEX)) {
    matches.push({
      start: match.index ?? 0,
      end: (match.index ?? 0) + match[0].length,
      type: 'email',
      value: match[0]
    });
  }
  for (const match of text.matchAll(URL_REGEX)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (matches.some((m) => start < m.end && end > m.start)) continue;
    matches.push({ start, end, type: 'url', value: match[0] });
  }

  if (matches.length === 0) return text;

  matches.sort((a, b) => a.start - b.start);

  let cursor = 0;
  for (const m of matches) {
    if (m.start > cursor) {
      tokens.push({ type: 'text', value: text.slice(cursor, m.start) });
    }
    tokens.push({ type: m.type, value: m.value });
    cursor = m.end;
  }
  if (cursor < text.length) {
    tokens.push({ type: 'text', value: text.slice(cursor) });
  }

  return tokens.map((token, i) => {
    if (token.type === 'text') return token.value;
    const href = token.type === 'email' ? `mailto:${token.value}` : token.value;
    const external = token.type === 'url';
    return (
      <a
        key={`${keyPrefix}-${i}`}
        href={href}
        className="underline text-blue-ruin hover:opacity-70"
        {...(external
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {token.value}
      </a>
    );
  });
}

function linkify(children: ReactNode, keyPrefix = 'lk'): ReactNode {
  return Children.map(children, (child, i) => {
    if (typeof child === 'string') {
      return (
        <Fragment key={`${keyPrefix}-${i}`}>
          {linkifyString(child, `${keyPrefix}-${i}`)}
        </Fragment>
      );
    }
    if (typeof child === 'number' || typeof child === 'boolean' || child == null) {
      return child;
    }
    return child;
  });
}

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="font-bomstad-display text-3xl md:text-4xl font-black text-blue-ruin mt-12 mb-5 text-balance">
        {linkify(children, 'h1')}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-bomstad-display text-2xl md:text-3xl font-black text-blue-ruin mt-12 mb-4 text-balance">
        {linkify(children, 'h2')}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-bomstad-display text-xl md:text-2xl font-bold text-blue-ruin mt-10 mb-3 text-balance">
        {linkify(children, 'h3')}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-poppins text-lg md:text-xl font-semibold text-blue-ruin mt-8 mb-2 text-balance">
        {linkify(children, 'h4')}
      </h4>
    ),
    h5: ({ children }) => (
      <h5 className="font-poppins text-base md:text-lg font-semibold text-blue-ruin mt-6 mb-2 text-balance">
        {linkify(children, 'h5')}
      </h5>
    ),
    h6: ({ children }) => (
      <h6 className="font-poppins text-base font-semibold text-blue-ruin mt-6 mb-2 text-balance">
        {linkify(children, 'h6')}
      </h6>
    ),
    normal: ({ children }) => (
      <p className="font-poppins text-base text-blue-ruin leading-relaxed mb-4 text-pretty">
        {linkify(children, 'p')}
      </p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="font-poppins text-base text-blue-ruin border-l-2 border-blue-ruin pl-4 italic my-6">
        {linkify(children, 'bq')}
      </blockquote>
    )
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-2 mb-6 text-blue-ruin font-poppins">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-2 mb-6 text-blue-ruin font-poppins">
        {children}
      </ol>
    )
  },
  listItem: {
    bullet: ({ children }) => <li>{linkify(children, 'li')}</li>,
    number: ({ children }) => <li>{linkify(children, 'li')}</li>
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-blue-ruin">
        {linkify(children, 'strong')}
      </strong>
    ),
    em: ({ children }) => (
      <em className="italic text-blue-ruin">{linkify(children, 'em')}</em>
    ),
    annotationLinkExternal: ({ value, children }) => (
      <a
        href={value?.url}
        target={value?.newWindow ? '_blank' : undefined}
        rel={value?.newWindow ? 'noopener noreferrer' : undefined}
        className="underline text-blue-ruin hover:opacity-70"
      >
        {children}
      </a>
    ),
    annotationLinkEmail: ({ value, children }) => (
      <a
        href={`mailto:${value?.email}`}
        className="underline text-blue-ruin hover:opacity-70"
      >
        {children}
      </a>
    ),
    annotationLinkInternal: ({ value, children }) => (
      <a
        href={value?.slug ? `/${value.slug}` : '#'}
        className="underline text-blue-ruin hover:opacity-70"
      >
        {children}
      </a>
    )
  }
};

interface PolicyPageProps {
  policy: Policy | null;
}

export function PolicyPage({ policy }: PolicyPageProps) {
  if (!policy) notFound();

  const lastUpdatedLabel = policy.lastUpdated
    ? new Date(policy.lastUpdated).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : null;

  return (
    <Wrapper>
      <Container
        as="section"
        className="px-4 md:px-16 py-16 md:py-24 mb-32 md:mb-48"
      >
        <div className="max-w-3xl mx-auto">
          <h1 className="font-bomstad-display text-4xl md:text-5xl font-black text-blue-ruin mb-4 text-balance">
            {policy.title}
          </h1>
          {lastUpdatedLabel && (
            <p className="font-poppins text-sm text-blue-ruin/70 mb-12">
              Last updated {lastUpdatedLabel}
            </p>
          )}
          <article className="prose prose-blue-ruin max-w-none">
            <PortableText value={policy.body} components={components} />
          </article>
        </div>
      </Container>
    </Wrapper>
  );
}

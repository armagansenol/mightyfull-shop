import type {
  PortableTextBlock,
  PortableTextComponents,
  PortableTextMarkComponentProps
} from '@portabletext/react';

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

// Walk Portable Text blocks and rewrite plain (un-marked) spans so any
// embedded email address becomes its own span with a `link` annotation
// pointing at `mailto:<address>`. Spans that already carry marks are
// left untouched so editor-applied formatting (bold, custom links) wins.
export function linkifyEmails(
  blocks: PortableTextBlock[] | null | undefined
): PortableTextBlock[] {
  if (!blocks) return [];
  return blocks.map((block) => {
    if (block._type !== 'block' || !Array.isArray(block.children)) return block;

    const newChildren: PortableTextBlock['children'] = [];
    const newMarkDefs = [...(block.markDefs ?? [])];
    let counter = 0;
    let touched = false;

    for (const child of block.children) {
      if (
        child._type !== 'span' ||
        (Array.isArray(child.marks) && child.marks.length > 0) ||
        typeof child.text !== 'string'
      ) {
        newChildren.push(child);
        continue;
      }

      const text = child.text;
      const baseKey = child._key ?? `c${counter++}`;
      let lastIndex = 0;
      let match: RegExpExecArray | null;
      let madeChange = false;
      EMAIL_RE.lastIndex = 0;

      while ((match = EMAIL_RE.exec(text)) !== null) {
        madeChange = true;
        if (match.index > lastIndex) {
          newChildren.push({
            _type: 'span',
            _key: `${baseKey}-t${counter++}`,
            marks: [],
            text: text.slice(lastIndex, match.index)
          });
        }
        const linkKey = `${baseKey}-link${counter++}`;
        newMarkDefs.push({
          _key: linkKey,
          _type: 'link',
          href: `mailto:${match[0]}`
        });
        newChildren.push({
          _type: 'span',
          _key: `${baseKey}-e${counter++}`,
          marks: [linkKey],
          text: match[0]
        });
        lastIndex = match.index + match[0].length;
      }

      if (!madeChange) {
        newChildren.push(child);
        continue;
      }

      touched = true;
      if (lastIndex < text.length) {
        newChildren.push({
          _type: 'span',
          _key: `${baseKey}-t${counter++}`,
          marks: [],
          text: text.slice(lastIndex)
        });
      }
    }

    return touched
      ? { ...block, children: newChildren, markDefs: newMarkDefs }
      : block;
  });
}

// Renders the standard `link` annotation. Treats `mailto:` and same-origin
// hrefs as inline; everything else opens in a new tab with safe rel attrs.
export const faqPortableTextComponents: PortableTextComponents = {
  marks: {
    link: ({
      value,
      children
    }: PortableTextMarkComponentProps<{ _type: 'link'; href?: string }>) => {
      const href = value?.href ?? '#';
      const isMailto = href.startsWith('mailto:');
      const isInternal = href.startsWith('/') || href.startsWith('#');
      const externalProps =
        !isMailto && !isInternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {};
      return (
        <a
          href={href}
          className="underline text-blue-ruin hover:opacity-70"
          {...externalProps}
        >
          {children}
        </a>
      );
    }
  }
};

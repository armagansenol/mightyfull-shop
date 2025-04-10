import { cn } from '@/lib/utils';
import React from 'react';

import {
  PortableText,
  PortableTextBlock,
  PortableTextComponents
} from '@portabletext/react';

export interface CustomizedPortableTextProps {
  wrapperClassName?: React.HTMLAttributes<HTMLDivElement>['className'];
  content: PortableTextBlock[];
}

export default function CustomizedPortableText(
  props: CustomizedPortableTextProps
) {
  const components: PortableTextComponents = {
    marks: {
      em: ({ children }) => <span className="italic">{children}</span>,
      strong: ({ children }) => <span className="font-bold">{children}</span>
    }
  };

  return (
    <div className={cn(props.wrapperClassName)}>
      <PortableText value={props.content} components={components} />
    </div>
  );
}

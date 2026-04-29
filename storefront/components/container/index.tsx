import cn from 'clsx';

import s from './container.module.css';

type ContainerSize = 'sm' | 'md' | 'lg' | 'full' | 'bleed';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
  size?: ContainerSize;
}

export function Container({
  as: Tag = 'div',
  size = 'full',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag className={cn(s.container, s[size], className)} {...props}>
      {children}
    </Tag>
  );
}

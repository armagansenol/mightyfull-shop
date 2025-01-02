import s from './noticebar.module.scss';

import { cn } from '@/lib/utils';

import { Marquee } from '@/components/marquee';

export interface NoticebarProps {
  announcement: string;
}

export default function Noticebar(props: NoticebarProps) {
  return (
    <div className={cn(s.noticebar, 'bg-[var(--primary)]')}>
      <Marquee duration={10} repeat={20}>
        <div className="mx-10 text-[var(--secondary)]">
          {props.announcement}
        </div>
      </Marquee>
    </div>
  );
}

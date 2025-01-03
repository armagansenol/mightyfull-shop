import s from './noticebar.module.scss';

import { cn } from '@/lib/utils';

import { IconAsterisk } from '@/components/icons';
import { Marquee } from '@/components/marquee';

export interface NoticebarProps {
  announcement: string;
}

export default function Noticebar(props: NoticebarProps) {
  return (
    <div className={cn(s.noticebar, 'bg-[var(--secondary)] flex items-center')}>
      <Marquee duration={10} repeat={20}>
        <div className="flex items-center">
          <div className="mx-5 tablet:mx-10 text-[var(--primary)]">
            {props.announcement}
          </div>
          <div className={cn(s.iconC, 'flex')}>
            <IconAsterisk fill="var(--primary)" />
          </div>
        </div>
      </Marquee>
    </div>
  );
}

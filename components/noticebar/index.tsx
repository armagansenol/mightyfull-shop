import s from './noticebar.module.scss';

import cn from 'clsx';

import { IconAsterisk } from '@/components/icons';
import { Marquee } from '@/components/marquee';

export interface NoticebarProps {
  title: string;
}

export function Noticebar(props: NoticebarProps) {
  return (
    <div className={cn(s.noticebar, 'flex items-center')}>
      <Marquee duration={10} repeat={20}>
        <div className="flex items-center">
          <div className="mx-5 tablet:mx-10 text-[var(--primary)]">
            {props.title}
          </div>
          <div className={cn(s.iconC, 'flex')}>
            <IconAsterisk fill="var(--primary)" />
          </div>
        </div>
      </Marquee>
    </div>
  );
}

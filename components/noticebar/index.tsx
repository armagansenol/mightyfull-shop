import cn from 'clsx';
import { IconAsterisk } from '@/components/icons';
import { Marquee } from '@/components/marquee';
import s from './noticebar.module.css';

export interface NoticebarProps {
  title: string;
}

export function Noticebar(props: NoticebarProps) {
  return (
    <div className={cn(s.noticebar, 'flex items-center text-sm')}>
      <Marquee className="[--duration:10s]" repeat={20}>
        <div className="flex items-center">
          <div className="mx-5 md:mx-10 text-primary">
            {props.title}
          </div>
          <div className={cn(s.iconC, 'flex w-[6px] h-[6px]')}>
            <IconAsterisk fill="var(--primary)" />
          </div>
        </div>
      </Marquee>
    </div>
  );
}

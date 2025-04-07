import s from './feature-highlight.module.scss';

import cn from 'clsx';

import { FadeIn } from '@/components/fade-in';
import { IconProtein8 } from '@/components/icons';
import { Parallax } from '@/components/parallax';
import { Img } from '@/components/utility/img';

export function FeatureHighlight() {
  const items = [
    {
      title: 'Gluten-Free',
      description:
        'Baked for everyone—crafted to perfection, no gluten needed.',
      icon: '/img/gluten-free.png',
      colorTheme: {
        primary: '#0077E0',
        secondary: '#55B1F2',
        tertiary: '#98E1FF'
      }
    },
    {
      icon: '/img/dairy-free.png',
      colorTheme: {
        primary: '#9114D3',
        secondary: '#C277EC',
        tertiary: '#E9CEFF'
      },
      title: 'Dairy-Free',
      description: 'Skip the dairy, dodge the bloat—snack smarter, feel better.'
    },
    {
      title: 'Soy-Free',
      description: 'Soy-long! We’ve moved on to better, cleaner snacking.',
      icon: '/img/soy-free.png',
      colorTheme: {
        primary: '#D43584',
        secondary: '#E36CA6',
        tertiary: '#FFC7E0'
      }
    },
    {
      title: 'Whey-Free',
      description:
        'Whey out? More like way better! All the flavor, none of the hassle.',
      icon: '/img/whey-free.png',
      colorTheme: {
        primary: '#BC701E',
        secondary: '#D39E63',
        tertiary: '#F7DBB5'
      }
    }
  ];

  return (
    <section
      className={cn(
        s.featureHighlight,
        'flex flex-col items-center bg-sugar-milk'
      )}
    >
      <h2 className={s.heading}>What Makes Mightyfull Truly Mighty?</h2>
      <div className="flex flex-col items-center tablet:grid grid-cols-2 gap-14">
        {items.map((item, i) => {
          return (
            <div
              className={s.cardC}
              key={i}
              style={
                {
                  '--primary': item.colorTheme.primary,
                  '--secondary': item.colorTheme.secondary,
                  '--tertiary': item.colorTheme.tertiary
                } as React.CSSProperties
              }
            >
              <FadeIn>
                <div
                  className={cn(
                    s.card,
                    `flex flex-col items-start justify-start`
                  )}
                >
                  <p className={s.title}>{item.title}</p>
                  <p className={s.desc}>{item.description}</p>
                  <div className={s.iconC}>
                    <Img
                      src={item.icon}
                      height={200}
                      width={200}
                      alt="Feature Icon"
                    />
                  </div>
                </div>
              </FadeIn>
            </div>
          );
        })}
      </div>
      <div className={s.stickerC}>
        <Parallax speed={0.25}>
          <IconProtein8 />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie1)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain rotate-180"
            src={'/img/c1.png'}
            height={200}
            width={200}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie2)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-6"
            src={'/img/c2.png'}
            height={200}
            width={200}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie3)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-12"
            src={'/img/c3.png'}
            height={200}
            width={200}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie4)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain -rotate-12"
            src={'/img/c4.png'}
            height={200}
            width={200}
          />
        </Parallax>
      </div>
      <div className={cn(s.cookie, s.cookie5)}>
        <Parallax>
          <Img
            alt="Cookie Crumb"
            className="object-contain rotate-6"
            src={'/img/c5.png'}
            height={200}
            width={200}
          />
        </Parallax>
      </div>
      <div className={s.flyingCookie}>
        {/* <Img alt="Flying Cookie with a Cape" className="object-contain -rotate-12" src={flyingCookie} /> */}
        <video
          className="w-full h-full -rotate-12"
          autoPlay
          loop
          playsInline
          muted
          style={{ rotate: 'rotateZ(180deg)' }}
        >
          <source
            src="/video/mighty-bottom.mov"
            type="video/mp4; codecs=hvc1"
          />
          <source src="/video/mighty-bottom.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
}

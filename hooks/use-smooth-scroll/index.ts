import Lenis from 'lenis';
import { useLenisStore } from 'lib/store/lenis';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from 'usehooks-ts';

const useSmoothScroll = () => {
  // const [lenis, setLenis] = useState<Lenis | null>()
  const { lenis, setLenis, isStopped, reset, setReset } = useLenisStore();
  const reqIdRef = useRef<ReturnType<typeof requestAnimationFrame>>();

  const pathname = usePathname();

  useEffect(() => {
    // const url = `${pathname}`
    // console.log(`Route changed to: ${url}`)
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  useIsomorphicLayoutEffect(() => {
    const animate = (time: DOMHighResTimeStamp) => {
      lenis?.raf(time);
      // lenis?.on("scroll", () => {
      //   ScrollTrigger.update()
      // })
      reqIdRef.current = requestAnimationFrame(animate);
    };
    reqIdRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(reqIdRef.current as number);
  }, [lenis]);

  useIsomorphicLayoutEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });
    setLenis(lenis);

    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    return isStopped ? lenis?.stop() : lenis?.start();
  }, [isStopped]);

  useIsomorphicLayoutEffect(() => {
    if (reset) lenis?.scrollTo(0, { immediate: true });
    setReset(false);
  }, [reset]);
};

export default useSmoothScroll;

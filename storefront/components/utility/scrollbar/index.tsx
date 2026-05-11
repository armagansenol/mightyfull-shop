'use client';

import type Lenis from 'lenis';
import { useEffect, useRef, useState } from 'react';
import s from './scrollbar.module.css';

interface ScrollbarProps {
  lenis: Lenis | null;
}

export function Scrollbar({ lenis }: ScrollbarProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lenis) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    const THUMB_HEIGHT = 56;

    const update = () => {
      const limit = lenis.limit;
      const trackHeight = track.clientHeight;

      if (!limit || limit <= 0 || trackHeight <= 0) {
        setVisible(false);
        return;
      }

      const thumbHeight = Math.min(THUMB_HEIGHT, trackHeight);
      thumb.style.height = `${thumbHeight}px`;

      const progress = Math.max(0, Math.min(1, lenis.scroll / limit));
      const translateY = progress * (trackHeight - thumbHeight);
      thumb.style.transform = `translate3d(0, ${translateY}px, 0)`;

      setVisible(true);
    };

    update();

    const onScroll = () => update();
    lenis.on('scroll', onScroll);

    const wrapper = (lenis as unknown as { rootElement?: HTMLElement })
      .rootElement;
    const content =
      (wrapper?.firstElementChild as HTMLElement | null) ?? null;

    const onResize = () => {
      // Force Lenis to recalculate its limit when the content shrinks/grows
      // while the wrapper stays the same size (item add/remove inside a
      // flex-sized scroll area).
      lenis.resize();
      update();
    };

    const ro = new ResizeObserver(onResize);
    if (wrapper) ro.observe(wrapper);
    if (content) ro.observe(content);
    ro.observe(track);

    return () => {
      lenis.off('scroll', onScroll);
      ro.disconnect();
    };
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;

    let grabOffset: number | null = null;

    const onPointerMove = (e: PointerEvent) => {
      if (grabOffset === null) return;
      e.preventDefault();
      const rect = track.getBoundingClientRect();
      const thumbHeight = thumb.clientHeight;
      const range = rect.height - thumbHeight;
      if (range <= 0) return;
      const y = e.clientY - rect.top - grabOffset;
      const progress = Math.max(0, Math.min(1, y / range));
      lenis.scrollTo(progress * lenis.limit, { immediate: true });
    };

    const onPointerUp = () => {
      grabOffset = null;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };

    const onPointerDown = (e: PointerEvent) => {
      grabOffset = e.offsetY;
      window.addEventListener('pointermove', onPointerMove);
      window.addEventListener('pointerup', onPointerUp);
    };

    thumb.addEventListener('pointerdown', onPointerDown);
    return () => {
      thumb.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [lenis]);

  return (
    <div
      ref={trackRef}
      className={s.scrollbar}
      data-visible={visible || undefined}
      aria-hidden="true"
    >
      <div ref={thumbRef} className={s.thumb} />
    </div>
  );
}

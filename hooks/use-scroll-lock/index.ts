import { useEffect } from 'react';
import { useLenisStore } from '@/lib/store/lenis';

/**
 * Custom hook to lock/unlock scrolling when a modal or drawer is open
 * @param isOpen Whether the modal/drawer is open
 */
export function useScrollLock(isOpen: boolean) {
  const { lenis } = useLenisStore();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);
}

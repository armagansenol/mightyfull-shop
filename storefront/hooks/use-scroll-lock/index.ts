import { useLenis } from 'lenis/react';
import { useEffect } from 'react';

/**
 * Custom hook to lock/unlock scrolling when a modal or drawer is open
 * @param isOpen Whether the modal/drawer is open
 */
export function useScrollLock(isOpen: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (isOpen) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [isOpen, lenis]);
}

'use client';

import { Moon02Icon, Sun03Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const STORAGE_KEY = 'mf-account-theme';
const ROOT_ID = 'account-root';

type Theme = 'light' | 'dark';

function readPersistedTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  try {
    const t = window.localStorage.getItem(STORAGE_KEY);
    return t === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

export function AccountThemeToggle() {
  // Mirror the DOM attribute set by the synchronous init script in layout.tsx,
  // then sync to React state so the icon/label reflect actual theme.
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readPersistedTheme());
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* no-op: private mode etc. */
    }
    const root = document.getElementById(ROOT_ID);
    if (root) {
      root.setAttribute('data-account-theme', next);
    }
  };

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      // Render a stable label until mounted to avoid hydration mismatch
      // when the synchronous init script flipped the DOM before React.
      suppressHydrationWarning
      className={cn(
        'group inline-flex items-center justify-between gap-2.5 shrink-0 md:shrink',
        'h-11 md:h-10 px-4 md:px-3.5 rounded-xl whitespace-nowrap',
        'text-sm font-bold cursor-pointer transition-colors duration-200',
        'border border-blue-ruin/20 text-blue-ruin hover:bg-columbia-blue/30',
        'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-ruin/60 focus-visible:ring-offset-2 focus-visible:ring-offset-sugar-milk'
      )}
    >
      <span className="inline-flex items-center gap-2.5">
        <HugeiconsIcon
          icon={isDark ? Sun03Icon : Moon02Icon}
          size={18}
          strokeWidth={1.75}
          aria-hidden="true"
          className="shrink-0 text-blue-ruin/80"
        />
        <span>{mounted && isDark ? 'Light mode' : 'Dark mode'}</span>
      </span>
      <span
        aria-hidden="true"
        className={cn(
          'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full border border-blue-ruin/30',
          isDark ? 'bg-blue-ruin/80' : 'bg-cerulean/35'
        )}
      >
        <span
          className={cn(
            'inline-block h-3.5 w-3.5 rounded-full bg-sugar-milk transition-transform duration-200',
            isDark ? 'translate-x-[18px]' : 'translate-x-[2px]'
          )}
        />
      </span>
    </button>
  );
}

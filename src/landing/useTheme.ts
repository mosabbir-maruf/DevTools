import { useCallback, useState } from 'react';
import type { MouseEvent } from 'react';

const STORAGE_KEY = 'devtools-theme';

function isLightNow(): boolean {
  return document.documentElement.classList.contains('theme-light');
}

function applyTheme(light: boolean) {
  document.documentElement.classList.toggle('theme-light', light);
  try {
    localStorage.setItem(STORAGE_KEY, light ? 'light' : 'dark');
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Dark/light theme state for the website. The toggle animates the switch with a
 * circular reveal via the View Transitions API (with graceful fallback).
 */
export function useTheme() {
  const [isLight, setIsLight] = useState<boolean>(() =>
    typeof document !== 'undefined' ? isLightNow() : false
  );

  const toggle = useCallback((e?: MouseEvent) => {
    const next = !isLightNow();
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    const commit = () => {
      applyTheme(next);
      setIsLight(next);
    };

    // Fallback: no View Transitions support.
    if (!doc.startViewTransition || !e) {
      document.documentElement.classList.add('theme-anim');
      commit();
      window.setTimeout(() => document.documentElement.classList.remove('theme-anim'), 450);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = doc.startViewTransition(commit);
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, []);

  return { isLight, toggle };
}

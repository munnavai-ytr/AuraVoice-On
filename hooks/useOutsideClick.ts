'use client';

import * as React from 'react';

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  onClose: () => void,
  isActive = true
) {
  const ref = React.useRef<T | null>(null);

  React.useEffect(() => {
    if (!isActive) return;

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, isActive]);

  return ref;
}

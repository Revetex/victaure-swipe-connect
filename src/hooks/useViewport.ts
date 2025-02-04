import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

export function useViewport() {
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);
  
  const [debouncedSetViewportHeight] = useDebounce(
    (height: number) => setViewportHeight(height),
    100
  );

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover';
    document.getElementsByTagName('head')[0].appendChild(meta);

    const handleResize = () => {
      debouncedSetViewportHeight(window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [debouncedSetViewportHeight]);

  return viewportHeight;
}
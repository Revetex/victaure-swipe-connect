import { useState, useEffect } from 'react';

export function useViewportHeight() {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight;
      document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
      setHeight(vh);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return height;
}
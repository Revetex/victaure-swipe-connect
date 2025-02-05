export const getViewportHeight = () => {
  // Return the largest of these values for maximum compatibility
  return Math.max(
    document.documentElement.clientHeight,
    window.innerHeight || 0,
    // iOS viewport height
    document.documentElement.getBoundingClientRect().height
  );
};

export const isSafari = () => 
  /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export const supportsBackdropFilter = () => {
  if (typeof window === 'undefined') return false;
  return CSS.supports('backdrop-filter', 'blur(10px)') ||
         CSS.supports('-webkit-backdrop-filter', 'blur(10px)');
};
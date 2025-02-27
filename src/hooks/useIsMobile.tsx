
import { useMediaQuery } from "./use-media-query";

/**
 * Hook qui détermine si l'appareil est un mobile
 * @returns boolean indiquant si l'appareil est un mobile
 */
export function useIsMobile() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return isMobile;
}

import { useState, useEffect, useCallback } from "react";

export default function useOffSetTop(top: number) {
  const [offsetTop, setOffsetTop] = useState(false);

  const onScroll = useCallback(() => {
    if (window.scrollY > top) {
      setOffsetTop(true);
    } else {
      setOffsetTop(false);
    }
  }, [top]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]); // Add `onScroll` as a dependency

  return offsetTop;
}

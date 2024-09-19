import { useEffect } from "react";

export function useOutsideClick(ref: React.RefObject<HTMLElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Remove the event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

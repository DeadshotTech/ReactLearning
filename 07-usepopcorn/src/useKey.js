import { useEffect } from "react";
export function useKey(key, action) {
  useEffect(
    function () {
      function handleKey(event) {
        if (event.code.toLowerCase() === key.toLowerCase()) {
          action?.();
        }
      }
      window.addEventListener("keydown", handleKey);
      return function () {
        window.removeEventListener("keydown", handleKey);
      };
    },
    [key, action]
  );
}

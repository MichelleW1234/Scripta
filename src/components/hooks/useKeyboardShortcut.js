import { useEffect } from "react";

/**
 * useKeyboardShortcut
 * @param {string|string[]} keys - key(s) to listen for (case-insensitive)
 * @param {Function} callback - function to call when key is pressed
 * @param {string} [selector] - optional CSS selector for element(s) to style
 */

export default function useKeyboardShortcut(keys, callback, selector) {
  useEffect(() => {
    const keysArray = Array.isArray(keys) ? keys : [keys];
    const elements = selector ? document.querySelectorAll(selector) : null;

    const isTyping = (event) => {
      const tag = event.target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        event.target.isContentEditable
      );
    };

    const handleKeyDown = (event) => {
      if (isTyping(event)) return;
      if (keysArray.some(k => event.key.toLowerCase() === k.toLowerCase())) {
        if (elements) {
          elements.forEach(el => el.classList.add("active"));
        }
        if (callback) callback(event);
      }
    };

    const handleKeyUp = (event) => {
      if (isTyping(event)) return;
      if (keysArray.some(k => event.key.toLowerCase() === k.toLowerCase())) {
        if (elements) {
          elements.forEach(el => el.classList.remove("active"));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keys, callback, selector]);
}
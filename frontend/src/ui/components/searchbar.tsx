import { useEffect, useRef } from "react";
import { Input } from "../assets/input";
import Typed from "typed.js";

export default function Searchbar() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typedRef = useRef<Typed | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const focusedRef = useRef(false);

  const startTyping = () => {
    if (!inputRef.current || typedRef.current) return;

    typedRef.current = new Typed(inputRef.current, {
      strings: ["#Math", "#Learn", "#JS", "#Music"],
      typeSpeed: 90,
      backSpeed: 40,
      loop: true,
      attr: "placeholder",
      showCursor: false,
    });
  };

  const stopTyping = () => {
    if (typedRef.current) {
      typedRef.current.stop();
      typedRef.current.destroy();
      typedRef.current = null;
    }

    if (inputRef.current) {
      inputRef.current.placeholder = "search";
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleFocus = () => {
    focusedRef.current = true;

    timeoutRef.current = window.setTimeout(() => {
      if (focusedRef.current) startTyping();
    }, 120);
  };

  const handleBlur = () => {
    focusedRef.current = false;
    stopTyping();
  };

  useEffect(() => {
    return () => stopTyping();
  }, []);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="search"
      className="animate w-100 rounded-full"
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
}

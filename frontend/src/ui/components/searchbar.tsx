import { useContext, useEffect, useRef, useState, type FormEvent } from "react";
import { Input } from "../assets/input";
import Typed from "typed.js";
import { FilterContext } from "../../provider/filters_provider";

export default function Searchbar() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const typedRef = useRef<Typed | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const focusedRef = useRef(false);
  const filtersContext = useContext(FilterContext);

  if (!filtersContext) return;
  const startTyping = () => {
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
    if (!inputRef.current || typedRef.current) return;

    typedRef.current = new Typed(inputRef.current, {
      strings: ["Maths", "Learn", "Js", "Music"],
      typeSpeed: 90,
      backSpeed: 40,
      loop: true,
      attr: "placeholder",
      showCursor: false,
    });

    return () => {
      typedRef.current?.destroy();
      typedRef.current = null;
    };
  }, []);

  useEffect(() => {
    return () => stopTyping();
  }, []);

  const [inputText, setInputText] = useState("");

  const handleInput = (formEvent: FormEvent<HTMLInputElement>) => {
    const input = formEvent.target as HTMLInputElement;
    if (!input) return;
    setInputText(input.value);
  };

  useEffect(() => {
    if (inputText.length === 0 || !inputText.endsWith(" ") || !inputRef.current) return;
    inputRef.current.value = "";
    filtersContext.setFilters((prev) => ({
      ...prev,
      tags: [...(prev.tags ?? []), inputText.slice(0, inputText.length - 1)],
    }));
  }, [inputText]);
  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="search"
      className="animate w-100 rounded-full"
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
    />
  );
}

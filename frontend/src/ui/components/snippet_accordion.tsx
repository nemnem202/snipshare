import { useRef } from "react";
import type { PistonRequest } from "../../types/general/piston";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../assets/accordion";
import SnippetCode from "./snippet_code";
import SnippetConsole from "./snippet_console";

export default function SnippetAccordion({
  setClosed,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const run = async (content: string) => {
    const body: PistonRequest = {
      files: [
        {
          name: "test",
          content: content,
        },
      ],
      langage: "typescript",
      version: "5.0.3",
    };

    console.log("Body to send", body);
  };

  const smoothScrollTo = (targetY: number, duration = 300) => {
    const startY = window.scrollY;
    const diff = targetY - startY;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const time = timestamp - startTime;
      const progress = Math.min(time / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutQuad(progress));
      if (time < duration) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };
  const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

  const accordionRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (openItems: string[]) => {
    setClosed(openItems.length === 0);

    if (!accordionRef.current || openItems.length === 0) return;
    smoothScrollTo(
      accordionRef.current.getBoundingClientRect().top +
        accordionRef.current.getBoundingClientRect().height / 2 +
        window.scrollY -
        200
    );
  };

  return (
    <Accordion
      type="multiple"
      className="w-[500px]"
      onValueChange={handleValueChange}
      ref={accordionRef}
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Language</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <SnippetCode run={run} />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Console</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <SnippetConsole />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { PistonRequest, PistonResponse } from "../../types/general/piston";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../assets/accordion";
import SnippetCode from "./snippet_code";
import SnippetConsole from "./snippet_console";
import Fetcher from "../../lib/fetcher";
import { Custom } from "../../lib/logger";
import useGetSession from "../../hooks/get_session";
import LoginDialog from "./login_dialog";
import { boolean } from "zod";

export default function SnippetAccordion({
  setClosed,
}: {
  setClosed: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [runLoading, setRunLoading] = useState<boolean>(false);
  const [console, setConsole] = useState<PistonResponse>({
    language: "",
    run: {
      code: 0,
      output: "",
      signal: "",
      stderr: "",
      stdout: "",
    },
    version: "",
    compile: {
      code: 0,
      output: "",
      signal: "",
      stderr: "",
      stdout: "",
    },
  });
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const session = useGetSession();

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
  const [openItemsState, setOpenItems] = useState<string[]>([]);

  const handleValueChange = (openItems: string[]) => {
    Custom.log("open items", openItems);
    setClosed(openItems.length === 0);

    if (!accordionRef.current) return;

    if (openItemsState.length > openItems.length) return setOpenItems(openItems);

    setOpenItems(openItems);

    smoothScrollTo(
      accordionRef.current.getBoundingClientRect().top +
        accordionRef.current.getBoundingClientRect().height / 2 +
        window.scrollY -
        200
    );
  };

  const run = async (content: string) => {
    if (!session) {
      return setOpenLogin(true);
    }

    setRunLoading(true);
    const body = {
      content: content,
      language: "typescript",
      version: "5.0.3",
    };

    const res = await Fetcher.post<PistonResponse>(body, "/code");

    if ("version" in res) {
      Custom.log("response", res);
      setConsole(res);

      if (!openItemsState.includes("item-2")) {
        const openItems = [...openItemsState, "item-2"];

        handleValueChange(openItems);
      }
    }

    setRunLoading(false);
  };

  useEffect(() => {
    Custom.log("openitems", openItemsState);
  }, [openItemsState]);

  return (
    <>
      <Accordion
        type="multiple"
        className="w-full"
        onValueChange={handleValueChange}
        ref={accordionRef}
        value={openItemsState}
      >
        <AccordionItem value="item-1">
          <AccordionTrigger>Language</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <SnippetCode run={run} runLoading={runLoading} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Console</AccordionTrigger>
          <AccordionContent className="flex flex-col gap-4 text-balance">
            <SnippetConsole console={console} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <LoginDialog open={openLogin} setOpen={setOpenLogin} />
    </>
  );
}

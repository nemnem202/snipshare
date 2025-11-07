import { useContext, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { PistonRequest, PistonResponse } from "../../../types/general/piston";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../assets/accordion";
import Fetcher from "../../../lib/fetcher";
import { Custom } from "../../../lib/logger";
import useGetSession from "../../../hooks/get_session";
import LoginDialog from "../auth/login_dialog";
import { boolean } from "zod";
import SnippetFormCode from "./snipppet_form_code";
import { useSnippet } from "../snippet/snippet_container";
import SnippetConsole from "../snippet/snippet_console";
import { SnippetFormContext } from "./snippet_card_modal";
import { Button } from "../../assets/button";
import SnippetFormLangSelect from "./snippet_form__language_select";

export default function SnippetFormAccordion({
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
  const accordionRef = useRef<HTMLDivElement>(null);
  const [openItemsState, setOpenItems] = useState<string[]>([]);
  const snippetFormContext = useContext(SnippetFormContext);

  if (!snippetFormContext || !session) return;

  const { snippetForm, setSnippetForm } = snippetFormContext;

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

  const handleValueChange = (openItems: string[]) => {
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
    if (!snippetForm) return;

    setRunLoading(true);
    const body = {
      content: content,
      language: snippetForm.language.language,
      version: snippetForm.language.version,
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

  return (
    snippetForm && (
      <>
        <Accordion
          type="multiple"
          className="w-full"
          onValueChange={handleValueChange}
          ref={accordionRef}
          value={openItemsState}
        >
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div>{snippetForm.language.language}</div>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <SnippetFormCode run={run} runLoading={runLoading} />
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
    )
  );
}

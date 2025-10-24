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

  return (
    <Accordion
      type="multiple"
      className="w-[500px]"
      onValueChange={(openItems: string[]) => {
        setClosed(openItems.length === 0);
      }}
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

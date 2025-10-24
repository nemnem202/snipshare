import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../assets/accordion";
import SnippetCode from "./snippet_code";
import SnippetConsole from "./snippet_console";

export default function SnippetAccordion() {
  return (
    <Accordion type="multiple" className="w-[500px]">
      <AccordionItem value="item-1">
        <AccordionTrigger>Language</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          <SnippetCode />
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

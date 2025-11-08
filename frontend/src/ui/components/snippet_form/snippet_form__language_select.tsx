import { Popover, PopoverContent, PopoverTrigger } from "../../assets/popover";
import { Button } from "../../assets/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../assets/command";
import { cn } from "../../../lib/utils";
import { useContext, useEffect, useState } from "react";
import type { Langage } from "../../../types/general/language";
import { CodeLanguageContext } from "../../../provider/language_procider";
import { SnippetFormContext } from "./snippet_card_modal";

export default function SnippetFormLangSelect() {
  const languages = useContext(CodeLanguageContext);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Langage>(languages[0]);
  const snippetFormContext = useContext(SnippetFormContext);

  useEffect(() => {
    if (!snippetFormContext || !snippetFormContext.snippetForm) return;
    const { snippetForm, setSnippetForm } = snippetFormContext;
    setValue(snippetForm.language);
  }, []);

  useEffect(() => {
    if (!snippetFormContext || !snippetFormContext.snippetForm) return;
    const { snippetForm, setSnippetForm } = snippetFormContext;
    if (snippetForm.language === value) return;
    setSnippetForm((prev) => ({ ...prev, language: value }));
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value.language : "Language"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cherchez un language..." className="h-9" />
          <CommandList>
            <CommandEmpty>Aucun langage trouvé</CommandEmpty>
            <CommandGroup>
              {languages.map((l, index) => (
                <CommandItem
                  key={index}
                  value={l.language + l.version}
                  onSelect={() => {
                    setValue(l);
                    setOpen(false);
                  }}
                >
                  {l.language} <span className="text-muted">{l.version}</span>
                  <Check className={cn("ml-auto", value === l ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

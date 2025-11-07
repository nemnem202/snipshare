import { useContext, useEffect, useState } from "react";
import { Label } from "../assets/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "../assets/select";
import { FaCode } from "react-icons/fa";
import { CodeLanguageContext } from "../../provider/language_procider";
import { Popover, PopoverContent, PopoverTrigger } from "../assets/popover";
import { Button } from "../assets/button";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../assets/command";
import { cn } from "../../lib/utils";
import type { Langage } from "../../types/general/language";
import { FilterContext } from "../../provider/filters_provider";

export default function LanguageSelect() {
  const languages = useContext(CodeLanguageContext);
  const filtersContext = useContext(FilterContext);
  if (!filtersContext) return;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Langage | null>(null);

  useEffect(() => {
    filtersContext.setFilters((prev) => ({
      ...prev,
      language: value ? value.language : undefined,
    }));
  }, [value]);

  return (
    <div className="language-select">
      <Label htmlFor="language-select" className="flex gap-1 p-1">
        <FaCode />
        Langage
      </Label>
      <div id="language-select">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[300px] justify-between"
            >
              {value ? languages.find((l) => l === value)?.language : "Sélectionnez un language..."}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Cherchez un language..." className="h-9" />
              <CommandList>
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setValue(null);
                      setOpen(false);
                    }}
                  >
                    All
                  </CommandItem>
                  {languages.map((l, index) => (
                    <CommandItem
                      key={index}
                      value={l.language + l.version}
                      onSelect={() => {
                        setValue(l);
                        setOpen(false);
                      }}
                    >
                      {l.language}
                      <Check className={cn("ml-auto", value === l ? "opacity-100" : "opacity-0")} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

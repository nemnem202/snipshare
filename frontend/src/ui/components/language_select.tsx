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

export default function LanguageSelect() {
  const languages = [
    "Tous",
    "JavaScript",
    "TypeScript",
    "Python",
    "Rust",
    "Go",
    "Java",
    "C++",
    "C#",
    "Ruby",
    "PHP",
    "Swift",
    "Kotlin",
    "Scala",
    "Elixir",
    "Haskell",
  ];
  return (
    <div className="language-select">
      <Label htmlFor="language-select" className="flex gap-1 p-1">
        <FaCode />
        Langage
      </Label>
      <Select name="language-select" defaultValue="Tous">
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Selectionner le tri" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {languages.map((l) => (
              <SelectItem value={l}>{l}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

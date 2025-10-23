import { Label } from "../assets/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectValue,
} from "../assets/select";
import { FaSortAmountDown } from "react-icons/fa";

export default function SortingSelect() {
  return (
    <div className="sorting-select">
      <Label htmlFor="sorting-select" className="flex gap-1 p-1">
        <FaSortAmountDown />
        Trier par
      </Label>
      <Select name="sorting-select" defaultValue="latest">
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Selectionner le tri" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="latest">Plus récent</SelectItem>
            <SelectItem value="popularity">Popularité</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

import LanguageSelect from "./language_select";
import SortingSelect from "./sorting_select";

export default function SortSelectGroup() {
  return (
    <div className="flex gap-5 w-full">
      <SortingSelect />
      <LanguageSelect />
    </div>
  );
}

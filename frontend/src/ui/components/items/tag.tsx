import { Badge } from "../../assets/badge";
import { IoClose } from "react-icons/io5";
import { Button } from "../../assets/button";
import { useContext } from "react";
import { FilterContext } from "../../../provider/filters_provider";
import { Custom } from "../../../lib/logger";

export default function Tag({ content }: { content: string }) {
  const filtersContext = useContext(FilterContext);
  if (!filtersContext) return;

  const handleTagRemove = () => {
    filtersContext.setFilters((prev) => ({
      ...prev,
      tags: [...(prev.tags ? prev.tags.filter((t) => t !== content) : [])],
    }));
  };
  return (
    <Badge className="h-8 px-1.5 flex gap-2 bg-primary " variant="outline">
      {content}
      <Button
        onClick={() => handleTagRemove()}
        className="p-0 h-auto border-transparent bg-white/0 hover:bg-white/20 transition-colors duration-200 cursor-pointer rounded-full"
      >
        <IoClose size={16} />
      </Button>
    </Badge>
  );
}

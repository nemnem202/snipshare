import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/assets/pagination";
import SnippetContainer from "./snippet_container";

export default function SnippetPage() {
  return (
    <>
      <div className="flex flex-col items-center gap-5 w-full">
        {Array.from({ length: 6 }).map((_, id) => (
          <SnippetContainer />
        ))}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" size="default" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="default">
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive size="default">
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" size="default">
                3
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" size="default" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </>
  );
}

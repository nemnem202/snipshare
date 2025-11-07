import { useContext, useEffect, useState } from "react";
import SnippetContainer from "./snippet_container";
import { FilterContext } from "../../../provider/filters_provider";
import type { ExplorerSnippet } from "../../../types/general/explorersnippet";
import { Custom } from "../../../lib/logger";
import Fetcher from "../../../lib/fetcher";
import type { Filters } from "../../../types/general/explorerFilters";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../assets/pagination";
import { Spinner } from "../../assets/spinner";

export default function SnippetPage({ forPrivate }: { forPrivate: boolean }) {
  const filtersContext = useContext(FilterContext);
  if (!filtersContext) return;
  const [snippets, setSnippets] = useState<ExplorerSnippet[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [pageLoading, setPageLoading] = useState(true);

  const getBaseRoute = (priv: boolean): string => {
    if (priv) return "/dashboard/";
    return "/explorer/";
  };

  const getPages = async () => {
    Custom.log("get pages...", getBaseRoute(forPrivate) + "pages_number") +
      joinFilters(filtersContext.filters);
    const response = await Fetcher.get<{ number: number }>(
      getBaseRoute(forPrivate) + "pages_number" + joinFilters(filtersContext.filters)
    );
    if ("success" in response) return;
    const pagesNumber: number = response?.number ?? 0;
    Custom.log("Set pages ...", pagesNumber);
    setPages(pagesNumber);
  };

  useEffect(() => {
    Custom.log("Filters", "changed");
    getPages();
  }, [filtersContext.filters]);

  const joinFilters = (filtersToJoin: Filters): string => {
    if (
      !filtersToJoin ||
      (!filtersToJoin.language &&
        !filtersToJoin.tags &&
        !filtersToJoin.orderByPopularity &&
        !filtersToJoin.madeByUser)
    )
      return "";

    const params = new URLSearchParams();

    if (filtersToJoin.language) params.append("language", filtersToJoin.language);

    if (filtersToJoin.madeByUser === true && forPrivate)
      params.append("madeByUser", String(filtersToJoin.madeByUser));

    filtersToJoin.tags?.forEach((tag) => params.append("tags", tag));

    params.append("orderBy", filtersToJoin.orderByPopularity ? "popularity" : "date");

    return "?" + params.toString();
  };

  const getSnippets = async (page: number) => {
    Custom.log(
      "Get Snippets ...",
      getBaseRoute(forPrivate) + page + joinFilters(filtersContext.filters)
    );
    const snippets = await Fetcher.get<ExplorerSnippet[]>(
      getBaseRoute(forPrivate) + page + joinFilters(filtersContext.filters)
    );

    if ("success" in snippets) return;

    Custom.log("snippets !");
    setSnippets(snippets);
    setPageLoading(false);
  };

  useEffect(() => {
    setPageLoading(true);
    Custom.log("Filters", filtersContext.filters);
    getSnippets(currentPage);
  }, [pages, currentPage, filtersContext.filters]);

  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    const showEllipsisThreshold = 7;

    if (pages <= showEllipsisThreshold) {
      for (let i = 0; i < pages; i++) {
        items.push(i);
      }
    } else {
      items.push(0);

      let start = Math.max(1, currentPage - 1);
      let end = Math.min(pages - 2, currentPage + 1);

      if (currentPage < 3) {
        end = 3;
      }

      if (currentPage > pages - 4) {
        start = pages - 4;
      }

      if (start > 1) {
        items.push(-1);
      }

      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      if (end < pages - 2) {
        items.push(-2);
      }

      items.push(pages - 1);
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return pageLoading ? (
    <Spinner className="size-24" />
  ) : (
    <>
      <div className="flex flex-col items-center gap-5 w-full">
        {snippets.map((snipp, index) => (
          <SnippetContainer key={index} snipp={snipp} />
        ))}
        {pages >= 2 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 0) handlePageChange(currentPage - 1);
                  }}
                  className={currentPage === 0 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {getPaginationItems().map((pageNum, index) => {
                if (pageNum < 0) {
                  return (
                    <PaginationItem key={`ellipsis-${index}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      size="default"
                      isActive={currentPage === pageNum}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNum);
                      }}
                    >
                      {pageNum + 1}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  size="default"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < pages - 1) handlePageChange(currentPage + 1);
                  }}
                  className={currentPage === pages - 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </>
  );
}

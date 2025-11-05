import { useEffect, useState } from "react";
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
import type { Snippet } from "../../types/general/snippet";
import Fetcher from "../../lib/fetcher";
import { Custom } from "../../lib/logger";

export default function SnippetPage({ editables }: { editables: boolean }) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const getPages = async () => {
    const response = await Fetcher.get<{ number: number }>("/explorer/pages_number");
    if ("success" in response) return;
    const pages: number = response?.number ?? 0;
    Custom.log("Set pages ...", pages);
    setPages(pages);
  };

  useEffect(() => {
    getPages();
  }, []);

  const getSnippets = async (page: number) => {
    Custom.log("Get Snippets ...", "");
    const snippets = await Fetcher.get<Snippet[]>("/explorer/" + page);

    if ("success" in snippets) return;

    Custom.log("snippets", snippets);
    setSnippets(snippets);
  };

  useEffect(() => {
    getSnippets(currentPage);
  }, [pages, currentPage]);

  // Fonction pour générer les numéros de pages à afficher
  const getPaginationItems = () => {
    const items = [];
    const maxVisible = 5; // Nombre de pages visibles autour de la page courante
    const showEllipsisThreshold = 7; // Si moins de pages, on affiche tout

    if (pages <= showEllipsisThreshold) {
      // Si peu de pages, on affiche tout
      for (let i = 0; i < pages; i++) {
        items.push(i);
      }
    } else {
      // Toujours afficher la première page
      items.push(0);

      // Calculer la plage autour de la page courante
      let start = Math.max(1, currentPage - 1);
      let end = Math.min(pages - 2, currentPage + 1);

      // Ajuster si on est proche du début
      if (currentPage < 3) {
        end = 3;
      }

      // Ajuster si on est proche de la fin
      if (currentPage > pages - 4) {
        start = pages - 4;
      }

      // Ellipsis au début
      if (start > 1) {
        items.push(-1); // -1 représente une ellipsis
      }

      // Pages du milieu
      for (let i = start; i <= end; i++) {
        items.push(i);
      }

      // Ellipsis à la fin
      if (end < pages - 2) {
        items.push(-2); // -2 représente une autre ellipsis
      }

      // Toujours afficher la dernière page
      items.push(pages - 1);
    }

    return items;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-5 w-full">
        {snippets.map((snipp, index) => (
          <SnippetContainer editables={editables} key={index} snipp={snipp} />
        ))}
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
      </div>
    </>
  );
}

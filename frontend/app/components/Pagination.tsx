"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems?: number;
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
  buildHref?: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  buildHref,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Calculate visible range of items
  const startItem = totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems && itemsPerPage ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const delta = 1; // Number of pages to show around current page
    const range: (number | string)[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i);
      }
    }

    for (const i of range) {
      if (typeof i === "number") {
        if (l) {
          if (i - l === 2) {
            rangeWithDots.push(l + 1);
          } else if (i - l !== 1) {
            rangeWithDots.push("...");
          }
        }
        rangeWithDots.push(i);
        l = i;
      }
    }

    return rangeWithDots;
  };

  const pages = getPageNumbers();

  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderButton = (page: number, label: React.ReactNode, isActive: boolean, isDisabled: boolean = false) => {
    const baseClasses = `min-w-[36px] sm:min-w-[40px] h-9 sm:h-10 px-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center select-none ${
      isActive
        ? "bg-red-600 text-white shadow-lg shadow-red-600/30 border border-red-500 scale-105"
        : isDisabled
        ? "opacity-30 cursor-not-allowed border border-hairline bg-surface text-ink-subtle"
        : "border border-hairline bg-surface hover:bg-hover hover:border-red-500/50 text-ink-muted hover:text-ink active:scale-95 cursor-pointer shadow-2xs"
    }`;

    if (isDisabled) {
      return (
        <span aria-disabled="true" className={baseClasses}>
          {label}
        </span>
      );
    }

    if (buildHref) {
      return (
        <Link
          href={buildHref(page)}
          onClick={() => handlePageClick(page)}
          className={baseClasses}
          aria-current={isActive ? "page" : undefined}
          aria-label={`Go to page ${page}`}
        >
          {label}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => handlePageClick(page)}
        className={baseClasses}
        aria-current={isActive ? "page" : undefined}
        aria-label={`Go to page ${page}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className={`mt-10 sm:mt-14 pt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Item Range Counter */}
      <div className="text-xs font-bold text-ink-muted uppercase tracking-widest text-center sm:text-left">
        {totalItems && startItem && endItem ? (
          <span>
            Showing <span className="text-ink font-black">{startItem}–{endItem}</span> of <span className="text-ink font-black">{totalItems}</span> items
          </span>
        ) : (
          <span>
            Page <span className="text-ink font-black">{currentPage}</span> of <span className="text-ink font-black">{totalPages}</span>
          </span>
        )}
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center gap-1.5 sm:gap-2" aria-label="Pagination">
        {/* Previous Page Button */}
        {renderButton(
          currentPage - 1,
          <span className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Prev</span>
          </span>,
          false,
          currentPage <= 1
        )}

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {pages.map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-7 sm:w-8 h-9 sm:h-10 flex items-center justify-center text-ink-subtle text-xs font-bold"
                >
                  …
                </span>
              );
            }
            const pageNum = Number(p);
            return (
              <span key={`page-${pageNum}`}>
                {renderButton(pageNum, pageNum, pageNum === currentPage)}
              </span>
            );
          })}
        </div>

        {/* Next Page Button */}
        {renderButton(
          currentPage + 1,
          <span className="flex items-center gap-1">
            <span className="hidden md:inline text-[11px]">Next</span>
            <ChevronRight className="w-4 h-4" />
          </span>,
          false,
          currentPage >= totalPages
        )}
      </nav>
    </div>
  );
}

'use client'

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from 'lucide-react'

export interface PaginationProps {
  pageIndex: number
  totalCount: number
  perPage: number
  onPageChange: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
  pageIndex,
  perPage,
  totalCount,
  onPageChange,
}: PaginationProps) {
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between flex-col md:flex-row gap-1">
      <span className="text-muted-foreground text-xs md:text-sm text-center md:text-left">
        Total de {totalCount} publicações
      </span>

      <div className="flex items-center gap-3 md:gap-6 lg:gap-8 flex-col md:flex-row">
        <div className="text-xs md:text-sm text-center md:text-left">
          Página {pageIndex + 1} de {pages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
            className="flex size-7 items-center justify-center rounded bg-slate-500 p-0 text-white transition-all hover:bg-slate-600 disabled:bg-zinc-100 disabled:text-zinc-300"
          >
            <ChevronsLeftIcon className="size-4" />
            <span className="sr-only">Primeira página</span>
          </button>

          <button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
            className="flex size-7 items-center justify-center rounded bg-slate-500 p-0 text-white transition-all hover:bg-slate-600 disabled:bg-zinc-100 disabled:text-zinc-300"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </button>

          <button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pages <= pageIndex + 1}
            className="flex size-7 items-center justify-center rounded bg-slate-500 p-0 text-white transition-all hover:bg-slate-600 disabled:bg-zinc-100 disabled:text-zinc-300"
          >
            <ChevronRightIcon className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </button>

          <button
            onClick={() => onPageChange(pages - 1)}
            disabled={pages <= pageIndex + 1}
            className="flex size-7 items-center justify-center rounded bg-slate-500 p-0 text-white transition-all hover:bg-slate-600 disabled:bg-zinc-100 disabled:text-zinc-300"
          >
            <ChevronsRightIcon className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </button>
        </div>
      </div>
    </div>
  )
}

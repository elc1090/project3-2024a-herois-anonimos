'use client'

import { api } from '@/lib/api'
import { Author } from '@/utils/dto/author'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'
import { Pagination } from '@/components/pagination'

import { UserTableRow } from './user-table-row'

export function UsersList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [authors, setAuthors] = useState<Author[]>([])
  const [total, setTotal] = useState(10)
  const [isLoading, setIsLoading] = useState(true)

  const pageIndex = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1')

  function handlePaginate(pageIndex: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', (pageIndex + 1).toString())

    router.push(`${pathname}?${params}`)
  }

  const fetchAuthors = useCallback(async () => {
    setIsLoading(true)
    const { data } = await api(`/authors?page=${pageIndex + 1}`, {
      cache: 'no-store',
    })
    setAuthors(data.authors)
    setTotal(data.total)
    setIsLoading(false)
  }, [pageIndex])

  useEffect(() => {
    fetchAuthors()
  }, [fetchAuthors])

  return (
    <div className="flex flex-col w-full gap-4">
      <table className="w-full bg-white rounded-t shadow-sm">
        <thead className="w-full h-10 bg-slate-200">
          <tr className="w-full uppercase">
            <th className="p-4 text-left w-full">Nome do usuário</th>
            <th className="p-4 w-64">Permissão</th>
            <th className="p-4 w-20">Ações</th>
          </tr>
        </thead>

        <tbody className="w-full">
          {!isLoading &&
            authors.map((author) => (
              <UserTableRow key={author.id} author={author} />
            ))}

          {isLoading &&
            Array.from({ length: 3 }).map((_, idx) => (
              <tr key={idx} className="h-14">
                <td className="pl-4 p-2 w-full">
                  <div className="bg-slate-300 animate-pulse h-8 rounded w-full" />
                </td>
                <td className="p-2 w-80">
                  <div className="bg-slate-300 animate-pulse h-8 rounded w-full" />
                </td>
                <td className="pr-4 p-2 w-20">
                  <div className="bg-slate-300 animate-pulse h-8 rounded w-full" />
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {!isLoading && (
        <Pagination
          perPage={10}
          pageIndex={pageIndex}
          onPageChange={handlePaginate}
          totalCount={total}
        />
      )}
    </div>
  )
}

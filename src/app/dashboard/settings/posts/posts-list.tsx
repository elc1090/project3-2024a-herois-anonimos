'use client'

import { DeleteButton } from '@/components/delete-button'
import { EditButton } from '@/components/edit-button'
import { Pagination } from '@/components/pagination'
import { api } from '@/lib/api'
import { Post } from '@/utils/dto/post'
import dayjs from 'dayjs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { z } from 'zod'

export function PostsList() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const [posts, setPosts] = useState<Post[]>([])
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

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    const { data } = await api(`/posts?page=${pageIndex + 1}`, {
      cache: 'no-store',
    })
    setPosts(data.posts)
    setTotal(data.total)
    setIsLoading(false)
  }, [pageIndex])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <div className="flex flex-col gap-4">
      <table className="w-full bg-white rounded-t shadow-sm">
        <thead className="w-full h-10 bg-slate-200">
          <tr className="w-full uppercase">
            <th className="p-4 text-left w-full">Titulo</th>
            <th className="p-4 w-72">Publicado em</th>
            <th className="p-4 w-64">Autor(a)</th>
            <th className="p-4 w-20">Ações</th>
          </tr>
        </thead>

        <tbody className="w-full">
          {!isLoading &&
            posts.map((post) => (
              <tr key={post.id} className="border-b last:border-b-0">
                <td className="p-4 w-full">{post.title}</td>
                <td className="p-4 text-center">
                  {dayjs(post.createdAt).format('DD/MM/YYYY')}
                </td>
                <td className="p-4 truncate text-center">{post.author.name}</td>
                <td className="p-4 flex gap-2 items-center justify-between">
                  <EditButton post={post} />

                  <DeleteButton postId={post.id} />
                </td>
              </tr>
            ))}

          {isLoading &&
            Array.from({ length: 10 }).map((_, idx) => (
              <tr key={idx} className="h-14">
                <td className="pl-4 p-2 w-full">
                  <div className="bg-slate-300 animate-pulse h-8 rounded w-full" />
                </td>
                <td className="p-2 w-72">
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

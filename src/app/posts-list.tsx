'use client'
import type { Post } from '@/utils/dto/post'

import Image from 'next/image'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { Pagination } from '@/components/pagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { api } from '@/lib/api'

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
    <>
      <div className="flex flex-col gap-8 max-w-screen-md mx-auto items-center py-10 px-4">
        {!isLoading &&
          posts.map((post) => (
            <Link key={post.id} href={`/posts/${post.slug}`}>
              <article className="flex flex-col gap-2 max-w-screen-sm w-full">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-500">
                    {dayjs(post.createdAt)
                      .locale('pt-br')
                      .format('DD [de] MMMM [de] YYYY')}
                  </span>

                  <div className="h-2 w-px bg-slate-500" />

                  <span className="text-sm text-slate-500">
                    Por {post.author.name}
                  </span>
                </div>
                <h1 className="text-3xl font-bold -mt-2 leading-none line-clamp-2">
                  {post.title}
                </h1>
                <Image
                  src={post.images[0]?.url ?? ''}
                  width={700}
                  height={300}
                  quality={100}
                  alt=""
                  className="rounded-lg h-80 object-contain bg-slate-200"
                />

                <span className="line-clamp-3 text-justify">
                  {post.content}
                </span>
              </article>
            </Link>
          ))}

        {isLoading &&
          Array.from({ length: 3 }).map((_, idx) => (
            <div
              className="flex flex-col gap-2 max-w-screen-sm w-full"
              key={idx}
            >
              <div className="h-4 bg-slate-300 w-40 rounded-sm animate-pulse" />
              <div className="h-7 w-80 rounded-sm bg-slate-300 animate-pulse" />
              <div className="w-full h-80 bg-slate-300 rounded-sm animate-pulse" />

              <div className="flex flex-col gap-0.5">
                <div className="h-4 bg-slate-300 w-full rounded-sm animate-pulse" />
                <div className="h-4 bg-slate-300 w-full rounded-sm animate-pulse" />
                <div className="h-4 bg-slate-300 w-full rounded-sm animate-pulse" />
              </div>
            </div>
          ))}
      </div>

      <div className="w-full max-w-screen-sm mt-2 mb-10 mx-auto pt-4 border-t">
        <Pagination
          perPage={10}
          pageIndex={pageIndex}
          onPageChange={handlePaginate}
          totalCount={total}
        />
      </div>
    </>
  )
}

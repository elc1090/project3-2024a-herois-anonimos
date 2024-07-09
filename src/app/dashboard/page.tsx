import Link from 'next/link'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import type { Metadata } from 'next'
import { DeleteButton } from '@/components/delete-button'
import { EditButton } from '@/components/edit-button'
import type { Post } from '@/utils/dto/post'
import { LucideFilePlus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Minhas publicações',
}

async function fetchMyPosts(authorId: string): Promise<Post[]> {
  const response = await api(`/posts?authorId=${authorId}`, {
    cache: 'no-store',
  })

  if (!response.success) {
    return []
  }

  return response.data.posts
}

export default async function DashboardPage() {
  const token = cookies().get('@dev-web:token')!.value
  const { sub: userId }: { sub: string } = jwtDecode(token)

  const posts = await fetchMyPosts(userId)

  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-0">
      <div className="flex justify-between">
        <h1 className="font-bold text-slate-600 uppercase text-lg md:text-xl">
          Minhas publicações
        </h1>

        <Link
          href="/dashboard/post"
          className="border border-slate-700 text-slate-700 px-2 md:px-4 py-2 rounded hover:bg-slate-200"
        >
          <LucideFilePlus className="size-4 md:hidden" />
          <span className="hidden md:block">Criar uma publicação</span>
        </Link>
      </div>

      <div className="flex flex-col w-full gap-2">
        {posts.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-slate-300 px-4 py-2 h-20 rounded shadow flex justify-between items-center"
          >
            <div className="flex flex-col gap-1 w-full">
              <h1 className="text-base md:text-lg font-medium line-clamp-1 w-full">
                {item.title}
              </h1>
              <span className="text-xs md:text-sm text-slate-500">
                Publicado em{' '}
                {dayjs(item.createdAt).format('DD [de] MMMM [de] YYYY')}
              </span>
            </div>

            <div>
              <div className="flex gap-4">
                <EditButton post={item} />
                <DeleteButton postId={item.id} />
              </div>
            </div>
          </article>
        ))}

        {posts.length === 0 && (
          <div className="p-4 rounded bg-slate-200 border border-slate-500 shadow-sm">
            <h2 className="text-slate-700 font-medium text-lg">
              Comece a publicar histórias!
            </h2>
            <span className="text-slate-500">
              Nenhuma publicação foi adicionada. Relate a primeira história!
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

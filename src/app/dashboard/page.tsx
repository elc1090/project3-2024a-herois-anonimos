import Link from 'next/link'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Minhas publicações',
}

async function fetchMyPosts(authorId: string): Promise<
  {
    id: string
    title: string
    content: string
    slug: string
    createdAt: string
    updatedAt: string
  }[]
> {
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
    <div className="flex flex-col gap-4 w-full">
      <div className="flex justify-between">
        <h1 className="font-bold text-slate-600 uppercase text-xl">
          Minhas publicações
        </h1>

        <Link
          href="/dashboard/post"
          className="border border-slate-700 text-slate-700 px-4 py-2 rounded hover:bg-slate-200"
        >
          Criar nova publicação
        </Link>
      </div>

      <div className="flex flex-col w-full gap-2">
        {posts.map((item) => (
          <article
            key={item.id}
            className="bg-white border border-slate-300 px-4 py-2 h-20 rounded shadow flex justify-between items-center"
          >
            <div>
              <h1 className="text-lg font-medium">{item.title}</h1>
              <span className="text-sm text-slate-500">
                Publicado em{' '}
                {dayjs(item.createdAt).format('DD [de] MMMM [de] YYYY')}
              </span>
            </div>

            <div>
              <div className="flex gap-4">
                {/* <button className="flex gap-2 justify-center items-center bg-slate-300 px-4 py-2 rounded text-slate-900 hover:bg-slate-400/50">
                  <EditIcon className="size-4" />
                  Editar
                </button> */}
                {/* <button className="flex gap-2 justify-center items-center bg-red-700 px-4 py-2 rounded text-red-50 hover:bg-red-700/80">
                  <Trash2Icon className="size-4" />
                  Deletar
                </button> */}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

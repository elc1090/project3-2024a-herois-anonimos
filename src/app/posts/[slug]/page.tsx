import { api } from '@/lib/api'
import type { Post } from '@/utils/dto/post'
import { redirect } from 'next/navigation'

async function getPostBySlug(slug: string): Promise<Post> {
  const response = await api(`/posts?slug=${slug}`, {
    next: {
      revalidate: 60 * 2, // 2 minutes
    },
  })

  if (response.error) {
    redirect('404')
  }

  return response.posts[0]
}

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  return (
    <main className="w-full max-w-[800px] flex flex-col gap-4 mx-auto py-10">
      <h1 className="text-2xl leading-tight font-bold text-slate-900">
        {post.title}
      </h1>
      <p className="text-base text-slate-700">{post.content}</p>

      {post.questions.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <h2 className="font-semibold text-lg leading-none text-slate-900">
            {item.title}
          </h2>
          <span className="text-base text-slate-700">{item.answer}</span>
        </div>
      ))}
    </main>
  )
}

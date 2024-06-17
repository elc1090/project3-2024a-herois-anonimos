import { api } from '@/lib/api'
import { faker } from '@faker-js/faker'
import Image from 'next/image'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { Post } from '@/utils/dto/post'

async function fetchPosts(): Promise<Post[]> {
  const response = await api('/posts', {
    next: {
      revalidate: 60 * 2, // 2 minutes
    },
  })

  return response.data.posts ?? []
}

export default async function Home() {
  const posts = await fetchPosts()

  return (
    <div className="flex flex-col gap-8 max-w-screen-md mx-auto items-center py-10 px-4">
      {posts.map((post) => (
        <Link key={post.id} href={`/posts/${post.slug}`}>
          <article className="flex flex-col gap-2 max-w-screen-sm w-full">
            <span className="text-sm text-slate-500">
              {dayjs(post.createdAt).format('DD [de] MMMM [de] YYYY')}
            </span>
            <h1 className="text-3xl font-bold -mt-2">{post.title}</h1>
            <Image
              src={faker.image.urlPicsumPhotos()}
              width={700}
              height={300}
              quality={100}
              alt=""
              className="rounded-lg h-80 object-contain bg-slate-200"
            />

            <span className="line-clamp-3 text-justify">{post.content}</span>
          </article>
        </Link>
      ))}
    </div>
  )
}

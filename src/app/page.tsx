import { api } from '@/lib/api'

import type { Post } from '@/utils/dto/post'
import { PostsList } from './posts-list'

async function fetchPosts(): Promise<{ posts: Post[]; total: number }> {
  const response = await api(`/posts?page=1`, {
    cache: 'no-store',
  })

  return {
    total: response.data.total,
    posts: response.data.posts ?? [],
  }
}

export default async function Home() {
  const { posts, total } = await fetchPosts()

  return <PostsList initialPosts={posts} initialTotalPosts={total} />
}

import type { Metadata } from 'next'
import { PostData } from './post-data'

export const metadata: Metadata = {
  title: 'Nova publicação',
}

export default function PostPage() {
  return <PostData />
}

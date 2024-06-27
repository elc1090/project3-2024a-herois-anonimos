import type { Metadata } from 'next'
import { PostData } from './post-data'

export const metadata: Metadata = {
  title: 'Publicação',
}

export default function PostPage() {
  return <PostData />
}

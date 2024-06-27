import { Suspense } from 'react'
import { PostsList } from './posts-list'

export default async function Home() {
  return (
    <Suspense>
      <PostsList />
    </Suspense>
  )
}

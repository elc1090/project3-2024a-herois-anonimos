import { Suspense } from 'react'
import { PostsList } from './posts-list'

export default async function Home() {
  return (
    <div className="px-4 md:px-0">
      <Suspense>
        <PostsList />
      </Suspense>
    </div>
  )
}

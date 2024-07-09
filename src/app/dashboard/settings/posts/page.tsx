import { Metadata } from 'next'
import { PostsList } from './posts-list'

export const metadata: Metadata = {
  title: 'Gerenciar publicações',
}

export default function SettingsPostsPage() {
  return (
    <div className="flex flex-col w-full gap-10">
      <h1 className="font-bold text-slate-600 uppercase text-lg md:text-xl">
        Publicações postadas
      </h1>

      <PostsList />
    </div>
  )
}

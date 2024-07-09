import { Metadata } from 'next'
import { UsersList } from './users-list'
import { CreateAuthorButton } from './create-author-button'

export const metadata: Metadata = {
  title: 'Gerenciar usuários',
}

export default function SettingsUsersPage() {
  return (
    <div className="flex flex-col gap-10 w-full px-4 lg:px-0">
      <div className="flex justify-between gap-2">
        <h1 className="font-bold text-slate-600 uppercase text-lg md:text-xl">
          Gerenciar usuários
        </h1>

        <CreateAuthorButton />
      </div>

      <UsersList />
    </div>
  )
}

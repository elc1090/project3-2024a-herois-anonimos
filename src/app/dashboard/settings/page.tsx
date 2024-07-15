import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Configurações',
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10 w-full">
      <h1 className="font-bold text-slate-600 uppercase text-lg md:text-xl">
        Configurações
      </h1>

      <div className="w-full flex flex-col gap-3 items-center">
        <Link
          href="/dashboard/settings/users"
          className="px-4 py-2 flex items-center justify-center h-20 w-96 bg-white rounded shadow-sm hover:bg-slate-50 hover:border hover:border-slate-500"
        >
          <h2>Gerenciar usuários</h2>
        </Link>

        <Link
          href="/dashboard/settings/posts"
          className="px-4 py-2 flex items-center justify-center h-20 w-96 bg-white rounded shadow-sm hover:bg-slate-50 hover:border hover:border-slate-500"
        >
          <h2>Gerenciar publicações</h2>
        </Link>

        <Link
          href="/dashboard/settings/questions"
          className="px-4 py-2 flex items-center justify-center h-20 w-96 bg-white rounded shadow-sm hover:bg-slate-50 hover:border hover:border-slate-500"
        >
          <h2>Gerenciar perguntas</h2>
        </Link>
      </div>
    </div>
  )
}

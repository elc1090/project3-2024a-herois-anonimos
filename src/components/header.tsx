'use client'

import { useAuth } from '@/contexts/auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }

  return (
    <div className="flex items-center justify-center min-h-20 max-h-20 bg-slate-600 px-6">
      <div className="flex items-center w-full">
        <Link
          href="/"
          data-active={pathname === '/'}
          className="text-slate-300 data-[active=true]:text-slate-50 data-[active=true]:underline underline-offset-4"
        >
          Início
        </Link>
      </div>

      {user && (
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-slate-800 px-4 py-2 rounded text-slate-50 hover:bg-slate-800/70"
        >
          Sair
        </button>
      )}
    </div>
  )
}

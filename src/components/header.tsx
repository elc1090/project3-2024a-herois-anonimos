'use client'

import { useAuth } from '@/contexts/auth'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  function handleSignOut() {
    signOut()
  }

  function handleGoToHome() {
    router.push('/')
  }

  return (
    <div className="flex items-center justify-center min-h-20 max-h-20 bg-slate-600 px-20">
      <div className="flex items-center w-full gap-4">
        <button
          onClick={handleGoToHome}
          className="flex items-center gap-2 flex-nowrap"
        >
          <Image
            src={require('@/assets/icon-black.svg')}
            alt=""
            className="size-10 object-cover"
          />

          <span className="text-xl text-slate-50 font-medium text-nowrap select-none">
            Heróis Anônimos
          </span>
        </button>

        <Link
          href="/"
          data-active={pathname === '/'}
          className="text-slate-300 data-[active=true]:text-slate-50 data-[active=true]:underline underline-offset-4"
        >
          Início
        </Link>

        {user && (
          <Link
            href="/dashboard"
            data-active={pathname === '/dashboard'}
            className="text-slate-300 data-[active=true]:text-slate-50 data-[active=true]:underline underline-offset-4"
          >
            Minhas publicações
          </Link>
        )}
      </div>

      {user && (
        <div className="flex flex-col w-full max-w-40 bg-slate-700 h-10 -mr-1 pr-2 pl-2 justify-center rounded-l">
          <span className="inline-block text-slate-300 text-xs">
            Conectado com
          </span>
          <span className="inline-block text-slate-300 text-xs truncate">
            {user.name}
          </span>
        </div>
      )}

      {user ? (
        <button
          type="button"
          onClick={handleSignOut}
          className="bg-slate-800 px-4 py-2 rounded text-slate-50 hover:bg-slate-800/70"
        >
          Sair
        </button>
      ) : (
        <Link
          href="/auth/sign-in"
          className="bg-slate-800 px-4 py-2 rounded text-slate-50 hover:bg-slate-800/70 text-nowrap"
        >
          Acessar Conta
        </Link>
      )}
    </div>
  )
}

'use client'

import { useAuth } from '@/contexts/auth'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import * as Collapsible from '@radix-ui/react-collapsible'
import { MenuIcon } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function Header() {
  const headerRef = useRef<HTMLHeadElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [collapsibleIsOpen, setCollapsibleIsOpen] = useState(false)

  function handleToggleCollapsible() {
    setCollapsibleIsOpen((prev) => !prev)
  }

  function handleSignOut() {
    signOut()
  }

  function handleGoToHome() {
    router.push('/')
  }

  useEffect(() => {
    setCollapsibleIsOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setCollapsibleIsOpen(false)
      }
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && collapsibleIsOpen) {
        setCollapsibleIsOpen(false)
      }
    }

    document.addEventListener('click', handleOutsideClick)
    document.addEventListener('keydown', handleKeyPress)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
      document.removeEventListener('keydown', handleKeyPress)
    }
  }, [collapsibleIsOpen])

  return (
    <header
      ref={headerRef}
      className="flex items-center justify-center bg-slate-600 px-4 lg:px-20"
    >
      <Collapsible.Root
        open={collapsibleIsOpen}
        onChange={handleToggleCollapsible}
        className="flex flex-col justify-center lg:justify-start lg:items-center w-full lg:flex-row min-h-20 lg:max-h-20 lg:gap-6"
      >
        <div className="flex justify-between items-center h-20">
          <button
            onClick={handleGoToHome}
            className="flex gap-2 items-center w-56"
          >
            <Image
              src={require('@/assets/icon-black.svg')}
              alt=""
              width={100}
              height={100}
              onClick={handleGoToHome}
              className="size-10"
            />

            <span className="text-xl font-bold text-white text-left text-nowrap">
              Heróis Anônimos
            </span>
          </button>

          <Collapsible.Trigger
            onClick={handleToggleCollapsible}
            className="size-8 p-2 bg-slate-500 rounded-sm hover:bg-slate-500/80 lg:hidden"
          >
            <MenuIcon className="size-4 text-white" />
          </Collapsible.Trigger>
        </div>

        <Collapsible.Content
          forceMount
          className="flex flex-col gap-4 pb-6 data-[state=closed]:hidden lg:flex-row lg:pb-0 lg:data-[state=closed]:flex lg:items-center w-full"
        >
          <div className="flex flex-col gap-2 lg:gap-4 lg:flex-row ">
            <Link
              href="/"
              data-active={pathname === '/'}
              className="text-slate-300 data-[active=true]:text-slate-50 data-[active=true]:underline underline-offset-4 text-center lg:text-left"
            >
              Início
            </Link>

            <Link
              href="/dashboard"
              data-active={pathname === '/dashboard'}
              className="text-slate-300 data-[active=true]:text-slate-50 data-[active=true]:underline underline-offset-4 text-center lg:text-left"
            >
              Minhas publicações
            </Link>
          </div>

          <div className="flex justify-center lg:ml-auto">
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
        </Collapsible.Content>
      </Collapsible.Root>
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

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
    </div>
  )
}

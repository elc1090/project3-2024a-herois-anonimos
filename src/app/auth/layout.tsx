import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (isAuthenticated()) {
    redirect('/dashboard')
  }

  return (
    <div className="flex items-center justify-center size-full px-4">
      <div className="w-full max-w-xs bg-white shadow-sm rounded border border-zinc-200 p-4">
        {children}
      </div>
    </div>
  )
}

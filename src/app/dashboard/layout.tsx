import { isAuthenticated } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAuthenticated()) {
    redirect('/auth/sign-in')
  }

  return (
    <div className="flex mx-auto w-full max-w-screen-lg py-6">{children}</div>
  )
}

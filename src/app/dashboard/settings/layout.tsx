import { isAdmin } from '@/auth/auth'
import { redirect } from 'next/navigation'

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  if (!isAdmin()) {
    redirect('/dashboard')
  }

  return <>{children}</>
}

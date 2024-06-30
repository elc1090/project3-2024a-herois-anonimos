import '@/lib/dayjs'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from '@/contexts/auth'
import { ScrollToTop } from '@/components/scroll-to-top'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer />
      <ScrollToTop />
    </AuthProvider>
  )
}

'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { setCookie, parseCookies, destroyCookie } from 'nookies'

import { api } from '@/lib/api'
import { jwtDecode } from 'jwt-decode'

interface SignIn {
  email: string
  password: string
}

interface SignUp {
  name: string
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'USER'
}

interface AuthContextData {
  user: User | null
  signIn: (credentials: SignIn) => Promise<void>
  signUp: (credentials: SignUp) => Promise<void>
  signOut: () => void
}

export const AuthContext = createContext({} as AuthContextData)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  async function getLoggedUser() {
    const { '@dev-web:token': token } = parseCookies()
    const jwt = jwtDecode(token)

    const response = await api(`/authors/${jwt.sub}`)

    if (!response.success) {
      toast.error(response.message)
      return
    }

    setCookie(null, '@dev-web:user', JSON.stringify(response.data.author), {
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })
    setUser(response.data.author)
  }

  async function signIn({ email, password }: SignIn) {
    const response = await api('/sessions', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
    })

    if (!response.success) {
      toast.error(response.message)
      return
    }

    setCookie(null, '@dev-web:token', response.data.token, {
      maxAge: 60 * 60 * 8, // 8 hours
      path: '/',
    })

    await getLoggedUser()
    router.push('/dashboard')
  }

  async function signUp({ name, email, password }: SignUp) {
    const response = await api('/authors', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    })

    if (!response.success) {
      toast.error(response.message)
      return
    }

    toast.success('Cadastro concluído! Acesse sua conta e comece a publicar.')
    router.push('/auth/sign-in')
  }

  function signOut() {
    destroyCookie(null, '@dev-web:token')
    destroyCookie(null, '@dev-web:user')
    setUser(null)
    router.push('/auth/sign-in')
  }

  useEffect(() => {
    const { '@dev-web:user': cachedUser } = parseCookies()

    if (cachedUser) {
      const parsedUser: User = JSON.parse(cachedUser)
      setUser(parsedUser)
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  return context
}

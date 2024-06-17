'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth'

const signInForm = z.object({
  email: z.string().email({ message: 'Informe um e-mail válido.' }),
  password: z
    .string()
    .min(6, { message: 'A senha deve ter no mínimo 6 dígitos.' }),
})

type SignInFormData = z.infer<typeof signInForm>

export function SignInForm() {
  const { signIn } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInForm),
  })

  async function handleSignIn({ email, password }: SignInFormData) {
    await signIn({ email, password })
  }

  return (
    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
      <h1 className="text-slate-600 font-bold uppercase">Acessar conta</h1>

      <div className="flex flex-col space-y-1">
        <label htmlFor="email">E-mail</label>
        <input
          id="email"
          type="email"
          className="px-3 py-1 h-10 border rounded border-zinc-200"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col space-y-1">
        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          className="px-3 py-1 h-10 border rounded border-zinc-200"
          {...register('password')}
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="border px-4 flex justify-center items-center py-1.5 w-full bg-slate-600 h-10 text-slate-50 rounded hover:bg-slate-600/90 disabled:bg-slate-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Acessar'}
      </button>

      <div className="h-px bg-slate-200" />

      <Link
        href="/auth/sign-up"
        className="flex border items-center justify-center border-slate-600 px-4 py-1.5 h-10 w-full text-slate-600 rounded hover:bg-slate-600/10 disabled:bg-slate-400"
      >
        Criar uma conta
      </Link>
    </form>
  )
}

'use client'

import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/contexts/auth'

const signUpForm = z
  .object({
    name: z.string().min(1, { message: 'Informe o teu nome completo.' }),
    email: z.string().email({ message: 'Informe um e-mail válido.' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 dígitos.' }),
    passwordConfirmation: z.string().min(1, { message: 'Confirme a senha.' }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'A confirmação deve ser igual a senha.',
    path: ['passwordConfirmation'],
  })

type SignUpFormData = z.infer<typeof signUpForm>

export function SignUpForm() {
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpForm),
  })

  async function handleSignUp({ name, email, password }: SignUpFormData) {
    await signUp({ name, email, password })
  }

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
      <h1 className="text-slate-600 font-bold uppercase">
        Cadastrar uma conta
      </h1>

      <div className="flex flex-col space-y-1">
        <label htmlFor="name">Nome completo</label>
        <input
          id="name"
          type="text"
          className="px-3 py-1 h-10 border rounded border-zinc-200"
          {...register('name')}
        />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

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

      <div className="flex flex-col space-y-1">
        <label htmlFor="passwordConfirmation">Confirme a senha</label>
        <input
          id="passwordConfirmation"
          type="password"
          className="px-3 py-1 h-10 border rounded border-zinc-200"
          {...register('passwordConfirmation')}
        />
        {errors.passwordConfirmation && (
          <p className="text-xs text-red-500">
            {errors.passwordConfirmation.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="border px-4 flex justify-center items-center py-1.5 w-full bg-slate-600 h-10 text-slate-50 rounded hover:bg-slate-600/90 disabled:bg-slate-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Criar conta'
        )}
      </button>

      <div className="h-px bg-slate-200" />

      <Link
        href="/auth/sign-up"
        className="flex border items-center justify-center border-slate-600 px-4 py-1.5 h-10 w-full text-slate-600 rounded hover:bg-slate-600/10 disabled:bg-slate-400"
      >
        Já possui uma conta? Acesse.
      </Link>
    </form>
  )
}

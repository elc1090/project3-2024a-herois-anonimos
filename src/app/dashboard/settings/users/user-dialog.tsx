'use client'
import { api } from '@/lib/api'
import { Author } from '@/utils/dto/author'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import {
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronUpIcon,
  Loader2Icon,
  XIcon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const userDialogForm = z
  .object({
    name: z.string().min(1, { message: 'Informe o teu nome completo.' }),
    email: z.string().email({ message: 'Informe um e-mail válido.' }),
    role: z.union([z.literal('ADMIN'), z.literal('USER')]),
    password: z.string().optional(),
    passwordConfirmation: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password.length >= 6
      }
      return true // No password means no need for length validation
    },
    {
      message: 'A senha deve ter no mínimo 6 dígitos.',
      path: ['password'],
    },
  )
  .refine(
    (data) => {
      if (data.password) {
        return data.password === data.passwordConfirmation
      }
      return true // No password means no need for confirmation validation
    },
    {
      message: 'A confirmação deve ser igual a senha.',
      path: ['passwordConfirmation'],
    },
  )

type UserDialogFormData = z.infer<typeof userDialogForm>

interface UserDialogProps {
  authorId?: string
  onClose: () => void
}

export function UserDialog({ authorId, onClose }: UserDialogProps) {
  const router = useRouter()

  const [author, setAuthor] = useState<Author | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserDialogFormData>({
    resolver: zodResolver(userDialogForm),
    values: {
      name: author?.name ?? '',
      email: author?.email ?? '',
      role: author?.role ?? 'USER',
      password: undefined,
      passwordConfirmation: undefined,
    },
  })

  const getUser = useCallback(async () => {
    setIsLoading(true)
    const response = await api(`/authors/${authorId}`, {
      cache: 'no-store',
    })

    if (!response.success) {
      setIsLoading(false)
      return toast(response.message)
    }

    setAuthor(response.data.author)
    setIsLoading(false)
  }, [authorId])

  async function handleSignUpAuthor(data: UserDialogFormData) {
    const response = await api('/authors', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      }),
    })

    if (!response.success) {
      return toast(response.message)
    }

    toast('O(a) usuário(a) foi criado(a) e já pode começar a publicar!')
    router.refresh()
    onClose()
  }

  async function handleUpdateAuthor(data: UserDialogFormData) {
    const response = await api(`/authors/${authorId}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        password: data.password,
      }),
    })

    if (!response.success) {
      return toast(response.message)
    }

    toast(`O(a) usuário(a) "${author?.name}" foi atualizado!`)
    router.refresh()
    onClose()
  }

  async function handleFormSubmit(data: UserDialogFormData) {
    if (authorId) {
      await handleUpdateAuthor(data)
    } else {
      await handleSignUpAuthor(data)
    }
  }

  useEffect(() => {
    if (authorId) {
      getUser()
    }
  }, [authorId, getUser])

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-slate-600/50 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="flex flex-col gap-4 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6 shadow-sm focus:outline-none">
        <div>
          <Dialog.Title>
            {authorId ? 'Editar' : 'Adicionar'} usuário
          </Dialog.Title>
          <Dialog.Description>
            Insira as informações para{' '}
            {authorId ? 'editar a conta' : 'criar uma nova conta'}
          </Dialog.Description>
        </div>

        {isLoading && <Loader2Icon className="size-4 animate-spin mx-auto" />}

        {!isLoading && (
          <form className="space-y-2" onSubmit={handleSubmit(handleFormSubmit)}>
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
              <label htmlFor="email">E-mail</label>
              {/* <input
              id="email"
              type="email"
              className="px-3 py-1 h-10 border rounded border-zinc-200"
              {...register('email')}
            /> */}
              <Controller
                name="role"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Select.Root value={value} onValueChange={onChange}>
                    <Select.Trigger className="flex justify-between items-center gap-2 bg-white px-4 h-10 py-2 rounded w-full truncate border">
                      <Select.Value placeholder="Selecione uma pergunta" />
                      <Select.Icon asChild>
                        <ChevronDown className="w-6 size-4" />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="overflow-hidden mx-1.5 md:mx-0 bg-white rounded-md shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
                        <Select.ScrollUpButton className="flex items-center justify-center text-slate-800 h-[25px] bg-white cursor-default">
                          <ChevronUpIcon className="size-3 md:size-4" />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-2 bg-white md:h-10 flex flex-col gap-1">
                          <Select.Item
                            value="ADMIN"
                            className="text-[13px] leading-none rounded-[3px] flex items-center gap-2 justify-between md:h-[25px] px-2 py-1.5 md:py-0 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700"
                          >
                            <Select.ItemText>Administrador</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon className="size-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Select.Item
                            value="USER"
                            className="text-[13px] leading-none rounded-[3px] flex items-center gap-2 justify-between md:h-[25px] px-2 py-1.5 md:py-0 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700"
                          >
                            <Select.ItemText>Usuário/Autor</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon className="size-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-slate-800 cursor-default">
                          <ChevronDownIcon className="size-4" />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                )}
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
                <p className="text-xs text-red-500">
                  {errors.password.message}
                </p>
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
                <Loader2Icon className="size-4 animate-spin" />
              ) : (
                'Criar conta'
              )}
            </button>
          </form>
        )}

        <Dialog.Close asChild>
          <button
            className="text-slate-600 hover:text-slate-600/80 focus:shadow-slate-600 absolute top-4 right-4 inline-flex size-5 p-1 appearance-none items-center justify-center rounded-sm focus:shadow-sm focus:outline-none"
            aria-label="Close"
          >
            <XIcon className="size-4" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

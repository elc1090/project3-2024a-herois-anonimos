'use client'

import { api } from '@/lib/api'
import { categories } from '@/utils/categories'
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
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'

const questionDialogForm = z.object({
  category: z.string().min(1, { message: 'Informe a categoria.' }),
  question: z.string().min(1, { message: 'Informe a pergunta.' }),
})

type QuestionDialogFormData = z.infer<typeof questionDialogForm>

interface QuestionDialogProps {
  onClose: () => void
}

export function QuestionDialog({ onClose }: QuestionDialogProps) {
  const router = useRouter()

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuestionDialogFormData>({
    resolver: zodResolver(questionDialogForm),
  })

  async function handleCreateQuestion(data: QuestionDialogFormData) {
    const response = await api('/questions', {
      method: 'POST',
      body: JSON.stringify({
        category: data.category,
        title: data.question,
      }),
    })

    if (!response.success) {
      return toast(response.message)
    }

    toast('A pergunta foi criada e já pode ser utilizada pelos autores!')
    router.refresh()
    reset()
    onClose()
  }

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-slate-600/50 data-[state=open]:animate-overlayShow fixed inset-0" />
      <Dialog.Content className="flex flex-col gap-4 data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded bg-white p-6 shadow-sm focus:outline-none">
        <div>
          <Dialog.Title className="font-medium text-slate-700">
            Nova pergunta
          </Dialog.Title>
          <Dialog.Description className="text-sm text-slate-500">
            Cadastre uma nova pergunta para disponibilizar aos autores
          </Dialog.Description>
        </div>

        <form
          className="space-y-2"
          onSubmit={handleSubmit(handleCreateQuestion)}
        >
          <div className="flex flex-col space-y-1">
            <label htmlFor="name">Categoria</label>
            <Controller
              name="category"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select.Root value={value} onValueChange={onChange}>
                  <Select.Trigger className="flex justify-between items-center gap-2 bg-white px-4 h-10 py-2 rounded w-full truncate border">
                    <Select.Value placeholder="Selecione uma categoria" />
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
                        {categories.map((category) => (
                          <Select.Item
                            key={category}
                            value={category}
                            className="text-[13px] leading-none rounded-[3px] flex items-center gap-2 justify-between md:h-[25px] px-2 py-1.5 md:py-0 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700"
                          >
                            <Select.ItemText>{category}</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon className="size-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                      <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-slate-800 cursor-default">
                        <ChevronDownIcon className="size-4" />
                      </Select.ScrollDownButton>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              )}
            />
            {errors.category && (
              <p className="text-xs text-red-500">{errors.category.message}</p>
            )}
          </div>

          <div className="flex flex-col space-y-1">
            <label htmlFor="question">Pergunta</label>
            <textarea
              id="question"
              rows={3}
              className="px-3 py-1 border rounded border-zinc-200"
              {...register('question')}
            />
            {errors.question && (
              <p className="text-xs text-red-500">{errors.question.message}</p>
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
              'Adicionar pergunta'
            )}
          </button>
        </form>

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

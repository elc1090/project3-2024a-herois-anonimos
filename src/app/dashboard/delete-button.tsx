'use client'

import { useState, type ComponentProps } from 'react'
import { Loader2Icon, Trash2Icon } from 'lucide-react'
import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { api } from '@/lib/api'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps extends ComponentProps<'button'> {
  postId: string
}

export function DeleteButton({ postId, ...props }: DeleteButtonProps) {
  const router = useRouter()
  const [alertIsOpen, setAlertIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDeletePost() {
    setIsLoading(true)
    const response = await api(`/posts/${postId}`, {
      method: 'DELETE',
    })

    if (!response.success) {
      setIsLoading(false)
      return toast.error(response.message)
    }

    setIsLoading(false)
    toast.success('Publicação excluída!')
    router.refresh()
    setAlertIsOpen(false)
  }

  return (
    <AlertDialog.Root open={alertIsOpen}>
      <AlertDialog.Trigger
        {...props}
        onClick={() => setAlertIsOpen(true)}
        className="flex gap-2 justify-center items-center bg-red-500 px-4 py-2 rounded text-red-50 hover:bg-red-600"
      >
        <Trash2Icon className="size-4" />
        Excluir
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-slate-900/20 data-[state=open]:animate-overlayShow fixed inset-0">
          <AlertDialog.Content className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
            <AlertDialog.Title className="text-slate-700 m-0 text-[17px] font-medium">
              Deseja realmente excluir a publicação?
            </AlertDialog.Title>
            <AlertDialog.Description className="text-slate-500 mt-4 mb-5 text-[15px] leading-normal">
              Após excluir a ação não poderá ser desfeita.
            </AlertDialog.Description>

            <div className="flex justify-end gap-4">
              <AlertDialog.Cancel className="text-slate-500 bg-white hover:bg-slate-300 border border-slate-300 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                Cancelar
              </AlertDialog.Cancel>

              <AlertDialog.Action
                type="button"
                onClick={handleDeletePost}
                className="text-red-600 w-32 bg-red-200 hover:bg-red-300/80 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2Icon className="size-4 animate-spin" />
                ) : (
                  'Excluir'
                )}
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

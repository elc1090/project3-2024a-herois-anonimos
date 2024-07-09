'use client'

import { useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { PlusIcon } from 'lucide-react'
import { UserDialog } from './user-dialog'

export function CreateAuthorButton() {
  const [dialogIsVisible, setDialogIsVisible] = useState(false)
  const toggleDialogIsVisible = () => setDialogIsVisible((prev) => !prev)

  return (
    <Dialog.Root open={dialogIsVisible} onOpenChange={toggleDialogIsVisible}>
      <Dialog.Trigger asChild>
        <button className="flex gap-2 justify-center items-center bg-slate-100 px-2 md:px-4 py-2 rounded text-slate-900 hover:bg-slate-200 border border-slate-600">
          <PlusIcon className="size-4" />
          <span className="hidden md:block">Adicionar usuário</span>
        </button>
      </Dialog.Trigger>
      <UserDialog onClose={toggleDialogIsVisible} />
    </Dialog.Root>
  )
}

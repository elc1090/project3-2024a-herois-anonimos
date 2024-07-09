import { Author } from '@/utils/dto/author'
import * as Dialog from '@radix-ui/react-dialog'
import { PenBoxIcon } from 'lucide-react'
import { useState } from 'react'
import { UserDialog } from './user-dialog'
import { DeleteUserButton } from './delete-user-button'

interface UserTableRowProps {
  author: Author
}

export function UserTableRow({ author }: UserTableRowProps) {
  const [dialogIsVisible, setDialogIsVisible] = useState(false)
  const toggleDialogIsVisible = () => setDialogIsVisible((prev) => !prev)

  return (
    <tr className="border-b last:border-b-0">
      <td className="p-4 w-full">{author.name}</td>
      <td className="p-4 text-center">
        {author.role === 'ADMIN' ? 'Administrador(a)' : 'Autor(a)'}
      </td>
      <td className="p-4 flex gap-2 items-center justify-between">
        <Dialog.Root
          open={dialogIsVisible}
          onOpenChange={toggleDialogIsVisible}
        >
          <Dialog.Trigger asChild>
            <button className="flex gap-2 justify-center items-center bg-slate-100 px-2 md:px-4 py-2 rounded text-slate-900 hover:bg-slate-200">
              <PenBoxIcon className="size-4" />
              <span className="hidden md:block">Editar</span>
            </button>
          </Dialog.Trigger>
          <UserDialog authorId={author.id} onClose={toggleDialogIsVisible} />
        </Dialog.Root>

        <DeleteUserButton authorId={author.id} />
      </td>
    </tr>
  )
}

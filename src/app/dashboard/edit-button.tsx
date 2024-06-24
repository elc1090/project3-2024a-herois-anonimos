'use client'

import type { Post } from '@/utils/dto/post'
import { PenBoxIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface EditButtonProps {
  post: Post
}

export function EditButton({ post }: EditButtonProps) {
  const router = useRouter()

  function handleEdit() {
    router.push(`/dashboard/post?id=${post.id}`)
  }

  return (
    <button
      onClick={handleEdit}
      className="flex gap-2 justify-center items-center bg-slate-100 px-4 py-2 rounded text-slate-900 hover:bg-slate-200"
    >
      <PenBoxIcon className="size-4" />
      Editar
    </button>
  )
}

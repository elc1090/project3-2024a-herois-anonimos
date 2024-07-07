'use client'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'

import {
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronUp,
  ChevronUpIcon,
  Loader2,
  Trash2Icon,
  UploadCloudIcon,
  X,
} from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/auth'
import { toast } from 'react-toastify'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Select from '@radix-ui/react-select'
import { questionOptions } from '@/utils/questions'
import type { Post, Questions } from '@/utils/dto/post'
import Image from 'next/image'
import type { File as FileDTO } from '@/utils/dto/file'

export function PostData() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const { user } = useAuth()

  const [selected, setSelected] = useState('')

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [questions, setQuestions] = useState<Questions[]>([])
  const [images, setImages] = useState<FileDTO[]>([])

  const [fileSelected, setFileSelected] = useState<File[]>([])
  const [cover, setCover] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredOptions = questionOptions.map((item) => ({
    ...item,
    questions: item.questions.filter(
      (qo) => !questions.find((q) => q.title === qo),
    ),
  }))

  const previewUrl = useMemo(() => {
    if (cover) {
      return cover
    }

    if (fileSelected.length === 0) {
      return null
    }

    return URL.createObjectURL(fileSelected[0])
  }, [fileSelected, cover])

  const getPost = useCallback(async () => {
    if (!id) return
    setIsLoading(true)

    const response = await api(`/posts/${id}`, {
      cache: 'no-store',
    })

    if (!response.success) {
      setIsLoading(false)
      toast(response.message)
      return router.push('/dashboard/posts')
    }

    const post = response.data.post as Post

    setTitle(post.title)
    setContent(post.content)
    setQuestions(post.questions)
    setImages(post.images)
    setCover(post.images[0]?.url ?? null)
    setIsLoading(false)
  }, [id, router])

  function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files?.length) return

    const files = Array.from(event.target.files)
    setFileSelected(files)
  }

  function handleRemoveImage() {
    setFileSelected([])
    setCover(null)
  }

  function handleGoBack() {
    router.back()
  }

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
        id: null,
        title: selected,
        answer: '',
      },
    ])
    setSelected('')
  }

  function handleEditQuestion(position: number, field: string, value: string) {
    const attQuestions = questions.map((q, idx) => {
      if (idx === position) {
        return {
          ...q,
          [field]: value,
        }
      }

      return q
    })

    setQuestions(attQuestions)
  }

  function handleRemoveQuestion(position: number) {
    const attQuestions = questions.filter((_, idx) => idx !== position)

    setQuestions(attQuestions)
  }

  function handleChangeQuestionOrder(position: number, type: 'up' | 'down') {
    const newArray = [...questions]
    if (type === 'up' && position > 0) {
      ;[newArray[position], newArray[position - 1]] = [
        newArray[position - 1],
        newArray[position],
      ]
    } else if (type === 'down' && position < newArray.length - 1) {
      ;[newArray[position], newArray[position + 1]] = [
        newArray[position + 1],
        newArray[position],
      ]
    }
    setQuestions(newArray)
  }

  async function handleSubmit() {
    if (questions.length <= 0) {
      return toast.info('Uma pergunta deve ser adicionada!')
    }

    setIsSubmitting(true)

    const imagesAtt: FileDTO[] = []

    if (fileSelected.length > 0) {
      const formData = new FormData()
      formData.append('file', fileSelected[0])
      formData.append('directory', 'posts')

      const response = await api('/uploads', {
        method: 'POST',
        body: formData,
      })

      if (!response.success) {
        toast.error(response.message)
        return
      }

      imagesAtt.push(response.data.file)
    }

    if (id) {
      const response = await api(`/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title,
          content,
          questions,
          images: imagesAtt.length > 0 ? imagesAtt : images,
        }),
      })

      if (!response.success) {
        setIsSubmitting(false)
        return toast.error(response.message)
      }

      toast.success('Postagem atualizada!')
      setIsSubmitting(false)
    } else {
      const response = await api('/posts', {
        method: 'POST',
        body: JSON.stringify({
          title,
          content,
          questions,
          images: imagesAtt,
          authorId: user?.id,
        }),
      })

      if (!response.success) {
        setIsSubmitting(false)
        return toast.error(response.message)
      }

      toast.success('Postagem publicada!')
      router.push('/dashboard')
    }
  }

  useEffect(() => {
    if (id) {
      getPost()
    }
  }, [id, getPost])

  return (
    <div className="flex flex-col gap-4 w-full px-4 lg:px-0">
      <button
        onClick={handleGoBack}
        className="flex text-nowrap gap-2 rounded-md bg-slate-200 text-slate-900 items-center text-sm border w-min px-4 py-2 justify-center hover:bg-slate-300"
      >
        <ChevronLeftIcon className="size-4" />
        Voltar para lista de postagens
      </button>

      <h1 className="font-bold text-slate-600 uppercase text-xl">
        {id ? 'Editar' : 'Criar'} publicação
      </h1>

      {isLoading ? (
        <div className="flex gap-2 items-center">
          <Loader2 className="size-5 animate-spin" />
          <span className="text-slate-700">Carregando dados</span>
        </div>
      ) : (
        <>
          <div className="relative col-span-2 bg-white flex h-60 w-full md:w-96 rounded border p-4 shadow">
            {!previewUrl ? (
              <>
                <label
                  htmlFor="image"
                  className="flex w-full md:w-96 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-primary px-4 py-14 hover:bg-muted"
                >
                  <UploadCloudIcon />
                  Selecione imagem
                </label>

                <input
                  id="image"
                  type="file"
                  className="sr-only"
                  onChange={handleFilesSelected}
                />
              </>
            ) : (
              <>
                <Image
                  height={240}
                  width={560}
                  quality={100}
                  src={previewUrl}
                  alt=""
                  draggable={false}
                  className="h-full w-full md:w-96 rounded object-cover"
                />

                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute bottom-4 right-4 size-7 flex items-center justify-center rounded-br rounded-tl bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                  <Trash2Icon className="size-4" />
                </button>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col space-y-1">
              <label>Título</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-3 py-1 h-10 border w-full rounded border-zinc-200 shadow-sm"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label>Descrição</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={3}
                className="px-3 py-1 border rounded w-full border-zinc-200 shadow-sm"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-4">
            {questions.map((question, idx) => (
              <div key={question.title} className="space-y-1">
                <div className="flex gap-2 flex-col md:flex-row">
                  <div className="flex gap-1">
                    <button
                      className="size-6 flex items-center justify-center border border-slate-300 rounded enabled:hover:bg-slate-400 enabled:hover:text-white disabled:opacity-20"
                      onClick={() => handleChangeQuestionOrder(idx, 'down')}
                      disabled={idx === questions.length - 1}
                    >
                      <ChevronDown className="size-4" />
                    </button>
                    <button
                      className="size-6 flex items-center justify-center border border-slate-300 rounded enabled:hover:bg-slate-400 enabled:hover:text-white disabled:opacity-20"
                      onClick={() => handleChangeQuestionOrder(idx, 'up')}
                      disabled={idx === 0}
                    >
                      <ChevronUp className="size-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveQuestion(idx)}
                      className="size-6 flex items-center justify-center bg-red-400 text-white rounded hover:bg-red-600 hover:text-white transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  <h2>{question.title}</h2>
                </div>
                <textarea
                  rows={5}
                  value={questions[idx].answer}
                  onChange={(e) =>
                    handleEditQuestion(idx, 'answer', e.target.value)
                  }
                  className="px-3 py-2 border rounded w-full border-zinc-200 shadow-sm"
                />
              </div>
            ))}
          </div>

          <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
            <Select.Root value={selected} onValueChange={setSelected}>
              <Select.Trigger className="flex justify-between items-center gap-2 bg-white px-4 h-10 py-2 rounded w-full truncate">
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
                    {filteredOptions.map((category) => (
                      <Select.Group key={category.groupName}>
                        <Select.Label className="px-2 text-xs leading-[25px] text-slate-500 font-medium uppercase">
                          {category.groupName}
                        </Select.Label>

                        {category.questions.map((question) => (
                          <Select.Item
                            key={question}
                            value={question}
                            className="text-[13px] leading-none rounded-[3px] flex items-center gap-2 justify-between md:h-[25px] px-2 py-1.5 md:py-0 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700"
                          >
                            <Select.ItemText>{question}</Select.ItemText>
                            <Select.ItemIndicator>
                              <CheckIcon className="size-4" />
                            </Select.ItemIndicator>
                          </Select.Item>
                        ))}
                        {category.questions.length === 0 && (
                          <Select.Item
                            disabled
                            value="empty"
                            className="text-[13px] leading-none rounded-[3px] flex items-center justify-between h-[25px] px-2 relative select-none data-[disabled]:text-slate-300 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-slate-200 data-[highlighted]:text-slate-700"
                          >
                            <Select.ItemText>
                              Todas as perguntas da categoria já foram
                              selecionadas.
                            </Select.ItemText>
                          </Select.Item>
                        )}
                      </Select.Group>
                    ))}
                  </Select.Viewport>
                  <Select.ScrollDownButton className="flex items-center justify-center h-[25px] bg-white text-slate-800 cursor-default">
                    <ChevronDownIcon className="size-4" />
                  </Select.ScrollDownButton>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <button
              className="bg-slate-200 px-4 py-2 flex items-center justify-center rounded enabled:hover:bg-slate-300 disabled:opacity-30"
              onClick={handleAddQuestion}
              disabled={!selected.length}
            >
              Adicionar
            </button>
          </div>

          <button
            className="w-40 mt-4 h-10 px-4 py-2 flex items-center justify-center rounded text-white ml-auto bg-slate-700 enabled:hover:bg-slate-600"
            type="button"
            onClick={handleSubmit}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : id ? (
              'Atualizar'
            ) : (
              'Publicar'
            )}
          </button>
        </>
      )}
    </div>
  )
}

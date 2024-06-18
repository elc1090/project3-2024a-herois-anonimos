'use client'

import { useState } from 'react'

import { questionOptions } from '@/utils/question-options'
import { ChevronDown, ChevronUp, Loader2, X } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

interface Questions {
  title: string
  answer: string
}

export function PostData() {
  const router = useRouter()
  const { user } = useAuth()

  const [selected, setSelected] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Questions[]>([])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredOptions = questionOptions.filter(
    (item) => !questions.find((q) => q.title === item),
  )

  function handleAddQuestion() {
    setQuestions((prev) => [
      ...prev,
      {
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
    setIsSubmitting(true)
    const response = await api('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title,
        content: description,
        questions,
        authorId: user?.id,
      }),
    })

    if (!response.success) {
      setIsSubmitting(false)
      return toast.error(response.message)
    }

    toast.success('Postagem publicada!')
    router.push('/dashboard')
    setIsSubmitting(false)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h1 className="font-bold text-slate-600 uppercase text-xl">
        Criar publicação
      </h1>

      <div className="flex flex-col gap-4 w-full">
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="px-3 py-1 border rounded w-full border-zinc-200 shadow-sm"
          />
        </div>
      </div>

      <div>
        {questions.map((question, idx) => (
          <div key={question.title} className="space-y-1">
            <div className="flex gap-2">
              <div className="flex gap-1">
                <button
                  className="p-1 border border-slate-300 rounded enabled:hover:bg-slate-400 enabled:hover:text-white disabled:opacity-20"
                  onClick={() => handleChangeQuestionOrder(idx, 'down')}
                  disabled={idx === questions.length - 1}
                >
                  <ChevronDown className="size-4" />
                </button>
                <button
                  className="p-1 border border-slate-300 rounded enabled:hover:bg-slate-400 enabled:hover:text-white disabled:opacity-20"
                  onClick={() => handleChangeQuestionOrder(idx, 'up')}
                  disabled={idx === 0}
                >
                  <ChevronUp className="size-4" />
                </button>
              </div>
              <h2>{question.title}</h2>
              <button
                onClick={() => handleRemoveQuestion(idx)}
                className="bg-white p-1 rounded hover:bg-red-600 hover:text-white transition-all"
              >
                <X className="size-4" />
              </button>
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

      <div className="flex gap-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="h-10 px-4 py-2 rounded w-full"
        >
          <option value="" disabled>
            Selecione uma pergunta
          </option>
          {filteredOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <button
          className="bg-slate-200 px-4 py-2 flex items-center justify-center rounded enabled:hover:bg-slate-300 disabled:opacity-30"
          onClick={handleAddQuestion}
          disabled={!selected.length}
        >
          Adicionar
        </button>
      </div>

      <button
        className="w-40 h-10 px-4 py-2 flex items-center justify-center rounded text-white ml-auto bg-emerald-400 enabled:hover:bg-emerald-500"
        type="button"
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          'Publicar'
        )}
      </button>
    </div>
  )
}

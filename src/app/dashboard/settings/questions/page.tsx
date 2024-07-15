import { Metadata } from 'next'
import { AddQuestionButton } from './add-question-button'
import { Question, QuestionsGroupedByCategory } from '@/utils/dto/question'
import { DeleteQuestionButton } from './delete-question'
import { api } from '@/lib/api'
import { groupQuestionsByCategory } from '@/utils/group-questions-by-category'

export const metadata: Metadata = {
  title: 'Gerenciar perguntas',
}

async function fetchQuestions(): Promise<QuestionsGroupedByCategory[]> {
  const response = await api('/questions', {
    cache: 'no-cache',
  })

  if (!response.success) {
    return []
  }

  return groupQuestionsByCategory(response.data.questions as Question[])
}

export default async function SettingsQuestionsPage() {
  const questions = await fetchQuestions()

  return (
    <div className="flex flex-col gap-10 w-full px-4 lg:px-0">
      <div className="flex justify-between gap-2">
        <h1 className="font-bold text-slate-600 uppercase text-lg md:text-xl">
          Gerenciar perguntas
        </h1>

        <AddQuestionButton />
      </div>

      <table className="w-full bg-white rounded-t shadow-sm">
        <thead className="w-full h-10 bg-slate-200 border-b-2 border-white">
          <tr className="w-full uppercase">
            <th className="p-4 text-left w-full">Pergunta</th>
            <th className="p-4 w-20">Ação</th>
          </tr>
        </thead>

        <tbody className="w-full">
          {questions.map((question) => (
            <>
              <tr key={question.category} className="border-b">
                <td colSpan={2} className="p-4 font-medium bg-slate-200">
                  {question.category}
                </td>
              </tr>

              {question.questions.map((question) => (
                <tr key={question.id} className="border-b last:border-b-0">
                  <td className="p-4 w-full text-sm lg:text-base">
                    {question.title}
                  </td>
                  <td className="p-4 flex gap-2 items-center justify-center">
                    <DeleteQuestionButton questionId={question.id} />
                  </td>
                </tr>
              ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  )
}

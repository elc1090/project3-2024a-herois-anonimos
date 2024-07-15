import { Question, QuestionsGroupedByCategory } from './dto/question'

export function groupQuestionsByCategory(questions: Question[]) {
  const groupedQuestions = questions.reduce(
    (acc: QuestionsGroupedByCategory[], question: Question) => {
      const categoryIndex = acc.findIndex(
        (item) => item.category === question.category,
      )

      if (categoryIndex === -1) {
        return [
          ...acc,
          {
            category: question.category,
            questions: [question],
          },
        ]
      }

      acc[categoryIndex].questions.push(question)

      return acc
    },
    [] as QuestionsGroupedByCategory[],
  )

  return groupedQuestions
}

export interface Question {
  id: string
  category: string
  title: string
}

export interface QuestionsGroupedByCategory {
  category: string
  questions: {
    id: string
    title: string
  }[]
}

export interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  questions: Array<{
    id: string
    title: string
    answer: string
  }>
}

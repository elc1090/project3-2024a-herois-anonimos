export interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  author: {
    name: string
  }
  questions: Array<{
    id: string
    title: string
    answer: string
  }>
}

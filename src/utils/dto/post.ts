import type { File as FileDTO } from './file'

export interface Questions {
  title: string
  answer: string
}

export interface Post {
  id: string
  title: string
  content: string
  slug: string
  createdAt: string
  author: {
    name: string
  }
  questions: Questions[]
  images: FileDTO[]
}

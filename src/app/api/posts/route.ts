import { prisma } from '@/lib/prisma'
import { createSlugFromText } from '@/utils/slug'
import type { NextRequest } from 'next/server'
import { z } from 'zod'

const requestBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { title, content, authorId } = requestBodySchema.parse(body)

  const author = await prisma.author.findUnique({
    where: { id: authorId },
  })

  if (!author) {
    return Response.json(
      { message: `Autor(a) com id "${authorId}" não encontrado(a).` },
      { status: 404 },
    )
  }

  const postWithSameTitle = await prisma.post.findUnique({
    where: { title },
  })

  if (postWithSameTitle) {
    return Response.json(
      {
        message: 'Já existe uma postagem com o mesmo título.',
      },
      { status: 409 },
    )
  }

  const slug = createSlugFromText(title)

  const post = await prisma.post.create({
    data: {
      title,
      content,
      slug,
      authorId,
    },
  })

  return Response.json({ post }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const slug = searchParams.get('slug')

  const posts = await prisma.post.findMany({
    where: { slug: slug || undefined },
    include: {
      author: true,
      questions: true,
    },
  })

  return Response.json({
    posts: posts.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      slug: item.slug,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: {
        id: item.author.id,
        name: item.author.name,
        email: item.author.email,
      },
      questions: item.questions.map((q) => ({
        id: q.id,
        title: q.title,
        answer: q.answer,
      })),
    })),
  })
}

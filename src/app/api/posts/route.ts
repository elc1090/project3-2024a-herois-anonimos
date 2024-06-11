import { prisma } from '@/lib/prisma'
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

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId,
    },
  })

  return Response.json({ post }, { status: 201 })
}

export async function GET() {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  })

  return Response.json({
    posts: posts.map((item) => ({
      id: item.id,
      title: item.title,
      content: item.content,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: {
        id: item.author.id,
        name: item.author.name,
        email: item.author.email,
      },
    })),
  })
}

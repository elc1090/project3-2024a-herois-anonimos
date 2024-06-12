import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const postId = z.string().parse(params.id)

  const questions = await prisma.question.findMany({
    where: { postId },
  })

  return Response.json({
    questions,
  })
}

const requestBodySchema = z.object({
  title: z.string(),
  answer: z.string(),
})

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const postId = z.string().parse(params.id)

  const body = await request.json()
  const { title, answer } = requestBodySchema.parse(body)

  const post = await prisma.post.findUnique({
    where: { id: postId },
  })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
      { status: 404 },
    )
  }

  const question = await prisma.question.create({
    data: { title, answer, postId },
  })

  return Response.json({ question }, { status: 201 })
}

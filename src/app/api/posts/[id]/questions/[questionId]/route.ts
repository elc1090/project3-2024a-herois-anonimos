import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const requestBodySchema = z.object({
  title: z.string(),
  answer: z.string(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string; questionId: string } },
) {
  const id = z.string().parse(params.id)
  const questionId = z.string().parse(params.questionId)
  const body = await request.json()

  const { title, answer } = requestBodySchema.parse(body)

  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
      { status: 404 },
    )
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  })

  if (!question) {
    return Response.json(
      { message: 'Pergunta não encontrada.' },
      { status: 404 },
    )
  }

  const updated = await prisma.question.update({
    where: { id: questionId },
    data: { title, answer },
  })

  return Response.json({
    post: updated,
  })
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string; questionId: string } },
) {
  const id = z.string().parse(params.id)
  const questionId = z.string().parse(params.questionId)

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
      { status: 404 },
    )
  }

  const question = await prisma.question.findUnique({
    where: { id: questionId },
  })

  if (!question) {
    return Response.json(
      { message: 'Pergunta não encontrada.' },
      { status: 404 },
    )
  }

  await prisma.question.delete({
    where: { id: questionId },
  })

  return new Response(null, { status: 204 })
}

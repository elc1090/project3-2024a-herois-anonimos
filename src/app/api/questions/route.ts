import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const requestBodySchema = z.object({
  category: z.string(),
  title: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { category, title } = requestBodySchema.parse(body)

  const questionWithSameTitle = await prisma.questions.findUnique({
    where: { title },
  })

  if (questionWithSameTitle) {
    return Response.json(
      { message: 'Já existe uma pergunta com o mesmo título' },
      { status: 409 },
    )
  }

  const question = await prisma.questions.create({
    data: { category, title },
  })

  return Response.json({ question }, { status: 201 })
}

export async function GET() {
  const questions = await prisma.questions.findMany()

  return Response.json({ questions })
}

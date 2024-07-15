import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)

  const question = await prisma.questions.findUnique({
    where: { id },
  })

  if (!question) {
    return Response.json(
      { message: 'Pergunta não encontrada.' },
      { status: 404 },
    )
  }

  await prisma.questions.delete({
    where: { id },
  })

  return new Response(null, { status: 204 })
}

import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { z } from 'zod'

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, password } = requestBodySchema.parse(body)
  const authorExists = await prisma.author.findUnique({
    where: {
      email,
    },
  })

  if (authorExists) {
    return Response.json(
      { message: `O e-mail "${email}" já está em uso.` },
      { status: 409 },
    )
  }

  const passwordHash = await hash(password, 8)

  const author = await prisma.author.create({
    data: {
      name,
      email,
      password: passwordHash,
    },
  })

  return Response.json(
    { author: { ...author, password: undefined } },
    { status: 201 },
  )
}

export async function GET() {
  const authors = await prisma.author.findMany()

  const authorsWithoutPassword = authors.map((author) => ({
    ...author,
    password: undefined,
  }))

  return Response.json({ authors: authorsWithoutPassword })
}

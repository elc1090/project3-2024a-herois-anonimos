import { prisma } from '@/lib/prisma'
import { hash } from 'bcrypt'
import { NextRequest } from 'next/server'
import { z } from 'zod'

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string().min(6),
  role: z.union([z.literal('ADMIN'), z.literal('USER')]).nullish(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const { name, email, password, role } = requestBodySchema.parse(body)
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
      role: role ?? 'USER',
    },
  })

  return Response.json(
    { author: { ...author, password: undefined } },
    { status: 201 },
  )
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = searchParams.get('page') ?? undefined

  const authors = await prisma.author.findMany({
    orderBy: { name: 'asc' },
    take: page ? 10 : undefined,
    skip: page ? (Number(page) - 1) * 10 : undefined,
  })

  const authorsWithoutPassword = authors.map((author) => ({
    ...author,
    password: undefined,
  }))

  return Response.json({ authors: authorsWithoutPassword })
}

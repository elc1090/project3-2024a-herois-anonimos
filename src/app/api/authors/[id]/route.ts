import { prisma } from '@/lib/prisma'
import { compare, hash } from 'bcrypt'
import { z } from 'zod'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = z.string().parse(params.id)
  const author = await prisma.author.findUnique({ where: { id } })

  if (!author) {
    return Response.json(
      { message: 'Autor(a) não encontrado(a).' },
      { status: 404 },
    )
  }

  return Response.json({ author: { ...author, password: undefined } })
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const author = await prisma.author.findUnique({ where: { id } })

  if (!author) {
    return Response.json(
      { message: 'Autor(a) não encontrado(a).' },
      { status: 404 },
    )
  }

  await prisma.author.delete({ where: { id } })

  return new Response(null, { status: 204 })
}

const requestBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  oldPassword: z.string().min(6).optional(),
  password: z.string().min(6).optional(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const body = await request.json()

  const { name, email, oldPassword, password } = requestBodySchema.parse(body)

  const author = await prisma.author.findUnique({ where: { id } })

  if (!author) {
    return Response.json(
      { message: 'Autor(a) não encontrado(a).' },
      { status: 404 },
    )
  }

  if (oldPassword) {
    const oldPasswordIsMatch = await compare(oldPassword, author.password)

    if (!oldPasswordIsMatch) {
      return Response.json(
        { message: 'A senha antiga não confere.' },
        { status: 400 },
      )
    }
  }

  const changedAuthor = await prisma.author.update({
    where: {
      id,
    },
    data: {
      name,
      email,
      password: password ? await hash(password, 8) : undefined,
    },
  })

  return Response.json(
    { author: { ...changedAuthor, password: undefined } },
    { status: 200 },
  )
}

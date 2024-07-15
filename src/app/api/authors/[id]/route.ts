import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/r2-storage'
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

  const posts = await prisma.post.findMany({ where: { authorId: id } })

  await prisma.$transaction([
    prisma.post.deleteMany({ where: { authorId: id } }),
    prisma.author.delete({ where: { id } }),
  ])

  for (const post of posts) {
    for (const image of post.images) {
      await deleteFile({ fileUrl: image.url })
    }
  }

  return new Response(null, { status: 204 })
}

const requestBodySchema = z
  .object({
    name: z.string(),
    email: z.string().email(),
    oldPassword: z.string().optional(),
    password: z.string().optional(),
    role: z.union([z.literal('ADMIN'), z.literal('USER')]).nullish(),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.password.length >= 6
      }
      return true
    },
    {
      message: 'A senha deve ter no mínimo 6 dígitos.',
      path: ['password'],
    },
  )

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const body = await request.json()

  const { name, email, oldPassword, password, role } =
    requestBodySchema.parse(body)

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
      role: role ?? undefined,
      password: password ? await hash(password, 8) : undefined,
    },
  })

  return Response.json(
    { author: { ...changedAuthor, password: undefined } },
    { status: 200 },
  )
}

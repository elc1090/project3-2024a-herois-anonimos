import { prisma } from '@/lib/prisma'
import { createSlugFromText } from '@/utils/slug'
import { z } from 'zod'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = z.string().parse(params.id)

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
      { status: 404 },
    )
  }

  return Response.json({
    post: {
      id: post.id,
      title: post.title,
      content: post.content,
      slug: post.slug,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
      },
    },
  })
}

const requestBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const body = await request.json()

  const { title, content } = requestBodySchema.parse(body)

  const post = await prisma.post.findUnique({ where: { id } })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
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

  await prisma.post.update({
    where: { id },
    data: { title, content, slug },
  })

  return Response.json({
    post,
  })
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)

  const post = await prisma.post.findUnique({
    where: { id },
  })

  if (!post) {
    return Response.json(
      { message: 'Postagem não encontrada.' },
      { status: 404 },
    )
  }

  await prisma.question.deleteMany({
    where: { postId: id },
  })

  await prisma.post.delete({
    where: { id },
  })

  return new Response(null, { status: 204 })
}

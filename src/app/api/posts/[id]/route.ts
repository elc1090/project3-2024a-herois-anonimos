import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { deleteFile } from '@/lib/r2-storage'
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
      questions: post.questions,
      images: post.images.map((image) => ({
        name: image.name,
        type: image.type,
        url: `${env.CLOUDFLARE_URL}/${image.url}`,
      })),
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
  questions: z.array(
    z.object({
      title: z.string(),
      answer: z.string(),
    }),
  ),
  images: z.array(
    z.object({
      name: z.string(),
      type: z.string(),
      url: z.string(),
    }),
  ),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const body = await request.json()

  const { title, content, questions, images } = requestBodySchema.parse(body)

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

  if (postWithSameTitle && post.id !== id) {
    return Response.json(
      {
        message: 'Já existe uma postagem com o mesmo título.',
      },
      { status: 409 },
    )
  }

  const slug = createSlugFromText(title)

  await prisma.$transaction([
    prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        questions,
        images,
      },
    }),
  ])

  for (const image of post.images) {
    if (!images.some((i) => i.url === image.url)) {
      await deleteFile({ fileUrl: image.url })
    }
  }

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

  for (const image of post.images) {
    await deleteFile({ fileUrl: image.url })
  }

  await prisma.post.delete({
    where: { id },
  })

  return new Response(null, { status: 204 })
}

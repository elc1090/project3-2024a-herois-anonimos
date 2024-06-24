import { prisma } from '@/lib/prisma'
import { createSlugFromText } from '@/utils/slug'
import { z } from 'zod'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = z.string().parse(params.id)

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
      questions: true,
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
      questions: post.questions.map((question) => ({
        id: question.id,
        title: question.title,
        answer: question.answer,
      })),
    },
  })
}

const requestBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  questions: z.array(
    z.object({
      id: z.string().nullable(),
      title: z.string(),
      answer: z.string(),
    }),
  ),
})

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const id = z.string().parse(params.id)
  const body = await request.json()

  const { title, content, questions } = requestBodySchema.parse(body)

  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      questions: true,
    },
  })

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

  const questionsOnPost = post.questions.map((question) => question.id)
  const questionsIds = questions.map((question) => question.id)

  const removed = questionsOnPost
    .filter((questionId) => !questionsIds.includes(questionId))
    .filter((questionId) => questionId !== null)
  const added = questions.filter((question) => question.id === null)

  await prisma.$transaction([
    prisma.question.deleteMany({
      where: { id: { in: removed } },
    }),
    prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        slug,
        questions:
          added.length > 0
            ? {
                createMany: {
                  data: added.map((question) => ({
                    title: question.title,
                    answer: question.answer,
                  })),
                },
              }
            : undefined,
      },
    }),
  ])

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

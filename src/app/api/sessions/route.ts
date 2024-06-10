import { env } from '@/env'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'
import { z } from 'zod'
import jwt from 'jsonwebtoken'

const requestBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = requestBodySchema.parse(body)

  const authorExists = await prisma.authors.findUnique({
    where: {
      email,
    },
  })

  if (!authorExists) {
    return Response.json(
      { message: 'E-mail ou senha incorreta.' },
      { status: 401 },
    )
  }

  const passwordIsCorrectly = await compare(password, authorExists.password)

  if (!passwordIsCorrectly) {
    return Response.json(
      { message: 'E-mail ou senha incorreta.' },
      { status: 401 },
    )
  }

  const token = jwt.sign(
    {
      sub: authorExists.id,
    },
    env.APP_SECRET,
    { expiresIn: '8h' },
  )

  return Response.json({
    token,
  })
}

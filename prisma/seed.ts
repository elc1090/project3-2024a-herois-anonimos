import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { createSlugFromText } from '../src/utils/slug'

import { posts } from './data.json'

const prisma = new PrismaClient()

async function seed() {
  await prisma.question.deleteMany()
  await prisma.post.deleteMany()
  await prisma.author.deleteMany()

  const hashedPassword = await hash('123456', 1)

  const author1 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: 'john@example.com',
      password: hashedPassword,
    },
  })

  const author2 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
    },
  })

  const author3 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
    },
  })

  for (const post of posts) {
    const slug = createSlugFromText(post.title)

    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        slug,
        authorId: faker.helpers.arrayElement([
          author1.id,
          author2.id,
          author3.id,
        ]),
        questions: {
          createMany: {
            data: post.questions.map((question) => ({
              title: question.title,
              answer: question.answer,
            })),
          },
        },
      },
    })
  }
}

seed().then(() => {
  console.log('Database seeded!')
})

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { createSlugFromText } from '../src/utils/slug'

const prisma = new PrismaClient()

async function seed() {
  await prisma.question.deleteMany()
  await prisma.post.deleteMany()
  await prisma.author.deleteMany()

  const hashedPassword = await hash('123456', 1)

  const author1 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
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

  for (let i = 0; i < 25; i++) {
    const title = faker.lorem.word(5)
    const slug = createSlugFromText(title)

    const post = await prisma.post.create({
      data: {
        authorId: faker.helpers.arrayElement([
          author1.id,
          author2.id,
          author3.id,
        ]),
        title,
        slug,
        content: faker.lorem.paragraph(5),
      },
    })

    await prisma.question.createMany({
      data: [
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
        {
          title: faker.lorem.sentence(5).replace('.', '?'),
          answer: faker.lorem.paragraphs(5),
          postId: post.id,
        },
      ],
    })
  }
}

seed().then(() => {
  console.log('Database seeded!')
})

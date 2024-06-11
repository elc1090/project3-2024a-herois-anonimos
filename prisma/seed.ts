import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function seed() {
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

  await prisma.post.createMany({
    data: [
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author2.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author3.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author3.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author2.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author2.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author2.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author2.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author1.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
      {
        authorId: author3.id,
        title: faker.lorem.word(5),
        content: faker.lorem.paragraph(5),
      },
    ],
  })
}

seed().then(() => {
  console.log('Database seeded!')
})

import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hash } from 'bcrypt'
import { createSlugFromText } from '../src/utils/slug'

import { posts } from './data.json'

const prisma = new PrismaClient()

async function seed() {
  await prisma.post.deleteMany()
  await prisma.author.deleteMany()

  const hashedPassword = await hash('123456', 1)

  const author1 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: 'john@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  const author2 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: 'USER',
    },
  })

  const author3 = await prisma.author.create({
    data: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: 'USER',
    },
  })

  for (const post of posts) {
    const images = [
      'example1.jpg',
      'example2.jpg',
      'example3.jpg',
      'example4.jpg',
      'example5.jpg',
      'example6.jpg',
      'example7.jpg',
      'example8.jpg',
      'example9.jpg',
    ]

    const slug = createSlugFromText(post.title)

    const selectedImage = faker.helpers.arrayElement(images)
    const [imageName, imageType] = selectedImage.split('.')
    await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        slug,
        questions: post.questions,
        images: [
          {
            name: imageName,
            type: imageType,
            url: `examples/${selectedImage}`,
          },
        ],
        authorId: faker.helpers.arrayElement([
          author1.id,
          author2.id,
          author3.id,
        ]),
        createdAt: faker.date.between({
          from: new Date('2024-04-29'),
          to: new Date(),
        }),
      },
    })
  }
}

seed().then(() => {
  console.log('Database seeded!')
})

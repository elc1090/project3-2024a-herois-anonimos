import type { NextRequest } from 'next/server'
import { z } from 'zod'

import { upload } from '@/lib/r2-storage'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const body = Object.fromEntries(formData)
    const file = (body.file as File) || null

    const directory = z.string().parse(body.directory)

    if (!file) {
      return Response.json(
        { error: true, message: 'Erro ao processar arquivo.' },
        { status: 500 },
      )
    }

    const { url } = await upload({
      directory,
      fileName: file.name.replace(/\s+/g, '-'),
      fileType: file.type,
      body: Buffer.from(await file.arrayBuffer()),
    })

    return Response.json(
      {
        file: {
          name: file.name,
          type: file.type,
          url: directory ? `${directory}/${url}` : url,
        },
      },
      { status: 201 },
    )
  } catch (err) {
    return Response.json({ message: err }, { status: 500 })
  }
}

import { randomUUID } from 'node:crypto'

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'

import { env } from '@/env'

const accountId = env.CLOUDFLARE_ACCOUNT_ID
const accessKeyId = env.AWS_ACCESS_KEY_ID
const secretAccessKey = env.AWS_SECRET_ACCESS_KEY
const bucketName = env.AWS_BUCKET_NAME

export const storageClient = new S3Client({
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  region: 'auto',
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

interface UploadProps {
  directory?: string | null
  fileName: string
  fileType: string
  body: Buffer
}

export async function upload({
  directory,
  fileName,
  fileType,
  body,
}: UploadProps): Promise<{ url: string }> {
  const uploadId = randomUUID()
  const name = fileName.replace(/\s+/g, '%')
  const uniqueFileName = `${uploadId}-${name}`

  await storageClient.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: directory ? `${directory}/${uniqueFileName}` : uniqueFileName,
      ContentType: fileType,
      Body: body,
    }),
  )

  return {
    url: uniqueFileName,
  }
}

export async function deleteFile({ fileUrl }: { fileUrl: string }) {
  await storageClient.send(
    new DeleteObjectCommand({
      Bucket: bucketName,
      Key: fileUrl,
    }),
  )
}

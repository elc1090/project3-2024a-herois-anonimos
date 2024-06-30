import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    APP_SECRET: z.string() || '',
    CLOUDFLARE_ACCOUNT_ID: z.string(),
    AWS_ACCESS_KEY_ID: z.string(),
    AWS_SECRET_ACCESS_KEY: z.string(),
    AWS_BUCKET_NAME: z.string(),
    CLOUDFLARE_URL: z.string().url(),
  },

  client: {
    NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  },

  runtimeEnv: {
    APP_SECRET: process.env.APP_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    CLOUDFLARE_ACCOUNT_ID: process.env.CLOUDFLARE_ACCOUNT_ID,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    CLOUDFLARE_URL: process.env.CLOUDFLARE_URL,
  },
})

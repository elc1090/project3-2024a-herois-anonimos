import { env } from '@/env'

export async function api(path: string, init?: RequestInit) {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL
  const apiPrefix = '/api'
  const url = new URL(apiPrefix.concat(path), baseUrl)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const response = await fetch(url, init)

  if ([200, 201, 202, 203].includes(response.status))
    return await response.json()

  if (response.status === 204) return null

  const { message } = await response.json()
  throw new Error(message)
}

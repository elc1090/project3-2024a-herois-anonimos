'use server'

import { env } from '@/env'
import { cookies } from 'next/headers'

export async function api(path: string, init?: RequestInit) {
  const baseUrl = env.NEXT_PUBLIC_API_BASE_URL
  const apiPrefix = '/api'
  const url = new URL(apiPrefix.concat(path), baseUrl)

  const token = cookies().get('@dev-web:token')?.value

  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  })

  if ([200, 201, 202, 203].includes(response.status)) {
    const data = await response.json()

    return {
      success: true,
      data,
      message: null,
      errors: null,
    }
  }

  if (response.status === 204) {
    return {
      success: true,
      data: null,
      message: null,
      errors: null,
    }
  }

  const { message } = await response.json()
  return {
    success: false,
    data: null,
    message,
    errors: null,
  }
}

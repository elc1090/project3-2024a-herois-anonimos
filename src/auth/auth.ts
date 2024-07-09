import { cookies } from 'next/headers'

export function isAuthenticated() {
  return !!cookies().get('@dev-web:token')?.value
}

export function isAdmin() {
  const cached = cookies().get('@dev-web:user')?.value

  if (!cached) {
    return false
  }

  const user = JSON.parse(cached)
  return user.role === 'ADMIN'
}

import { cookies } from 'next/headers'

export function isAuthenticated() {
  return !!cookies().get('@dev-web:token')?.value
}
